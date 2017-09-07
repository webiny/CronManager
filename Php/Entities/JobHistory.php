<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;

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
 * @package Apps\Webiny\Php\Entities
 *
 */
class JobHistory extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'CronManagerJobHistory';
    protected static $entityMask = '{job}';

    public function __construct()
    {
        parent::__construct();
        $this->attr('job')->many2one()->setEntity('\Apps\CronManager\Php\Entities\Job');
        $this->attr('runDate')->datetime();
        $this->attr('runTime')->float();
        $this->attr('successful')->boolean();
        $this->attr('result')->char();
        $this->attr('serverIp')->char();
        $this->attr('debugLog')->object();
        $this->attr('responseCode')->integer();
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        $indexes->add(new SingleIndex('job', 'job'));
        $indexes->add(new SingleIndex('createdOn', 'createdOn', false, false, false, 2592000)); // expire after 30 days
    }
}