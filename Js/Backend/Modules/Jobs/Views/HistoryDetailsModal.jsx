import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class HistoryDetailsModal extends Webiny.Ui.ModalComponent  {

	constructor(props) {
		super(props);

        this.state = {
			data: props.data
		}
	}

	render() {
		return (
			<Ui.Modal.Dialog ref="dialog">
				<Ui.Modal.Header title="History Details"/>
				<Ui.Modal.Body>
					<Ui.Tabs.Tabs ui="tabs">
						<Ui.Tabs.Tab label="Details">
							<dl class="dl-horizontal">
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
							<Ui.Textarea readonly="readonly" valueLink={this.bindTo('data.result')}/>
						</Ui.Tabs.Tab>
						<Ui.Tabs.Tab label="Debug Log">
							<Ui.Textarea disabled="disabled" valueLink={this.bindTo('data.debugLog')}/>
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