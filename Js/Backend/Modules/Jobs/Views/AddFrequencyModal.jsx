import React from 'react';
import _ from 'lodash';
import Webiny from 'Webiny';

class AddFrequencyModal extends Webiny.Ui.ModalComponent {

    getDescription(cmp) {
        if (cmp.isValid()) {
            return cmp.state.validationResults.cronFrequency;
        }

        return '';
    }
}

AddFrequencyModal.defaultProps = _.merge({}, Webiny.Ui.ModalComponent.defaultProps, {
    renderDialog() {
        const formProps = {
            api: '/entities/cron-manager/job-frequency',
            fields: 'id,name,mask',
            onSubmitSuccess: () => {
                this.props.loadFrequencies();
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
                {dialog => (
                    <Form {...formProps}>
                        {(model, form) => (
                            <Modal.Content>
                                <Modal.Header title="Add Frequency"/>
                                <Modal.Body noPadding>
                                    <Tabs position="left">
                                        <Tabs.Tab label="Create New">

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

                                        </Tabs.Tab>
                                        <Tabs.Tab label="Manage Existing">
                                            <List {...listProps}>
                                                <Table>
                                                    <Table.Row>
                                                        <Table.Field name="name" align="left" label="Name" sort="name"/>
                                                        <Table.Field name="mask" align="left" label="Mask" sort="mask"/>
                                                        <Table.Actions>
                                                            <Table.Action label="Delete" onClick={(data, actions) => {
                                                                actions.delete(data.id).then(() => this.props.loadFrequencies());
                                                            }}/>
                                                        </Table.Actions>
                                                    </Table.Row>
                                                </Table>
                                            </List>
                                        </Tabs.Tab>

                                    </Tabs>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button label="Cancel" onClick={dialog.hide}/>
                                    <Button type="primary" label="Add frequency" onClick={form.submit}/>
                                </Modal.Footer>
                            </Modal.Content>
                        )}
                    </Form>
                )}
            </Modal.Dialog>
        );
    }
});

export default Webiny.createComponent(AddFrequencyModal, {modules: ['Modal', 'Tabs', 'Form', 'Grid', 'Input', 'List', 'Button']});