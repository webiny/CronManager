<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

/**
 * Class Jobs
 *
 * @property string $id
 * @property string $name
 * @property string $description
 * @property string $url
 * @property string $frequency
 * @property string $timezone
 * @property int    $timeout
 * @property array  $notifyOn
 * @property array  $notifyEmails
 * @property bool   $enabled
 * @property int    $nextRunDate
 * @property string $status
 * @property array  $stats
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Job extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'Jobs';
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
        $this->attr('timezone')->char()->setValidators('required')->setToArrayDefault();

        $this->attr('notifyOn')->arr()->setToArrayDefault();
        $this->attr('notifyEmails')->arr()->setToArrayDefault();

        $this->attr('enabled')->boolean()->setDefaultValue(true)->setToArrayDefault()->onSet(function ($enabled) {
            // in case we create a new cron job, or in case if we re-enable a disabled cron job, we need to set the next run date
            if ($enabled) {
                $this->scheduleNextRunDate($this);
                $this->status = 2;
            } else {
                $this->status = 1;
            }

            return $enabled;
        })->setAfterPopulate();

        $frequency = '\Apps\CronManager\Php\Entities\JobFrequency';
        $this->attr('frequency')->many2one('Frequency')->setEntity($frequency);
        $this->attr('nextRunDate')->char()->setToArrayDefault();

        /**
         * 1 - inactive
         * 2 - scheduled
         * 3 - running
         */
        $this->attr('status')->integer()->setDefaultValue(0);
        $this->attr('stats')->object()->setDefaultValue([
            'totalExecTime'  => 0,
            'numberOfRuns'   => 0,
            'successfulRuns' => 0
        ])->setToArrayDefault();

        $this->api('GET', 'list-timezones', function () {
            return $this->listTimezones();
        });
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

    public function shouldJobRunNow()
    {
        $tz = date_default_timezone_get();
        date_default_timezone_set(str_replace(' ', '_', $this->timezone));

        // get the timestamp of the job
        $jobTs = $this->datetime($this->nextRunDate)->format('U');


        date_default_timezone_set($tz);
        // job should run if the time diff is less than 60 seconds
        if ((time() - $jobTs) < 60 && (time() - $jobTs) > 0) {
            return true;
        }

        return false;
    }

    public function listTimezones()
    {
        $timezone_identifiers = \DateTimeZone::listIdentifiers();

        $result = [];
        foreach($timezone_identifiers as $ti){
            $result[] = str_replace('_', ' ', $ti);
        }

        return $result;
    }
}