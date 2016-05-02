import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Textarea = Ui.Textarea;


class HistoryDetailsModal extends Webiny.Ui.Component {

	constructor(props) {
		super(props);

		this.bindMethods('show,hide');
	}

	hide() {
		this.refs.historyDialog.hide();
	}

	show() {
		this.refs.historyDialog.show();
	}

	render() {
		return (
			<Ui.Modal.Dialog ref="historyDialog">
				<Ui.Modal.Header title="Add Frequency"/>
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
							<Textarea disabled="disabled" value="test">
								{this.props.data.result}
							</Textarea>
						</Ui.Tabs.Tab>
						<Ui.Tabs.Tab label="Debug Log">
							<pre>
							{this.props.data.debugLog}
							</pre>
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