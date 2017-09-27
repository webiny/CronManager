import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

/**
 * @i18n.namespace CronManager.Backend.Jobs.AddFrequencyModal
 */
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
                {({dialog}) => (
                    <Form {...formProps}>
                        {({form}) => (
                            <Modal.Content>
                                <Form.Loader/>
                                <Form.Error/>
                                <Modal.Header title={this.i18n('Add Frequency')}/>
                                <Modal.Body noPadding>
                                    <Tabs position="left">
                                        <Tabs.Tab label={this.i18n('Create New')}>
                                            <Grid.Row>
                                                <Grid.Col all={12}>
                                                    <Input label={this.i18n('Name')} name="name" validate="required"/>
                                                </Grid.Col>
                                                <Grid.Col all={12}>
                                                    <Input
                                                        label={this.i18n('Mask')}
                                                        name="mask"
                                                        validate="required,cronFrequency"
                                                        description={this.getDescription}/>
                                                </Grid.Col>
                                            </Grid.Row>

                                        </Tabs.Tab>
                                        <Tabs.Tab label={this.i18n('Manage Existing')}>
                                            <List {...listProps}>
                                                <Table>
                                                    <Table.Row>
                                                        <Table.Field name="name" align="left" label={this.i18n('Name')} sort="name"/>
                                                        <Table.Field name="mask" align="left" label={this.i18n('Mask')} sort="mask"/>
                                                        <Table.Actions>
                                                            <Table.Action icon="icon-cancel" label={this.i18n('Delete')} onClick={({data, actions}) => {
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
                                    <Button label={this.i18n('Cancel')} onClick={dialog.hide}/>
                                    <Button type="primary" label={this.i18n('Add frequency')} onClick={form.submit}/>
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