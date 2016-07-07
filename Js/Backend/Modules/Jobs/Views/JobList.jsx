import Webiny from 'Webiny';
import HelpModal from './HelpModal';
import RunJobModal from './RunJobModal';
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
            fields: 'name,url,frequency,enabled,createdOn,nextRunDate,status,timezone',
            connectToRouter: true,
            searchFields: 'name',
            //autoRefresh: 5
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
            <Ui.ViewSwitcher.Container>
                <Ui.ViewSwitcher.View view="jobListView" defaultView>
                    {showView => (
                        <view>
                            <Ui.View.List>
                                <Ui.View.Header title="Cron Jobs">
                                    <Ui.Link type="primary" align="right" route="CronManager.Job.Create">
                                        <Ui.Icon icon="icon-plus-circled"/>
                                        Create new job
                                    </Ui.Link>

                                    <Ui.Link type="default" align="right" onClick={this.ui('helpModal:show')}>
                                        <Ui.Icon icon="icon-info-circle"/>
                                        Help
                                    </Ui.Link>

                                    <HelpModal ui="helpModal"/>
                                </Ui.View.Header>

                                <Ui.View.Body>
                                    <Ui.List.ApiContainer ui="myList" {...listProps}>

                                        <Ui.List.FormFilters>
                                            {(applyFilters, resetFilters) => (
                                                <Ui.Grid.Row>
                                                    <Ui.Grid.Col all={6}>
                                                        <Ui.Input {...searchProps} onEnter={applyFilters()}/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={5}>
                                                        <Ui.Select {...statusProps} onChange={applyFilters()}>
                                                            <option value="true">Enabled</option>
                                                            <option value="false">Disabled</option>
                                                        </Ui.Select>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={1}>
                                                        <Ui.Button type="secondary" label="Reset"
                                                                   onClick={resetFilters()}/>
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
                                                                Next Run: {data.nextRunDate}<br/>
                                                                <small>{data.timezone}</small>
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
                                                <Table.TimeAgoField name="createdOn" align="left" label="Created"
                                                                    sort="createdOn"/>

                                                <Table.ToggleField name="enabled" label="Enabled" align="center"/>

                                                <Table.Actions>
                                                    <Table.EditAction route="CronManager.Job.Edit"/>
                                                    <Table.RouteAction label="History" type="primary" align="right"
                                                                       route="CronManager.Job.History"/>
                                                    <Table.Action label="Run Job Now" type="primary" align="right"
                                                                  onClick={showView('runJobView')}/>
                                                    <Table.DeleteAction/>
                                                </Table.Actions>
                                            </Table.Row>
                                            <Table.Empty/>
                                        </Table.Table>
                                        <Ui.List.Pagination/>
                                    </Ui.List.ApiContainer>
                                </Ui.View.Body>
                            </Ui.View.List>
                        </view>
                    )}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="runJobView" modal>
                    {(showView, data) => <RunJobModal ui="themeModal" {...{showView, data}} />}
                </Ui.ViewSwitcher.View>


            </Ui.ViewSwitcher.Container>
        );
    }
};

export default JobList;