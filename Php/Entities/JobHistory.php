<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

/**
 * Class Jobs
 *
 * @property string           $id
 * @property string           $job
 * @property int              $runDate
 * @property int              $runTime
 * @property bool             $successful
 * @property string           $result
 * @property string           $serverIp
 * @property string           $debugLog
 * @property string           $responseCode
 *
 * @package Apps\Core\Php\Entities
 *
 */
class JobHistory extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'JobHistory';
    protected static $entityMask = '{job}';

    /**
     * This method is called during instantiation to build entity structure
     * @return void
     */
    protected function entityStructure()
    {
        $job = '\Apps\CronManager\Php\Entities\Job';
        $this->attr('job')->many2one('Job')->setEntity($job);
        $this->attr('runDate')->datetime();
        $this->attr('runTime')->float();
        $this->attr('successful')->boolean();
        $this->attr('result')->char();
        $this->attr('serverIp')->char();
        $this->attr('debugLog')->char();
        $this->attr('responseCode')->integer();
    }
}