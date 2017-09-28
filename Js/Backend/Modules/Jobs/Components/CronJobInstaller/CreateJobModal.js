import React from 'react';
import Webiny from 'webiny';

class CronJobModal extends Webiny.Ui.ModalComponent {

    renderTargetInput(model) {
        const urlDescription = this.i18n(`You can use variables like {apiPath} and {webPath} in the URL which will be replaced 
                                            with your config variables before the job runs.`);
        const classDescription = this.i18n(`Provide a class name with full namespace, and Cron Manager can use it directly.`);

        let targetProps = {
            label: this.i18n('Url'),
            name: 'target',
            validate: 'required',
            description: urlDescription
        };

        if (model.targetType === 'class') {
            targetProps = {
                label: this.i18n('Class'),
                name: 'target',
                placeholder: 'eg. Apps\\TestApp\\Php\\Services\\Crons\\DailyEmails',
                validate: 'required,className',
                description: classDescription
            };
        }
        const {Input} = this.props;
        return <Input {...targetProps}/>;
    }

    renderDialog() {
        const formProps = {
            model: {
                target: this.props.url,
                targetType: 'url'
            },
            api: '/entities/cron-manager/jobs',
            fields: '*,frequency',
            connectToRouter: true,
            onSubmitSuccess: 'CronManager.Jobs',
            onCancel: 'CronManager.Jobs',
            onSuccessMessage({model}) {
                return this.i18n('Cron job {name} saved!', {name: <strong>{model.name}</strong>})
            }
        };

        const frequencySelect = {
            api: '/entities/cron-manager/job-frequency',
            fields: '*',
            label: this.i18n('Frequency'),
            name: 'frequency',
            sort: 'name',
            placeholder: 'Select frequency',
            validate: 'required',
            optionRenderer: ({option}) => {
                return (
                    <div>
                        <strong>{option.data.name}</strong><br/>
                        <span>Cron: {option.data.mask}</span>
                    </div>
                );
            },
            selectedRenderer: ({option}) => {
                return option.data.name;
            }
        };

        const tzSelect = {
            label: this.i18n('Timezone'),
            name: 'timezone',
            placeholder: 'Select a timezone',
            allowClear: true,
            api: '/entities/cron-manager/jobs/timezones',
            validate: 'required'
        };

        const {Modal, Form, Grid, Input, RadioGroup, Select, Section, Switch, Button} = this.props;

        return (
            <Modal.Dialog>
                {({dialog}) => (
                    <Form {...formProps}>
                        {({model, form}) => (
                            <Modal.Content>
                                <Form.Loader/>
                                <Modal.Header title={this.i18n('Cron Job')} onClose={dialog.hide}/>
                                <Modal.Body>
                                    <Grid.Row>
                                        <Form.Error/>
                                        <Grid.Col all={12}>
                                            <Input label={this.i18n('Name')} name="name" validate="required"/>
                                            <RadioGroup label={this.i18n('Target Type')} name="targetType">
                                                <option value="url">{this.i18n('URL')}</option>
                                                <option value="class">{this.i18n('Class')}</option>
                                            </RadioGroup>
                                            {this.renderTargetInput(model)}
                                            <Section title={this.i18n('Run Settings')}/>
                                            <Select {...frequencySelect}/>
                                            <Select {...tzSelect}/>
                                            <Input
                                                label={this.i18n('Timeout')}
                                                name="timeout"
                                                validate="required,number"
                                                description={this.i18n('Timeout in seconds')}/>
                                            <Switch label={this.i18n('Enabled')} name="enabled"/>
                                        </Grid.Col>
                                    </Grid.Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button label={this.i18n('Cancel')} onClick={this.hide}/>
                                    <Button type="primary" label={this.i18n('Create Job')} onClick={form.submit}/>
                                </Modal.Footer>
                            </Modal.Content>
                        )}
                    </Form>
                )}
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(CronJobModal, {
    modules: ['Modal', 'Form', 'Grid', 'Input', 'RadioGroup', 'Select', 'Section', 'Switch', 'Button']
});