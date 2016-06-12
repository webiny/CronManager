<?php
namespace Apps\CronManager\Php\Services;

set_time_limit(0);

use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\CronManager\Php\Entities\Job;
use Apps\CronManager\Php\Entities\JobHistory;
use Apps\CronManager\Php\Entities\JobRun;

class Runner extends AbstractService
{
    function __construct()
    {
        $this->api('get', 'run', function () {
            return $this->run();
        });

        $this->api('get', 'run-job/{job}', function (Job $job) {
            return $this->runJob($job);
        });
    }

    private function run()
    {
        // get all active cron jobs
        $runDate = $this->datetime(strtotime(date('Y-m-d H:i:00')))->setTimezone('UTC');
        $jobs = Job::find(['enabled' => true, 'nextRunDate' => $runDate->getMongoDate()]);
        // temp - for testing we skip the date filter
        //$jobs = Job::find(['enabled' => true]);

        foreach ($jobs as $j) {
            $this->issueJob($j);
        }
    }

    private function issueJob(Job $job)
    {
        // fork the cron request into separate process
        $url = $this->wConfig()->get('Application.ApiPath') . '/services/cron-manager/runner/run-job/' . $job->getId();

        $cmd = "curl -X GET " . $url . " > /dev/null 2>&1 &";
        exec($cmd);
    }


    private function runJob(Job $job)
    {
        // update job status to running
        $job->status = 3; // running
        $job->save();

        // create the job url
        $url = $job->url;
        if (strpos($url, 'http') !== 0) {
            $url = rtrim($this->wConfig()->get('Application.WebPath'), '/') . '/' . ltrim($job->url, '/');
        }

        // issue request for the job
        $debugWrapper = fopen('php://temp', 'r+');
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_STDERR, $debugWrapper);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $job->timeout);
        curl_setopt($ch, CURLOPT_TIMEOUT, $job->timeout);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        $curlInfo = curl_getinfo($ch);

        // get the debug log
        rewind($debugWrapper);
        $debugLog = fread($debugWrapper, 8192);
        fclose($debugWrapper);

        // populate history data
        $jobHistory = new JobHistory();
        $jobHistory->job = $job->getId();
        $jobHistory->debugLog = $debugLog;
        $jobHistory->runDate = $this->datetime()->getMongoDate();
        $jobHistory->serverIp = $curlInfo['primary_ip'];
        $jobHistory->runTime = $curlInfo['total_time'];
        $jobHistory->responseCode = $curlInfo['http_code'];
        $jobHistory->result = $result;

        // update job stats
        $job->stats->totalExecTime += $jobHistory->runTime;
        $job->stats->numberOfRuns += 1;

        // validate the curl response
        if ($jobHistory->responseCode >= 200 && $jobHistory->responseCode <= 399) {
            $jobHistory->successful = true;
            $job->stats->successfulRuns += 1;
        } else {
            $jobHistory->successful = false;
        }
        curl_close($ch);

        $jobHistory->save();

        // set status to scheduled
        $job->status = 2; // scheduled

        // set the date for the next run
        $job->scheduleNextRunDate();
        $job->save();
    }
}