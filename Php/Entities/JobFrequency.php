<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

/**
 * Class Jobs
 *
 * @property string $id
 * @property string $name
 * @property string $mask
 *
 * @package Apps\Core\Php\Entities
 *
 */
class JobFrequency extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'JobFrequency';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('mask')->char()->setValidators('required')->setToArrayDefault();

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
                $cronRunner = \Cron\CronExpression::factory($data['mask']);

                $prev = $cronRunner->getNextRunDate('now', 0, true)->format('Y-m-d H:i:s');
                $next = $cronRunner->getNextRunDate('now', 1, true)->format('Y-m-d H:i:s');

                $frequency = '(' . $prev . ', ' . $next . ')';
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