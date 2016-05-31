import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class JobList extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            search: Webiny.Router.getQueryParams('_searchQuery')
        };
    }
}

JobList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/cron-manager/jobs',
            fields: 'name,url,frequency,enabled,createdOn,nextRunDate,status',
            connectToRouter: true,
            searchFields: 'name',
            autoRefresh: 2
        };

        const statusProps = {
            ui: 'statusFilter',
            placeholder: Webiny.i18n('webiny.core.statusFilter.placeholder', 'Status'),
            allowClear: true,
            name: 'enabled'
        };

        const searchProps = {
            placeholder: 'Search...',
            name: '_searchQuery'
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
                            {(applyFilters, resetFilters) => (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={5}>
                                        <Ui.Input {...searchProps} onEnter={applyFilters()}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={5}>
                                        <Ui.Select {...statusProps} onChange={applyFilters()}>
                                            <option value="true">Enabled</option>
                                            <option value="false">Disabled</option>
                                        </Ui.Select>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={2}>
                                        <Ui.Button type="primary" label="Filter" onClick={applyFilters()}/>
                                        <Ui.Button type="secondary" label="Reset" onClick={resetFilters()}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            )}
                        </Ui.List.FormFilters>

                        <Table.Table>
                            <Table.Row>
                                <Table.Field name="name" align="left" label="Name" sort="name"/>
                                <Table.Field name="url" align="left" label="Url" sort="url"/>
                                <Table.CaseField name="enabled" label="Frequency" align="left">
                                    <case value={true}>
                                        {data => (
                                            <div>
                                                {_.get(data, 'frequency.name')}
                                                <br/>
                                                Next Run: {data.nextRunDate}
                                            </div>
                                        )}
                                    </case>
                                    <case value={false}>
                                        Not scheduled
                                    </case>
                                </Table.CaseField>
                                <Table.CaseField name="status" label="Status" align="left">
                                    <case value={1}>In-active</case>
                                    <case value={2}>Scheduled</case>
                                    <case value={3}>Running</case>
                                </Table.CaseField>
                                <Table.TimeAgoField name="createdOn" align="left" label="Created On" sort="createdOn"/>

                                <Table.ToggleField name="enabled" label="Enabled" align="center"/>

                                <Table.Actions>
                                    <Table.EditAction route="CronManager.Job.Edit"/>
                                    <Table.RouteAction label="History" type="primary" align="right" route="CronManager.Job.History"/>
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

export default JobList;