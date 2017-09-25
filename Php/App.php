<?php

namespace Apps\CronManager\Php;

use Apps\CronManager\Php\Lib\CronJobSuccessNotification;

class App extends \Apps\Webiny\Php\Lib\Apps\App
{
    public function getAppNotificationTypes()
    {
        return [
            CronJobSuccessNotification::class
        ];
    }
}