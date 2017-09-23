import React from 'react';
import Webiny from 'webiny';

class CronJobModal extends Webiny.Ui.ModalComponent {

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
            onSuccessMessage(record) {
                return <span>Cron job <strong>{record.name}</strong> saved!</span>;
            }
        };

        const frequencySelect = {
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
            label: 'Timezone',
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
                                <Modal.Header title="Cron Job" onClose={dialog.hide}/>
                                <Modal.Body>
                                    <Grid.Row>
                                        <Form.Error/>
                                        <Grid.Col all={12}>
                                            <Input label="Name" name="name" validate="required"/>
                                            <RadioGroup label="Target Type" name="targetType">
                                                <option value="url">URL</option>
                                                <option value="class">Class</option>
                                            </RadioGroup>
                                            {this.renderTargetInput(model)}
                                            <Section title="Run Settings"/>
                                            <Select {...frequencySelect}/>
                                            <Select {...tzSelect}/>
                                            <Input
                                                label="Timeout"
                                                name="timeout"
                                                validate="required,number"
                                                description="Timeout in seconds"/>
                                            <Switch label="Enabled" name="enabled"/>
                                        </Grid.Col>
                                    </Grid.Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button label="Cancel" onClick={this.hide}/>
                                    <Button type="primary" label="Create Job" onClick={form.submit}/>
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