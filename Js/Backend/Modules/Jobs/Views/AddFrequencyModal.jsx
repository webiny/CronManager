import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class AddFrequencyModal extends Webiny.Ui.ModalComponent {

    getDescription(cmp) {
        if (cmp.isValid()) {
            return cmp.state.validationResults.cronFrequency;
        }

        return '';
    }

    render() {
        const formProps = {
            ui: 'addFrequencyForm',
            api: '/entities/cron-manager/job-frequency',
            fields: 'id,name,mask',
            onSubmitSuccess: () => {
                this.ui('frequencySelect').prepareOptions();
                this.hide();
            }
        };

        const listProps = {
            api: '/entities/cron-manager/job-frequency',
            fields: '*'
        };

        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title="Add Frequency"/>
                <Ui.Modal.Body>
                    <Ui.Tabs.Tabs ui="myTabs" position="left">
                        <Ui.Tabs.Tab label="Create New">

                            <Ui.Form.Container {...formProps}>
                                {() => (
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Input label="Name" name="name" validate="required"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Input label="Mask" name="mask" validate="required,cronFrequency"
                                                      description={this.getDescription}/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                )}
                            </Ui.Form.Container>
                        </Ui.Tabs.Tab>
                        <Ui.Tabs.Tab label="Manage Existing">
                            <Ui.List.ApiContainer ui="maskList" {...listProps}>
                                <Table.Table>
                                    <Table.Row>
                                        <Table.Field name="name" align="left" label="Name" sort="name"/>
                                        <Table.Field name="mask" align="left" label="Mask" sort="mask"/>
                                        <Table.Actions>
                                            <Table.Action label="Delete" onClick={(data, $this) => {
                                                // 1. $this je instanca akcije (Table.Action)
                                                // 2. $this.props.actions - to su akcije koje mozes pozvati na listi, to se salje od liste kroz propse
                                                // pogledaj kroz React plugin da vidis sta sve imas unutra. Delete automatski i refresha tablicu.
                                                $this.props.actions.delete(data.id);
                                            }}/>
                                        </Table.Actions>
                                    </Table.Row>
                                    <Table.Empty/>
                                </Table.Table>
                                <Ui.List.Pagination/>
                            </Ui.List.ApiContainer>
                        </Ui.Tabs.Tab>

                    </Ui.Tabs.Tabs>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Cancel" onClick={this.ui('addFrequencyModal:hide')}/>
                    <Ui.Button type="primary" label="Add frequency" onClick={this.ui('addFrequencyForm:submit')}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default AddFrequencyModal;