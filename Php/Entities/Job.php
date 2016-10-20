<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;

/**
 * Class Jobs
 *
 * @property string $id
 * @property string $name
 * @property string $description
 * @property string $url
 * @property string $frequency
 * @property string $timezone
 * @property string $targetType
 * @property string $target
 * @property int    $timeout
 * @property array  $notifyOn
 * @property array  $notifyEmails
 * @property bool   $enabled
 * @property int    $nextRunDate
 * @property int    $runHistory
 * @property string $status
 * @property bool   $isInactive
 * @property bool   $isScheduled
 * @property bool   $isRunning
 * @property array  $stats
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Job extends AbstractEntity
{
    use WebinyTrait;

    const STATUS_INACTIVE = 'inactive';
    const STATUS_SCHEDULED = 'scheduled';
    const STATUS_RUNNING = 'running';

    const TARGET_URL = 'url';
    const TARGET_CLASS = 'class';

    protected static $entityCollection = 'CronManagerJobs';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setValidators('required,unique')->setValidationMessages([
            'unique' => 'This cron job already exists.'
        ])->setToArrayDefault();

        $this->attr('description')->char()->setToArrayDefault();
        $this->attr('url')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('timeout')->integer()->setToArrayDefault();
        $this->attr('runHistory')->integer()->setToArrayDefault();
        $this->attr('timezone')->char()->setValidators('required')->setToArrayDefault();

        $this->attr('notifyOn')->arr()->setToArrayDefault();
        $this->attr('notifyEmails')->arr()->setToArrayDefault();

        $this->attr('enabled')->boolean()->setDefaultValue(true)->setToArrayDefault()->onSet(function ($enabled) {
            // in case we create a new cron job, or in case if we re-enable a disabled cron job, we need to set the next run date
            if ($enabled) {
                $this->scheduleNextRunDate();
                $this->status = self::STATUS_SCHEDULED;
            } else {
                $this->status = self::STATUS_INACTIVE;
            }

            return $enabled;
        })->setAfterPopulate();

        $this->attr('target')->char()->setToArrayDefault()->setValidators('required');
        $this->attr('targetType')->char()->setToArrayDefault()->setValidators('required,in:url:class');

        $this->attr('frequency')->many2one('Frequency')->setEntity('\Apps\CronManager\Php\Entities\JobFrequency');
        $this->attr('nextRunDate')->char()->setToArrayDefault();

        $this->attr('status')->char()->setDefaultValue(self::STATUS_INACTIVE)->setValidators('in:inactive:scheduled:running');

        $this->attr('isInactive')->dynamic(function () {
            return $this->status === self::STATUS_INACTIVE;
        });

        $this->attr('isScheduled')->dynamic(function () {
            return $this->status === self::STATUS_SCHEDULED;
        });

        $this->attr('isRunning')->dynamic(function () {
            return $this->status === self::STATUS_RUNNING;
        });

        $this->attr('stats')->object()->setDefaultValue([
            'totalExecTime'  => 0,
            'numberOfRuns'   => 0,
            'successfulRuns' => 0
        ])->setToArrayDefault();

        $this->api('GET', 'timezones', function () {
            return $this->listTimezones();
        });

        $this->api('POST', 'validators/targets/class-names', function () {
            $className = $this->wRequest()->getRequestData()['className'];
            self::validateClassTarget($className);
        })->setBodyValidators(['className' => 'required']);
    }

    /**
     * Returns if given class name is a valid cron job target class
     *
     * @param $className
     *
     * @throws AppException
     */
    public static function validateClassTarget($className)
    {
        // Working example - Apps\TestApp\Php\Services\Crons\UpdateStats
        $re = '/Apps\\\\(.*)\\\\Php\\\\(.*)/';
        preg_match_all($re, $className, $matches);

        if (empty($matches[0])) {
            throw new AppException('Invalid namespace.');
        }

        $className = self::wRequest()->getRequestData()['className'];

        $parts = self::str($className)->explode('\\')->filter()->values()->val();
        $classFile = self::wConfig()->get('Application.AbsolutePath') . join('/', $parts) . '.php';
        if (!file_exists($classFile)) {
            throw new AppException('Namespace is valid, but file does not exist.');
        }

        if (!class_exists($className)) {
            throw new AppException('Namespace is valid, file exists but class does not.');
        }

        $classInterfaces = class_implements($className);
        if (!isset($classInterfaces['Apps\CronManager\Php\Interfaces\CronJobInterface'])) {
            throw new AppException('Class does not implement CronJobInterface interface.');
        }
    }

    public function scheduleNextRunDate()
    {
        // set timezone
        date_default_timezone_set(str_replace(' ', '_', $this->timezone));

        $cronRunner = \Cron\CronExpression::factory($this->frequency->mask);
        $runDate = $cronRunner->getNextRunDate('now', 0, true);

        // we need to have at least one minute offset between the current date and the next run date
        if ($runDate->format('U') - time() <= 60) {
            $runDate = $cronRunner->getNextRunDate('now', 1, true);
        }

        $this->nextRunDate = $runDate->format('c');
    }

    /**
     * This determines if this job can be triggered when Runner is triggered
     * Job can be triggered if following conditions are met:
     *  - current time has passed job's execution time
     *  - current job is not already in 'running' state (can happen if cron job takes a bit longer to run)
     * @return bool
     */
    public function shouldJobRunNow()
    {
        if (!$this->enabled || $this->isRunning) {
            return false;
        }

        $tz = date_default_timezone_get();
        date_default_timezone_set(str_replace(' ', '_', $this->timezone));

        // Get the timestamp of the job
        $jobTs = $this->datetime($this->nextRunDate)->format('U');
        date_default_timezone_set($tz);

        return time() > $jobTs;
    }

    public function listTimezones()
    {
        $timezone_identifiers = \DateTimeZone::listIdentifiers();

        $result = [];
        foreach ($timezone_identifiers as $ti) {
            $result[] = str_replace('_', ' ', $ti);
        }

        return $result;
    }

    public function cleanupRunHistory()
    {
        if ($this->runHistory == '0') {
            return;
        }

        // get total number of records
        $totalNumber = JobHistory::find(['job' => $this->id], ['id'])->totalCount();

        // delete the records over the runHistory limit
        if ($totalNumber > $this->runHistory) {
            JobHistory::find(['job' => $this->id], ['id'], ($totalNumber - $this->runHistory))->delete();
        }
    }

}