<?php
namespace Apps\CronManager\Php\Services;

use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\CronManager\Php\Entities\Job;

class Runner extends AbstractService
{
    function __construct()
    {
        $this->api('get', 'run', function () {
            die('running');
            return $this->run();
        });

        # /services/cron-manager/runner/run-job/...
        $this->api('get', 'runJob', function (Job $job) {
            return $this->runJob($job);
        });
    }

    private function run()
    {
        die('running');
        // get all active cron jobs
        $jobs = Job::find(['enabled' => true, 'nextRunDate' => time(date('Y-m-d H:i:00'))]);

        foreach ($jobs as $j) {
            $this->issueJob($j);
        }
    }

    private function issueJob(Job $job)
    {
        // build curl request
        $ch = curl_init();

        $url = $job->url;

        if (strpos($url, 'http') !== 0) {
            $url .= rtrim($this->wConfig()->get('WebPath'), '/') . '/' . ltrim($job->url, '/');
        }

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
        // we timeout the request on this end, but when it finishes it's updated via the runner
        curl_setopt($ch, CURLOPT_TIMEOUT_MS, 1);

        curl_exec($ch);
        curl_close($ch);
    }


    private function runJob(Job $job)
    {
        // update job status to running
        $job->


        // issue request for the job
        $ctx = stream_context_create(array(
            'http' => array(
                'timeout' => 1
            )
        ));
        $result = file_get_contents("http://example.com/", 0, $ctx);

        // update the status of the run

        // set the date for the next run


    }
}