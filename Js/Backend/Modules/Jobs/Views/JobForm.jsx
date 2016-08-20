import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

import AddFrequencyModal from './AddFrequencyModal';

class JobForm extends Webiny.Ui.View {

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
            query: {_sort: 'name'},
            placeholder: 'Select frequency',
            allowClear: true,
            textAttr: 'name',
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
            api: '/entities/cron-manager/jobs/list-timezones',
            validate: 'required'
        };

        /*
        const notificationEmails = (
            <Ui.Dynamic.Fieldset name="notifyEmails">
                <Ui.Dynamic.Row>
                    {(record, index, actions) => (
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={9}>
                                <Ui.Input placeholder="Email address" name="email" validate="required, email"/>
                            </Ui.Grid.Col>
                            <Ui.Grid.Col all={3}>
                                <div className="btn-group">
                                    <Ui.Button type="primary" label="Add" onClick={actions.add(index)}/>
                                    <Ui.Button type="secondary" onClick={actions.remove(index)}>
                                        <Ui.Icon icon="icon-cancel"/>
                                    </Ui.Button>
                                </div>
                            </Ui.Grid.Col>
                        </Ui.Grid.Row>
                    )}
                </Ui.Dynamic.Row>
                <Ui.Dynamic.Empty>
                    {actions => (
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={12}>
                                <h5>You don't have any notification emails set.</h5>
                                <Ui.Button type="primary" label="Add email" onClick={actions.add(0)}/>
                            </Ui.Grid.Col>
                        </Ui.Grid.Row>
                    )}
                </Ui.Dynamic.Empty>
            </Ui.Dynamic.Fieldset>
        );
       */

        const urlDescription = 'You can user variables like {apiPath} and {webPath} in the URL which will be replaced with your config variables before the job is run.';

        return (
            <Ui.Form.Container ui="myForm" {...formProps}>
                {(data, container) => {
                    return (
                        <Ui.View.Form>
                            <Ui.View.Header title="Cron Job"/>
                            <Ui.View.Body>
                                <Ui.Grid.Row>
                                    <Ui.Form.Error container={container}/>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Form.Fieldset title="About"/>
                                        <Ui.Input label="Name" name="name" validate="required"/>
                                        <Ui.Input label="Url" name="url" validate="required" description={urlDescription}/>
                                        <Ui.Textarea label="Description" name="description"/>
                                        <Ui.Select
                                            label="Run History"
                                            placeholder="Run History"
                                            name="runHistory"
                                            description="How many records should the system keep in the run history for this job.">
                                            <option value="0">All</option>
                                            <option value="10">10</option>
                                            <option value="100">100</option>
                                            <option value="1000">1000</option>
                                        </Ui.Select>

                                        {/* <Ui.Form.Fieldset title="Notifications"/>
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.CheckboxGroup label="Notify on" name="notifyOn" grid={12}>
                                                    <option value="Error">Failed run</option>
                                                    <option value="Success">Successful run</option>
                                                </Ui.CheckboxGroup>
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row>

                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={12}>
                                                <label>Notification emails</label>
                                                {notificationEmails}
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row> */}

                                    </Ui.Grid.Col>

                                    <Ui.Grid.Col all={6}>
                                        <Ui.Form.Fieldset title="Run Settings">
                                            <Ui.Button size="small" label="Add new" onClick={this.ui('addFrequencyModal:show')}>Add
                                                New
                                                Frequency</Ui.Button>
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
                            <Ui.View.Footer align="right">
                                <Ui.Button type="default" onClick={container.cancel} label="Cancel"/>
                                <Ui.Button type="primary" onClick={container.submit} label="Submit"/>
                            </Ui.View.Footer>
                        </Ui.View.Form>
                    );
                }}
            </Ui.Form.Container>
        );
    }
};


export default JobForm;
