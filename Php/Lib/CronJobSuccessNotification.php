<?php

namespace Apps\CronManager\Php\Lib;

use Apps\CronManager\Php\Entities\Job;
use Apps\Webiny\Php\Lib\AppNotifications\AbstractAppNotification;

class CronJobSuccessNotification extends AbstractAppNotification
{
    const TITLE = 'Cron Job Success';
    const DESCRIPTION = 'Published when a cron job has finished executing';
    const SLUG = 'cron-job-success';
    const ROLES = ['cron-manager'];

    /**
     * @var Job
     */
    private $job;

    public function getSubject()
    {
        return 'Cron Job';
    }

    public function getTemplate()
    {
        return 'Cron job {name} finished successfully!';
    }

    public function getText()
    {
        $text = $this->str($this->getTemplate());
        $text->replace('{name}', $this->job->name);

        return $text->val();
    }

    public function getData()
    {
        return ['id' => $this->job->id, 'name' => $this->job->name];
    }

    public function setJob(Job $job)
    {
        $this->job = $job;

        return $this;
    }
}