import Webiny from 'Webiny';
import Views from './Views/Views';

class Jobs extends Webiny.App.Module {

    init() {
        this.name = 'Jobs';
        const Menu = Webiny.Ui.Menu;
        const role = 'cron-manager';

        this.registerMenus(
            new Menu('System', [
                new Menu('Cron Manager', 'CronManager.Jobs').setRole(role)
            ], 'icon-tools')
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

        /*Webiny.registerModule(
            new Webiny.Module('CronJobInstaller', () => import('./Components/CronJobInstaller')).setContext('cron-job')
        );*/
    }
}

export default Jobs;