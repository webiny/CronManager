import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class List extends Webiny.Ui.View {

}

List.defaultProps = {
	renderer() {
		const listProps = {
			api: '/entities/cron-manager/jobs',
			fields: 'name,url,frequency,enabled',
			connectToRouter: true,
			searchFields: 'name'
		};

		return (
			<Ui.Grid.Row>
				<Ui.Grid.Col all={12}>
					<h2>
						<Ui.Grid.Row>
							<Ui.Grid.Col all={10}>
								Cron Jobs
							</Ui.Grid.Col>
							<Ui.Grid.Col all={2}>
								<Ui.Link type="primary" align="right" route="CronManager.Job.Create">Create new CronJob</Ui.Link>
							</Ui.Grid.Col>
						</Ui.Grid.Row>
					</h2>
				</Ui.Grid.Col>

				<Ui.Grid.Col all={12}>
					<Ui.List.ApiContainer ui="myList" {...listProps}>
						<Table.Table>
							<Table.Row>
								<Table.Field name="name" align="left" label="Name" sort="Name" />
								<Table.ToggleField name="enabled" />
								<Table.CaseField name="enabled" align="left" label="Status" sort="enabled">
									<case value={true}>Enabled</case>
									<case value={false}>Disabled</case>
								</Table.CaseField>
								<Table.Field name="createdOn" align="left" label="Created On" sort="createdOn"/>
								<Table.Actions>
									<Table.EditAction route="CronManager.JobForm.Edit"/>
									<Table.DeleteAction/>
								</Table.Actions>
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

export default List;