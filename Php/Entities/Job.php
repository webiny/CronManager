<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;

/**
 * Class Jobs
 *
 * @property string $id
 * @property string $name
 * @property string $description
 * @property string $frequency
 * @property string $timezone
 * @property string $targetType
 * @property string $target
 * @property int    $timeout
 * @property array  $notifyOn
 * @property array  $notifyEmails
 * @property bool   $enabled
 * @property int    $lastRunDate
 * @property int    $nextRunDate
 * @property string $status
 * @property bool   $isInactive
 * @property bool   $isScheduled
 * @property bool   $isRunning
 * @property array  $stats
 *
 * @package Apps\Webiny\Php\Entities
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
        $this->attr('timeout')->integer()->setToArrayDefault();
        $this->attr('timezone')->char()->setValidators('required')->setToArrayDefault();

        $this->attr('notifyOn')->arr()->setToArrayDefault();
        $this->attr('notifyEmails')->arr()->setToArrayDefault();

        $this->attr('status')->char()->setDefaultValue(self::STATUS_INACTIVE)->setValidators('in:inactive:scheduled:running');
        $this->attr('enabled')->boolean()->setDefaultValue(true)->setToArrayDefault()->onSet(function ($enabled) {
            // in case we create a new cron job, or in case if we re-enable a disabled cron job, we need to set the next run date
            $this->scheduleNextRunDate();
            if ($enabled) {
                $this->status = self::STATUS_SCHEDULED;
            } else {
                $this->status = self::STATUS_INACTIVE;
            }

            return $enabled;
        })->setAfterPopulate();

        $this->attr('target')->char()->onSet(function ($value) {
            return trim($value);
        })->setToArrayDefault()->setValidators('required');

        $this->attr('targetType')->char()->setToArrayDefault()->setValidators('required,in:url:class');

        $this->attr('frequency')->many2one()->setEntity('\Apps\CronManager\Php\Entities\JobFrequency');
        $this->attr('nextRunDate')->char()->setToArrayDefault();
        $this->attr('lastRunDate')->datetime();

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

        $this->api('GET', '{id}/history', function () {
            $params = [
                ['job' => $this->id] + $this->wRequest()->getFilters(),
                $this->wRequest()->getSortFields(),
                $this->wRequest()->getPerPage(),
                $this->wRequest()->getPage()
            ];

            return $this->apiFormatList(JobHistory::find(...$params), $this->wRequest()->getFields());
        });

        $this->api('POST', 'validators/targets/class-names', function () {
            $className = $this->wRequest()->getRequestData()['className'];
            $this->validateClassTarget($className);
        })->setBodyValidators(['className' => 'required']);
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
        if (!$this->enabled) {
            return false;
        }

        // check if job is hanging, if so, let's run it again
        if ($this->isRunning) {
            if (time() > ($this->timeout + strtotime($this->lastRunDate))) {
                return true;
            }
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

    /**
     * Returns if given class name is a valid cron job target class
     *
     * @param $className
     *
     * @throws AppException
     */
    private function validateClassTarget($className)
    {
        // Working example - Apps\TestApp\Php\Services\Crons\UpdateStats
        $re = '/Apps\\\\(.*)\\\\Php\\\\(.*)/';
        preg_match_all($re, $className, $matches);

        if (empty($matches[0])) {
            throw new AppException('Invalid namespace.');
        }

        $className = $this->wRequest()->getRequestData()['className'];

        $parts = $this->str($className)->explode('\\')->filter()->values()->val();
        $classFile = $this->wConfig()->get('Application.AbsolutePath') . join('/', $parts) . '.php';
        if (!file_exists($classFile)) {
            throw new AppException('Namespace is valid but file does not exist.');
        }

        if (!class_exists($className)) {
            throw new AppException('Namespace is valid but given class was not found in the file.');
        }

        $classInterfaces = class_implements($className);
        if (!isset($classInterfaces['Apps\CronManager\Php\Interfaces\CronJobInterface'])) {
            throw new AppException('Class must implement CronJobInterface.');
        }
    }
}