<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

/**
 * Class Jobs
 *
 * @property string           $id
 * @property string           $jobId
 * @property int              $runDate
 * @property int              $runTime
 * @property bool             $successful
 * @property string           $result
 * @property string           $serverIp
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Job extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'Jobs';
    protected static $entityMask = '{name}';

    /**
     * This method is called during instantiation to build entity structure
     * @return void
     */
    protected function entityStructure()
    {
        $this->attr('name')->char()->setValidators('required,unique')->setValidationMessages([
            'unique' => 'This cron job already exists.'
        ])->setToArrayDefault();

        $this->attr('enabled')->boolean()->setDefaultValue(true)->setToArrayDefault();
    }
}