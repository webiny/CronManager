<?php

namespace Apps\CronManager\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Webiny\Component\Entity\Attribute\Validation\ValidationException;
use Webiny\Component\Mongo\Index\CompoundIndex;

/**
 * Class Jobs
 *
 * @property string $id
 * @property string $name
 * @property string $mask
 */
class JobFrequency extends AbstractEntity
{
    protected static $classId = 'CronManager.Entities.JobFrequency';
    protected static $i18nNamespace = 'CronManager.Entities.JobFrequency';
    protected static $collection = 'CronManagerJobFrequency';
    protected static $mask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $maskValidator = function ($mask) {
            $message = $this->getFrequency($mask);
            if (!$message) {
                throw new ValidationException($this->wI18n('Invalid cron job pattern'));
            }
        };

        $this->attr('name')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('mask')
             ->char()
             ->setValidators(['required', $maskValidator, 'unique'])
             ->setToArrayDefault()
             ->setValidationMessages(['unique' => 'A frequency with this mask already exists!']);
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name Validate
         * @api.url /validate
         * @api.body.mask string Cron job mask that will be validated
         */
        $api->post('validate', function () {
            $data = $this->wRequest()->getRequestData();
            $mask = trim($data['mask']);

            $frequency = $this->getFrequency($mask);
            $status = true;
            if (!$frequency) {
                $status = false;
            } else {
                if (static::findOne(['mask' => $mask])) {
                    $status = false;
                    $frequency = 'A frequency with this mask already exists!';
                }
            }

            return [
                'status'    => $status,
                'frequency' => $frequency
            ];
        })->setBodyValidators(['mask' => 'required']);
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);
        $indexes->add(new CompoundIndex('mask', ['mask', 'deletedOn'], false, true));
    }

    private function getFrequency($mask)
    {
        try {
            $cronRunner = \Cron\CronExpression::factory($mask);

            $prev = $cronRunner->getNextRunDate('now', 0, true)->format('Y-m-d H:i:00');
            $next = $cronRunner->getNextRunDate('now', 1, true)->format('Y-m-d H:i:00');

            return '(' . $prev . ', ' . $next . ')';
        } catch (\Exception $e) {
            return '';
        }
    }
}