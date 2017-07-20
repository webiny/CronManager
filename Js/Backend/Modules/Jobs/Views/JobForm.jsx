import React from 'react';
import Webiny from 'Webiny';
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

        const {ViewSwitcher, View, Form, Grid, Input, RadioGroup, Section, Select, Textarea, Button, Switch} = this.props;

        return (
            <ViewSwitcher>
                <ViewSwitcher.View view="jobListView" defaultView>
                    {showView => (
                        <Form {...formProps}>
                            {(model, form) => {
                                return (
                                    <View.Form>
                                        <View.Header title="Cron Job"/>
                                        <View.Body>
                                            <Grid.Row>
                                                <Form.Error/>
                                                <Grid.Col all={6}>
                                                    <Section title="About"/>
                                                    <Input label="Name" name="name" validate="required"/>
                                                    <RadioGroup label={this.i18n('Target Type')} name="targetType">
                                                        <option value="url">{this.i18n('URL')}</option>
                                                        <option value="class">{this.i18n('Class')}</option>
                                                    </RadioGroup>
                                                    {this.renderTargetInput(model)}
                                                    <Textarea label="Description" name="description"/>
                                                    <Select
                                                        label="Run History"
                                                        placeholder="Run History"
                                                        name="runHistory"
                                                        description="How many records should the system keep in log history for this job.">
                                                        <option value="0">All</option>
                                                        <option value="10">10</option>
                                                        <option value="100">100</option>
                                                        <option value="1000">1000</option>
                                                    </Select>
                                                </Grid.Col>

                                                <Grid.Col all={6}>
                                                    <Section title="Run Settings">
                                                        <Button
                                                            size="small"
                                                            onClick={() => this.addFrequencyModal.show()}
                                                            label="Add New Frequency"/>
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
                                                            label="Timeout"
                                                            name="timeout"
                                                            validate="required,number"
                                                            description="Timeout in seconds"/>
                                                    </Grid.Col>

                                                    <Grid.Col all={12}>
                                                        <Switch label="Enabled" name="enabled"/>
                                                    </Grid.Col>
                                                </Grid.Col>
                                            </Grid.Row>
                                        </View.Body>
                                        <View.Footer>
                                            <Button align="left" type="default" onClick={form.cancel} label="Cancel"/>
                                            <Button align="right" type="primary" onClick={form.submit} label="Submit"/>
                                        </View.Footer>
                                    </View.Form>
                                );
                            }}
                        </Form>
                    )}
                </ViewSwitcher.View>
            </ViewSwitcher>
        );
    }
};


export default Webiny.createComponent(JobForm, {
    modules: ['ViewSwitcher', 'View', 'Form', 'Grid', 'Input', 'RadioGroup', 'Section', 'Select', 'Textarea', 'Button', 'Switch']
});
