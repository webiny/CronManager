import Webiny from 'Webiny';
import Views from './Views/Views';

class Module extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;
        const role = 'cron-manager';

        this.registerMenus(
            new Menu('System', [
                new Menu('Cron Manager', 'CronManager.Jobs').setRole(role)
            ], 'icon-tools')
        );

        this.registerRoutes(
            new Webiny.Route('CronManager.Jobs', '/cron-manager', Views.JobList, 'Cron Manager - Jobs').setRole(role),
            new Webiny.Route('CronManager.Job.Create', '/cron-manager/job', Views.JobForm, 'Cron Manager - New Job').setRole(role),
            new Webiny.Route('CronManager.Job.Edit', '/cron-manager/job/:id', Views.JobForm, 'Cron Manager - Edit Job').setRole(role),
            new Webiny.Route('CronManager.Job.History', '/cron-manager/job/history/:id', Views.JobHistoryList, 'Cron Manager - Job History').setRole(role)
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
    }
}

export default Module;