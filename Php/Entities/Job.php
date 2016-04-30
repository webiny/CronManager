<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

/**
 * Class Jobs
 *
 * @property string            $id
 * @property string            $name
 * @property string            $description
 * @property string            $url
 * @property string            $frequency
 * @property int               $timeout
 * @property array             $notifyOn
 * @property array             $notifyEmails
 * @property bool              $enabled
 * @property int               $nextRunDate
 * @property string            $status
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

        $this->attr('description')->char()->setToArrayDefault();
        $this->attr('url')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('timeout')->integer()->setToArrayDefault();
        $this->attr('notifyOn')->arr()->setToArrayDefault();
        $this->attr('notifyEmails')->arr()->setToArrayDefault();
        $this->attr('enabled')->boolean()->setDefaultValue(true)->setToArrayDefault();

        $frequency = '\Apps\CronManager\Php\Entities\JobFrequency';
        $this->attr('frequency')->many2one('Frequency')->setEntity($frequency);
    }
}