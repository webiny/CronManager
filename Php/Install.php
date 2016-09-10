<?php
namespace Apps\CronManager\Php;

use Apps\Core\Php\DevTools\AbstractInstall;
use Apps\Core\Php\Entities\UserRole;
use Apps\Core\Php\PackageManager\App;

class Install extends AbstractInstall
{
    protected function run(App $app)
    {
        $role = new UserRole();
        $role->name = 'Manage Cron Jobs';
        $role->description = 'Allows user to manage all system cron jobs';
        $role->save();
    }
}