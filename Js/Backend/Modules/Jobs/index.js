import React from 'react';
import Webiny from 'webiny';
import Views from './Views/Views';

class Jobs extends Webiny.App.Module {

    init() {
        this.name = 'Jobs';
        const role = 'cron-manager';

        this.registerMenus(
            <Webiny.Ui.Menu label="System" icon="icon-tools">
                <Webiny.Ui.Menu label="Cron Manager" route="CronManager.Jobs" role={role}/>
            </Webiny.Ui.Menu>
        );

        this.registerRoutes(
            new Webiny.Route('CronManager.Job.History', '/cron-manager/jobs/:id/history', Views.JobHistoryList, 'Cron Manager - Job History').setRole(role),
            new Webiny.Route('CronManager.Job.Create', '/cron-manager/jobs/create', Views.JobForm, 'Cron Manager - New Job').setRole(role),
            new Webiny.Route('CronManager.Job.Edit', '/cron-manager/jobs/:id', Views.JobForm, 'Cron Manager - Edit Job').setRole(role),
            new Webiny.Route('CronManager.Jobs', '/cron-manager/jobs', Views.JobList, 'Cron Manager - Jobs').setRole(role)
        );

        // register the cronFrequency validator
        Webiny.Validator.addValidator('cronFrequency', (val) => {
            const api = new Webiny.Api.Endpoint('/entities/cron-manager/job-frequency');
            return api.post('validate', {mask: val}).then(ar => {
                const data = ar.getData();
                if (!data.status) {
                    throw new Error(data.frequency || 'Invalid cron job pattern!');
                }

                return data.frequency;
            });
        });

        Webiny.Validator.addValidator('className', value => {
            const api = new Webiny.Api.Endpoint('/entities/cron-manager/jobs/validators/targets');
            return api.post('/class-names', {className: value}).then(response => {
                if (response.isError()) {
                    throw new Error(response.getMessage());
                }
            });
        });

        Webiny.registerModule(
            new Webiny.Module('CronJobSuccessNotification', () => import('./Components/CronJobNotification')).setTags('cron-job-success')
        );

        /*Webiny.registerModule(
         new Webiny.Module('CronJobInstaller', () => import('./Components/CronJobInstaller')).setContext('cron-job')
         );*/
    }
}

export default Jobs;