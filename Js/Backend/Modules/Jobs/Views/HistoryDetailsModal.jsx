import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class HistoryDetailsModal extends Webiny.Ui.ModalComponent {

    renderDialog() {
        return (
            <Ui.Modal.Dialog>
                <Ui.Modal.Header title="History Details"/>
                <Ui.Modal.Body>
                    <Ui.Tabs.Tabs ui="tabs">
                        <Ui.Tabs.Tab label="Details">
                            <dl className="dl-horizontal">
                                <dt>Job Name</dt>
                                <dd>{this.props.data.job.name}</dd>

                                <dt>Job Url</dt>
                                <dd>{this.props.data.job.url}</dd>

                                <dt>Server IP</dt>
                                <dd>{this.props.data.serverIp}</dd>

                                <dt>Last Run Date</dt>
                                <dd>{this.props.data.runDate}</dd>

                                <dt>Run Time</dt>
                                <dd>{this.props.data.runTime} sec</dd>

                                <dt>Response Code</dt>
                                <dd>{this.props.data.responseCode}</dd>
                            </dl>
                        </Ui.Tabs.Tab>

                        <Ui.Tabs.Tab label="Response">
                            <Ui.Textarea readOnly={true} value={this.props.data.result}/>
                        </Ui.Tabs.Tab>
                        <Ui.Tabs.Tab label="Debug Log">
                            <Ui.Textarea readOnly={true} value={this.props.data.debugLog}/>
                        </Ui.Tabs.Tab>

                    </Ui.Tabs.Tabs>

                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Close" onClick={this.hide}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default HistoryDetailsModal;