import React from 'react';
import Webiny from 'webiny';
import AddFrequencyModal from './AddFrequencyModal';

/**
 * @i18n.namespace CronManager.Backend.Jobs.JobForm
 */
class JobForm extends Webiny.Ui.View {

    renderTargetInput(model) {
        const urlDescription = this.i18n('You can use variables like {apiPath} and {webPath} in the URL which will be replaced with your config variables before the job runs.');
        const classDescription = this.i18n('Provide a class name with full namespace, and Cron Manager can use it directly.');

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
}

JobForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/cron-manager/jobs',
            fields: '*,frequency',
            connectToRouter: true,
            onSubmitSuccess: 'CronManager.Jobs',
            onCancel: 'CronManager.Jobs',
            onSuccessMessage({model}) {
                return <span>{this.i18n('Cron job {name} saved!', {name: model.name})}</span>;
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

        const {View, Form, Grid, Input, RadioGroup, Section, Select, Textarea, Button, Switch} = this.props;

        return (
            <Form {...formProps}>
                {({model, form}) => {
                    return (
                        <View.Form>
                            <View.Header title={this.i18n('Cron Job')}/>
                            <View.Body>
                                <Grid.Row>
                                    <Form.Error/>
                                    <Grid.Col all={6}>
                                        <Section title={this.i18n('About')}/>
                                        <Input label={this.i18n('Name')} name="name" validate="required"/>
                                        <RadioGroup label={this.i18n('Target Type')} name="targetType">
                                            <option value="url">{this.i18n('URL')}</option>
                                            <option value="class">{this.i18n('Class')}</option>
                                        </RadioGroup>
                                        {this.renderTargetInput(model)}
                                        <Textarea label={this.i18n('Description')} name="description"/>
                                    </Grid.Col>
                                    <Grid.Col all={6}>
                                        <Section title={this.i18n('Run Settings')}>
                                            <Button
                                                size="small"
                                                onClick={() => this.addFrequencyModal.show()}
                                                label={this.i18n('Add New Frequency')}/>
                                        </Section>
                                        <Grid.Col all={12}>
                                            <Select {...frequencySelect} ref={ref => this.frequencySelect = ref}/>
                                        </Grid.Col>
                                        <AddFrequencyModal
                                            ref={ref => this.addFrequencyModal = ref}
                                            loadFrequencies={() => this.frequencySelect.loadOptions()}/>
                                        <Grid.Col all={12}>
                                            <Select {...tzSelect}/>
                                        </Grid.Col>
                                        <Grid.Col all={12}>
                                            <Input
                                                label={this.i18n('Timeout')}
                                                name="timeout"
                                                validate="required,number"
                                                description={this.i18n('Timeout in seconds')}/>
                                        </Grid.Col>
                                        <Grid.Col all={12}>
                                            <Switch label={this.i18n('Enabled')} name="enabled"/>
                                        </Grid.Col>
                                    </Grid.Col>
                                </Grid.Row>
                            </View.Body>
                            <View.Footer>
                                <Button align="left" type="default" onClick={form.cancel} label={this.i18n('Cancel')}/>
                                <Button align="right" type="primary" onClick={form.submit} label={this.i18n('Submit')}/>
                            </View.Footer>
                        </View.Form>
                    );
                }}
            </Form>
        );
    }
};


export default Webiny.createComponent(JobForm, {
    modules: ['View', 'Form', 'Grid', 'Input', 'RadioGroup', 'Section', 'Select', 'Textarea', 'Button', 'Switch']
});
