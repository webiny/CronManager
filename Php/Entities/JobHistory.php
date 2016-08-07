<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;

/**
 * Class Jobs
 *
 * @property string $id
 * @property Job    $job
 * @property int    $runDate
 * @property int    $runTime
 * @property bool   $successful
 * @property string $result
 * @property string $serverIp
 * @property string $debugLog
 * @property string $responseCode
 *
 * @package Apps\Core\Php\Entities
 *
 */
class JobHistory extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'JobHistory';
    protected static $entityMask = '{job}';

    public function __construct()
    {
        parent::__construct();
        $job = '\Apps\CronManager\Php\Entities\Job';
        $this->attr('job')->many2one()->setEntity($job);
        $this->attr('runDate')->datetime();
        $this->attr('runTime')->float();
        $this->attr('successful')->boolean();
        $this->attr('result')->char();
        $this->attr('serverIp')->char();
        $this->attr('debugLog')->char();
        $this->attr('responseCode')->integer();
    }
}