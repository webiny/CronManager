import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

import AddFrequencyModal from './AddFrequencyModal';

class JobForm extends Webiny.Ui.View {

    renderTargetInput(model) {
        const urlDescription = 'You can use variables like {apiPath} and {webPath} in the URL which will be replaced with your config variables before the job runs.';
        const classDescription = 'Provide a class name with full namespace, and Cron Manager can use it directly.';

        let targetProps = {
            label: 'Url',
            name: 'target',
            validate: 'required',
            description: urlDescription
        };

        if (model.targetType === 'class') {
            targetProps = {
                label: 'Class',
                name: 'target',
                placeholder: 'eg. Apps\\TestApp\\Php\\Services\\Crons\\DailyEmails',
                validate: 'required,className',
                description: classDescription
            };
        }
        return (<Ui.Input {...targetProps}/>);
    }
}

JobForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/cron-manager/jobs',
            fields: '*,frequency',
            connectToRouter: true,
            onSubmitSuccess: 'CronManager.Jobs',
            onCancel: 'CronManager.Jobs',
            onSuccessMessage(record) {
                return <span>Cron job <strong>{record.name}</strong> saved!</span>;
            }
        };

        const frequencySelect = {
            ui: 'frequencySelect',
            api: '/entities/cron-manager/job-frequency',
            fields: '*',
            label: 'Frequency',
            name: 'frequency',
            sort: 'name',
            placeholder: 'Select frequency',
            validate: 'required',
            optionRenderer: option => {
                return (
                    <div>
                        <strong>{option.data.name}</strong><br/>
                        <span>Cron: {option.data.mask}</span>
                    </div>
                );
            },
            selectedRenderer: option => {
                return option.data.name;
            }
        };

        const tzSelect = {
            ui: 'tzSelect',
            label: 'Timezone',
            name: 'timezone',
            placeholder: 'Select a timezone',
            allowClear: true,
            api: '/entities/cron-manager/jobs/timezones',
            validate: 'required'
        };

        return (
            <Ui.Form ui="myForm" {...formProps}>
                {(model, form) => {
                    return (
                        <Ui.View.Form>
                            <Ui.View.Header title="Cron Job"/>
                            <Ui.View.Body>
                                <Ui.Grid.Row>
                                    <Ui.Form.Error form={form}/>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Form.Fieldset title="About"/>
                                        <Ui.Input label="Name" name="name" validate="required"/>
                                        <Ui.RadioGroup label={this.i18n('Target Type')} name="targetType">
                                            <option value="url">{this.i18n('URL')}</option>
                                            <option value="class">{this.i18n('Class')}</option>
                                        </Ui.RadioGroup>
                                        {this.renderTargetInput(model)}
                                        <Ui.Textarea label="Description" name="description"/>
                                        <Ui.Select
                                            label="Run History"
                                            placeholder="Run History"
                                            name="runHistory"
                                            description="How many records should the system keep in log history for this job.">
                                            <option value="0">All</option>
                                            <option value="10">10</option>
                                            <option value="100">100</option>
                                            <option value="1000">1000</option>
                                        </Ui.Select>
                                    </Ui.Grid.Col>

                                    <Ui.Grid.Col all={6}>
                                        <Ui.Form.Fieldset title="Run Settings">
                                            <Ui.Button
                                                size="small"
                                                label="Add new"
                                                onClick={this.ui('addFrequencyModal:show')}
                                                label="Add New Frequency"/>
                                        </Ui.Form.Fieldset>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Select {...frequencySelect}/>
                                        </Ui.Grid.Col>
                                        <AddFrequencyModal ui="addFrequencyModal"/>

                                        <Ui.Grid.Col all={12}>
                                            <Ui.Select {...tzSelect}/>
                                        </Ui.Grid.Col>

                                        <Ui.Grid.Col all={12}>
                                            <Ui.Input
                                                label="Timeout"
                                                name="timeout"
                                                validate="required,number"
                                                description="Timeout in seconds"/>
                                        </Ui.Grid.Col>

                                        <Ui.Grid.Col all={12}>
                                            <Ui.Switch label="Enabled" name="enabled"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.View.Body>
                            <Ui.View.Footer>
                                <Ui.Button align="left" type="default" onClick={form.cancel} label="Cancel"/>
                                <Ui.Button align="right" type="primary" onClick={form.submit} label="Submit"/>
                            </Ui.View.Footer>
                        </Ui.View.Form>
                    );
                }}
            </Ui.Form>
        );
    }
};


export default JobForm;
