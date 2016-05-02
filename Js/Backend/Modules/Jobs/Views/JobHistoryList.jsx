import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
import HistoryDetailsModal from './HistoryDetailsModal';

class JobHistoryList extends Webiny.Ui.View {

}

JobHistoryList.defaultProps = {

	renderer() {
		const listProps = {
			api: '/entities/cron-manager/job-history',
			defaultQuery: {job: Webiny.Router.getParams('id'), '_sort': '-runDate'},
			fields: 'job,runDate,runTime,responseCode,successful,serverIp,debugLog,result',
			connectToRouter: true
		};

		return (
			<Ui.Grid.Row>
				<Ui.Grid.Col all={12}>
					<h2>
						Job History: $jobName
					</h2>
				</Ui.Grid.Col>
				<Ui.Grid.Col all={12}>
					<Ui.List.ApiContainer ui="historyList" {...listProps}>

						<Table.Table>
							<Table.Row>
								<Table.TimeAgoField name="runDate" align="left" label="Run Date" sort="runDate"/>
								<Table.Field name="runTime" align="left" label="Run Time" sort="runTime"/>
								<Table.Field name="responseCode" align="left" label="Response Code" sort="responseCode"/>
								<Table.Field align="right">
									<Table.FieldRenderer>
									{function (data) {
										return (
										<td className={this.getTdClasses()}>
											<Ui.Button type="default" label="Show Details" onClick={this.ui('historyDetailsModal:show')}/>
											<HistoryDetailsModal ui="historyDetailsModal" data={data}/>
										</td>
										);
									}}
									</Table.FieldRenderer>

								</Table.Field>
							</Table.Row>

							<Table.Empty/>
						</Table.Table>

						<Ui.List.Pagination/>
					</Ui.List.ApiContainer>
				</Ui.Grid.Col>
			</Ui.Grid.Row>
		);
	}
};

export default JobHistoryList;