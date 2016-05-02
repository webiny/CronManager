import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

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
            fields: 'id, name, mask',
            connectToRouter: true
        };

        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title="Add Frequency"/>
                <Ui.Modal.Body>
                    <Ui.Form.ApiContainer {...formProps}>
                        <Ui.Form.Form layout={false}>
                            <fields>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Name" name="name" validate="required"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Mask" name="mask" validate="required,cronFrequency" description={this.getDescription}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </fields>
                        </Ui.Form.Form>
                    </Ui.Form.ApiContainer>
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