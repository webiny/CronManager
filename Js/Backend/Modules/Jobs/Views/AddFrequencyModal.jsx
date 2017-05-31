import Webiny from 'Webiny';

class AddFrequencyModal extends Webiny.Ui.ModalComponent {

    getDescription(cmp) {
        if (cmp.isValid()) {
            return cmp.state.validationResults.cronFrequency;
        }

        return '';
    }

    renderDialog() {
        const formProps = {
            ui: 'addFrequencyForm',
            api: '/entities/cron-manager/job-frequency',
            fields: 'id,name,mask',
            onSubmitSuccess: () => {
                this.ui('frequencySelect').loadOptions();
                this.hide();
            }
        };

        const listProps = {
            api: '/entities/cron-manager/job-frequency',
            fields: '*',
            perPage: 1000
        };

        const {Modal, Tabs, Form, Grid, Input, List, Button} = this.props;
        const Table = List.Table;

        return (
            <Modal.Dialog>
                <Modal.Header title="Add Frequency"/>
                <Modal.Body noPadding>
                    <Tabs ui="myTabs" position="left">
                        <Tabs.Tab label="Create New">
                            <Form {...formProps}>
                                {() => (
                                    <Grid.Row>
                                        <Grid.Col all={12}>
                                            <Input label="Name" name="name" validate="required"/>
                                        </Grid.Col>
                                        <Grid.Col all={12}>
                                            <Input
                                                label="Mask"
                                                name="mask"
                                                validate="required,cronFrequency"
                                                description={this.getDescription}/>
                                        </Grid.Col>
                                    </Grid.Row>
                                )}
                            </Form>
                        </Tabs.Tab>
                        <Tabs.Tab label="Manage Existing">
                            <List ui="maskList" {...listProps}>
                                <Table>
                                    <Table.Row>
                                        <Table.Field name="name" align="left" label="Name" sort="name"/>
                                        <Table.Field name="mask" align="left" label="Mask" sort="mask"/>
                                        <Table.Actions>
                                            <Table.Action label="Delete" onClick={(data, actions) => {
                                                actions.delete(data.id);
                                            }}/>
                                        </Table.Actions>
                                    </Table.Row>
                                </Table>
                            </List>
                        </Tabs.Tab>

                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button label="Cancel" onClick={this.ui('addFrequencyModal:hide')}/>
                    <Button type="primary" label="Add frequency" onClick={this.ui('addFrequencyForm:submit')}/>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(AddFrequencyModal, {modules: ['Modal', 'Tabs', 'Form', 'Grid', 'Input', 'List', 'Button']});