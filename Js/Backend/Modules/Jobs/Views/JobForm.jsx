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
            placeholder: 'Select frequency',
            allowClear: true,
            textAttr: 'name',
            optionRenderer: option => {
                return (
                    <div>
                        <strong>{option.name}</strong><br/>
                        <span>Cron: {option.mask}</span>
                    </div>
                );
            },
            selectedRenderer: option => {
                return option.name;
            }
        };

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

        const urlDescription = 'If your url doesn\'t start with http, the current domain name will automatically be prepended';

        return (
            <Ui.Form.Container ui="myForm" {...formProps}>
                {(data, container) => {
                    return (
                        <Ui.Panel.Panel>
                            <Ui.Panel.Header title="Cron Job"/>
                            <Ui.Panel.Body>
                                <Ui.Grid.Row>
                                    <Ui.Form.Error container={container}/>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Form.Fieldset title="About"/>
                                        <Ui.Input label="Name" name="name" validate="required"/>
                                        <Ui.Input label="Url" name="url" validate="required" description={urlDescription}/>
                                        <Ui.Textarea label="Description" name="description"/>
                                        <Ui.Form.Fieldset title="Notifications"/>
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.CheckboxGroup label="Notify on" name="notifyOn" grid={12} validate="required">
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
                                        </Ui.Grid.Row>

                                    </Ui.Grid.Col>

                                    <Ui.Grid.Col all={6}>
                                        <Ui.Form.Fieldset title="Run Settings">
                                            <Ui.Button size="small" label="Add new" onClick={this.ui('addFrequencyModal:show')}>Add New
                                                Frequency</Ui.Button>
                                        </Ui.Form.Fieldset>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Select {...frequencySelect}/>
                                        </Ui.Grid.Col>
                                        <AddFrequencyModal ui="addFrequencyModal"/>

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
                            </Ui.Panel.Body>
                            <Ui.Panel.Footer className="text-right">
                                <Ui.Button type="default" onClick={container.cancel} label="Cancel"/>
                                <Ui.Button type="secondary" onClick={container.reset} label="Reset"/>
                                <Ui.Button type="primary" onClick={container.submit} label="Submit"/>
                            </Ui.Panel.Footer>
                        </Ui.Panel.Panel>
                    );
                }}
            </Ui.Form.Container>
        );
    }
};


export default JobForm;
