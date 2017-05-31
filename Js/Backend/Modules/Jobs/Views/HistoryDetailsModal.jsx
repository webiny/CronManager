import Webiny from 'Webiny';

class HistoryDetailsModal extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const {Modal, Tabs, Textarea, Button} = this.props;
        return (
            <Modal.Dialog>
                <Modal.Header title="History Details"/>
                <Modal.Body>
                    <Tabs ui="tabs">
                        <Tabs.Tab label="Details">
                            <dl className="dl-horizontal">
                                <dt>Job Name</dt>
                                <dd>{this.props.data.job.name}</dd>

                                <dt>Job Target</dt>
                                <dd>{this.props.data.job.target}</dd>

                                <dt>Server IP</dt>
                                <dd>{this.props.data.serverIp}</dd>

                                <dt>Last Run Date</dt>
                                <dd>{this.props.data.runDate}</dd>

                                <dt>Run Time</dt>
                                <dd>{this.props.data.runTime} sec</dd>

                                <dt>Response Code</dt>
                                <dd>{this.props.data.responseCode}</dd>
                            </dl>
                        </Tabs.Tab>

                        <Tabs.Tab label="Response">
                            <Textarea readOnly={true} value={this.props.data.result}/>
                        </Tabs.Tab>
                        <Tabs.Tab label="Debug Log">
                            <Textarea readOnly={true} value={this.props.data.debugLog.message}/>
                        </Tabs.Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button label="Close" onClick={this.hide}/>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(HistoryDetailsModal, {modules: ['Modal', 'Tabs', 'Textarea', 'Button']});