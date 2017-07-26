import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import HelpModal from './HelpModal';
import RunJobModal from './RunJobModal';

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
            fields: 'name,url,frequency,enabled,createdOn,nextRunDate,status,timezone,target',
            connectToRouter: true,
            searchFields: 'name',
            autoRefresh: 3
        };

        const statusProps = {
            placeholder: 'Status',
            allowClear: true,
            name: 'enabled'
        };

        const searchProps = {
            placeholder: 'Search...',
            name: '_searchQuery'
        };

        const {ViewSwitcher, Link, Icon, List, Grid, View, Input, Button, Select, Dropdown} = this.props;
        const Table = List.Table;

        return (
            <ViewSwitcher>
                <ViewSwitcher.View view="jobListView" defaultView>
                    {showView => (
                        <view>
                            <View.List>
                                <View.Header title="Cron Jobs">
                                    <Link type="primary" align="right" route="CronManager.Job.Create">
                                        <Icon icon="icon-plus-circled"/>
                                        Create new job
                                    </Link>
                                    <Link type="default" align="right" onClick={() => this.helpModal.show()}>
                                        <Icon icon="icon-info-circle"/>
                                        Help
                                    </Link>
                                    <HelpModal ref={ref => this.helpModal = ref}/>
                                </View.Header>
                                <View.Body>
                                    <List {...listProps}>
                                        <List.FormFilters>
                                            {(applyFilters, resetFilters) => (
                                                <Grid.Row>
                                                    <Grid.Col all={6}>
                                                        <Input {...searchProps} onEnter={applyFilters()}/>
                                                    </Grid.Col>
                                                    <Grid.Col all={5}>
                                                        <Select {...statusProps} onChange={applyFilters()}>
                                                            <option value="true">Enabled</option>
                                                            <option value="false">Disabled</option>
                                                        </Select>
                                                    </Grid.Col>
                                                    <Grid.Col all={1}>
                                                        <Button type="secondary" label="Reset" onClick={resetFilters()}/>
                                                    </Grid.Col>
                                                </Grid.Row>
                                            )}
                                        </List.FormFilters>
                                        <Table>
                                            <Table.Row>
                                                <Table.Field name="name" align="left" label="Name" sort="name" route="CronManager.Job.Edit"/>
                                                <Table.Field name="target" align="left" label="Target" sort="target"/>
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
                                                        {data => (
                                                            <div>
                                                                {_.get(data, 'frequency.name')}
                                                            </div>
                                                        )}
                                                    </case>
                                                </Table.CaseField>
                                                <Table.CaseField name="status" label="Status" align="left">
                                                    <case value="inactive">In-active</case>
                                                    <case value="scheduled">Scheduled</case>
                                                    <case value="running">Running</case>
                                                </Table.CaseField>
                                                <Table.TimeAgoField name="createdOn" align="left" label="Created" sort="createdOn"/>
                                                <Table.ToggleField name="enabled" label="Enabled" align="center"/>
                                                <Table.Actions>
                                                    <Table.RouteAction
                                                        label="View History"
                                                        icon="fa-history"
                                                        type="primary"
                                                        align="right"
                                                        route="CronManager.Job.History"/>
                                                    <Table.Action
                                                        label="Run Job Now"
                                                        icon="fa-reply-all"
                                                        type="primary"
                                                        align="right"
                                                        onClick={showView('runJobView')}/>
                                                    <Dropdown.Divider/>
                                                    <Table.EditAction route="CronManager.Job.Edit"/>
                                                    <Table.DeleteAction/>
                                                </Table.Actions>
                                            </Table.Row>
                                        </Table>
                                        <List.Pagination/>
                                    </List>
                                </View.Body>
                            </View.List>
                        </view>
                    )}
                </ViewSwitcher.View>
                <ViewSwitcher.View view="runJobView" modal>
                    {(showView, data) => <RunJobModal {...{showView, data}} />}
                </ViewSwitcher.View>
            </ViewSwitcher>
        );
    }
};

export default Webiny.createComponent(JobList, {
    modules: ['ViewSwitcher', 'Link', 'Icon', 'List', 'Grid', 'View', 'Input', 'Button', 'Select', 'Dropdown']
});