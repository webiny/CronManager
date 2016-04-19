<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\CronManager\Php\Lib\CronSchedule;

/**
 * Class Jobs
 *
 * @property string           $id
 * @property string           $name
 * @property string           $mask
 *
 * @package Apps\Core\Php\Entities
 *
 */
class JobFrequency extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'JobFrequency';
    protected static $entityMask = '{name}';

    /**
     * This method is called during instantiation to build entity structure
     * @return void
     */
    protected function entityStructure()
    {
        $this->attr('name')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('mask')->char()->setValidators('required')->setToArrayDefault();
    }

    protected function entityApi()
    {
        /**
         * @api.name Validate
         * @api.url /validate
         * @api.body.mask string Cron job mask that will be validated
         */
        $this->api('POST', 'validate', function () {
            $data = $this->wRequest()->getRequestData();

            $frequency = '';
            $status = true;

            try {
                $cron = CronSchedule::fromCronString($data['mask']);
                $cronRunner = \Cron\CronExpression::factory($data['mask']);

                $prev = $cronRunner->getNextRunDate('now', 0, true)->format('Y-m-d H:i:s');
                $next = $cronRunner->getNextRunDate('now', 1, true)->format('Y-m-d H:i:s');

                $frequency = $cron->asNaturalLanguage() . ' (e.g. ' . $prev . ', ' . $next . ')';
            } catch (\Exception $e) {
                $status = false;
            }


            return [
                'status'    => $status,
                'frequency' => $frequency
            ];
        })->setBodyValidators(['mask' => 'required']);
    }


}