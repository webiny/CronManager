import Webiny from 'Webiny';
import Views from './Views/Views';

class Module extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('CronManager', 'CronManager.Jobs', 'icon-website')
        );

        this.registerRoutes(
            new Webiny.Route('CronManager.Jobs', '/cron-manager', {
                MasterContent: Views.List
            }),
            new Webiny.Route('CronManager.Job.Create', '/cron-manager/job', {
                MasterContent: Views.Form
            }),
            new Webiny.Route('CronManager.Job.Edit', '/cron-manager/job/:id', {
                MasterContent: Views.Form
            })
        );

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