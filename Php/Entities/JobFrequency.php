<?php
namespace Apps\CronManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\Attribute\Validation\ValidationException;

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

        $maskValidator = function ($mask) {
            $frequency = $this->getFrequency($mask);
            if (!$frequency) {
                throw new ValidationException('Invalid cron job pattern');
            }
        };

        $this->attr('name')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('mask')->char()->setValidators(['required', $maskValidator])->setToArrayDefault();

        /**
         * @api.name Validate
         * @api.url /validate
         * @api.body.mask string Cron job mask that will be validated
         */
        $this->api('POST', 'validate', function () {
            $data = $this->wRequest()->getRequestData();

            $frequency = $this->getFrequency($data['mask']);
            $status = true;
            if (!$frequency) {
                $status = false;
            }

            return [
                'status'    => $status,
                'frequency' => $frequency
            ];
        })->setBodyValidators(['mask' => 'required']);
    }

    private function getFrequency($mask)
    {
        try {
            $cronRunner = \Cron\CronExpression::factory($mask);

            $prev = $cronRunner->getNextRunDate('now', 0, true)->format('Y-m-d H:i:s');
            $next = $cronRunner->getNextRunDate('now', 1, true)->format('Y-m-d H:i:s');

            return '(' . $prev . ', ' . $next . ')';
        } catch (\Exception $e) {
            return '';
        }
    }
}