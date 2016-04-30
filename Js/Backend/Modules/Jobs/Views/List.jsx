import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class List extends Webiny.Ui.View {

}

List.defaultProps = {
	renderer() {
		const listProps = {
			api: '/entities/cron-manager/jobs',
			fields: 'name,url,frequency,enabled,createdOn',
			connectToRouter: true,
			searchFields: 'name'
			//autoRefresh: 2
		};

		const statusProps = {
			ui: 'statusFilter',
			placeholder: Webiny.i18n('webiny.core.statusFilter.placeholder', 'Status'),
			allowClear: true,
			name: 'enabled'
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

						<Ui.List.FormFilters>
                        {(applyFilters, resetFilters) => {
							return (
								<Ui.Grid.Row>
									<Ui.Grid.Col all={4}>
										<Ui.Input name="name" placeholder="Name" />
									</Ui.Grid.Col>
									<Ui.Grid.Col all={4}>
										<Ui.Select {...statusProps}>
											<option value="true">Enabled</option>
											<option value="false">Disabled</option>
										</Ui.Select>
									</Ui.Grid.Col>
									<Ui.Grid.Col all={4}>
										<Ui.Button type="primary" label="Filter" onClick={applyFilters()}/>
										<Ui.Button type="secondary" label="Reset" onClick={resetFilters()}/>
									</Ui.Grid.Col>
								</Ui.Grid.Row>
							);
						}}
						</Ui.List.FormFilters>

						<Table.Table>
							<Table.Row>
								<Table.Field name="name" align="left" label="Name" sort="name" />
								<Table.Field name="url" align="left" label="Url" sort="url" />
								<Table.Field name="frequency.name" align="left" label="Frequency" sort="frequency" />
								<Table.TimeAgoField name="createdOn" align="left" label="Created On" sort="createdOn"/>

								<Table.ToggleField name="enabled" label="Enabled" align="center"/>

								<Table.Actions>
									<Table.EditAction route="CronManager.Job.Edit"/>
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