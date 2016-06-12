import Webiny from 'Webiny';
import Views from './Views/Views';

class Module extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('DevTools', [
                new Menu('Cron Manager', 'CronManager.Jobs')
            ], 'icon-calendar-o')
        );

        this.registerRoutes(
            new Webiny.Route('CronManager.Jobs', '/cron-manager', Views.JobList, 'Cron Manager - Jobs'),
            new Webiny.Route('CronManager.Job.Create', '/cron-manager/job', Views.JobForm, 'Cron Manager - New Job'),
            new Webiny.Route('CronManager.Job.Edit', '/cron-manager/job/:id', Views.JobForm, 'Cron Manager - Edit Job'),
            new Webiny.Route('CronManager.Job.History', '/cron-manager/job/history/:id', Views.JobHistoryList, 'Cron Manager - Job History')
        );

        // register the cronFrequency validator
        Webiny.Tools.Validator.addValidator('cronFrequency', (val) => {
            const api = new Webiny.Api.Endpoint('/entities/cron-manager/job-frequency');
            return api.post('validate', {mask: val}).then(ar => {
                if (!ar.getData().status) {
                    throw new Error('Invalid cron job pattern.');
                }
                return ar.getData().frequency;
            });
        });
    }
}

export default Module;