<?php
namespace Apps\CronManager\Php\Services;

set_time_limit(0);

use Apps\Webiny\Php\DevTools\Services\AbstractService;
use Apps\CronManager\Php\Entities\Job;
use Apps\CronManager\Php\Entities\JobHistory;
use Apps\CronManager\Php\Entities\Settings;
use Apps\CronManager\Php\Interfaces\CronJobInterface;

class Runner extends AbstractService
{
    function __construct()
    {
        parent::__construct();

        /**
         * @api.name        Run all cron jobs
         * @api.description Runs all available cron jobs
         */
        $this->api('GET', 'run', function () {

            // Get all active cron jobs
            $jobs = Job::find(['enabled' => true]);

            /* @var Job $job */
            foreach ($jobs as $job) {
                if ($job->shouldJobRunNow()) {
                    $this->issueJob($job);
                }
            }
        })->setPublic();

        /**
         * @api.name        Run single cron job
         * @api.description Runs single cron job by given ID
         */
        $this->api('GET', 'run/{job}', function (Job $job) {
            return $this->runJob($job);
        });
    }

    private function issueJob(Job $job)
    {
        // Fork the cron request into separate process
        // We will also check if we have HTTP Authentication credentials saved in config - we gotta prepend those into the URL if that's the case
        $url = $this->wConfig()->get('Application.ApiPath') . '/services/cron-manager/runner/run/' . $job->id;

        $httpAuthentication = '';
        $settings = Settings::load();
        if ($settings) {
            $username = $settings->keyNested('authentication.http.username');
            $password = $settings->keyNested('authentication.http.password');
            if ($username && $password) {
                $httpAuthentication = '-u ' . $username . ':' . $password;
            }
        }

        $token = '--header "X-Webiny-Authorization: ' . urlencode($this->wConfig()->get('Application.Acl.Token')) . '"';

        $cmd = 'curl ' . $httpAuthentication . ' ' . $token . ' --insecure -X GET ' . $url . ' > /dev/null 2>&1 &';
        exec($cmd);
    }

    /**
     * Runs single job - can work with classes and with any given URL
     *
     * @param Job $job
     */
    private function runJob(Job $job)
    {
        // update job status to running
        $job->status = Job::STATUS_RUNNING;
        $job->lastRunDate = $this->datetime()->getMongoDate();
        $job->save();

        if ($job->targetType === Job::TARGET_CLASS) {
            $jobHistory = new JobHistory();
            $jobHistory->job = $job;
            $jobHistory->runDate = $this->datetime()->getMongoDate();

            $startTime = time();

            /* @var CronJobInterface $class */
            $class = new $job->target; // Code is placed directly

            try {
                $class->run();
                $jobHistory->successful = true;
                $job->stats['successfulRuns'] += 1;
            } catch (\Exception $e) {
                $jobHistory->successful = false;
                $jobHistory->debugLog = [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'trace'   => $e->getTraceAsString()
                ];
            }

            $jobHistory->runTime = time() - $startTime;

            // Update job stats
            $job->stats['totalExecTime'] += $jobHistory->runTime;
            $job->stats['numberOfRuns'] += 1;

        } else {

            // create the job url
            $url = $this->str($job->target)
                        ->replace('{apiPath}', $this->wConfig()->get('Application.ApiPath'))
                        ->replace('{webPath}', $this->wConfig()->get('Application.WebPath'))
                        ->val();

            // issue request for the job
            $debugWrapper = fopen('php://temp', 'r+');
            $token = $this->wConfig()->get('Application.Acl.Token');
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_VERBOSE, true);
            curl_setopt($ch, CURLOPT_STDERR, $debugWrapper);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-Webiny-Authorization: ' . $token));
            curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $job->timeout);
            curl_setopt($ch, CURLOPT_TIMEOUT, $job->timeout);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $settings = Settings::load();
            if ($settings) {
                $username = $settings->keyNested('authentication.http.username');
                $password = $settings->keyNested('authentication.http.password');
                if ($username && $password) {
                    curl_setopt($ch, CURLOPT_USERPWD, $username . ':' . $password);
                }
            }

            $result = curl_exec($ch);
            $curlInfo = curl_getinfo($ch);

            // Get the debug log
            rewind($debugWrapper);
            $debugLog = fread($debugWrapper, 8192);
            fclose($debugWrapper);

            // Populate history data
            $jobHistory = new JobHistory();
            $jobHistory->job = $job;
            $jobHistory->debugLog = ['message' => $debugLog];
            $jobHistory->runDate = $this->datetime()->getMongoDate();
            $jobHistory->serverIp = $curlInfo['primary_ip'];
            $jobHistory->runTime = $curlInfo['total_time'];
            $jobHistory->responseCode = $curlInfo['http_code'];
            $jobHistory->result = $result;

            // Update job stats
            $job->stats['totalExecTime'] += $jobHistory->runTime;
            $job->stats['numberOfRuns'] += 1;

            // Validate the curl response
            if ($jobHistory->responseCode >= 200 && $jobHistory->responseCode <= 399) {
                $jobHistory->successful = true;
                $job->stats['successfulRuns'] += 1;
            } else {
                $jobHistory->successful = false;
            }
            curl_close($ch);
        }

        $jobHistory->save();

        // Set status to scheduled
        $job->status = Job::STATUS_SCHEDULED;

        // Set the date for the next run
        // Check if job is active before we schedule the next run
        if ($job->enabled) {
            $job->scheduleNextRunDate();
        }

        $job->cleanupRunHistory();
        $job->save();
    }
}