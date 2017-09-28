import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import HelpModal from './HelpModal';
import RunJobModal from './RunJobModal';

/**
 * @i18n.namespace CronManager.Backend.Jobs.JobList
 */
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
            placeholder: this.i18n('Status'),
            allowClear: true,
            name: 'enabled'
        };

        const searchProps = {
            placeholder: this.i18n('Search...'),
            name: '_searchQuery'
        };

        const {ViewSwitcher, Link, Icon, List, Grid, View, Input, Button, Select, Dropdown} = this.props;
        const Table = List.Table;

        return (
            <ViewSwitcher>
                <ViewSwitcher.View view="jobListView" defaultView>
                    {({showView}) => (
                        <view>
                            <View.List>
                                <View.Header title={this.i18n('Cron Jobs')}>
                                    <Link type="primary" align="right" route="CronManager.Job.Create">
                                        <Icon icon="icon-plus-circled"/>
                                        {this.i18n('Create new job')}
                                    </Link>
                                    <Link type="default" align="right" onClick={() => this.helpModal.show()}>
                                        <Icon icon="icon-info-circle"/>
                                        {this.i18n('Help')}
                                    </Link>
                                    <HelpModal ref={ref => this.helpModal = ref}/>
                                </View.Header>
                                <View.Body>
                                    <List {...listProps}>
                                        <List.FormFilters>
                                            {({apply, reset}) => (
                                                <Grid.Row>
                                                    <Grid.Col all={6}>
                                                        <Input {...searchProps} onEnter={apply()}/>
                                                    </Grid.Col>
                                                    <Grid.Col all={5}>
                                                        <Select {...statusProps} onChange={apply()}>
                                                            <option value="true">{this.i18n('Enabled')}</option>
                                                            <option value="false">{this.i18n('Disabled')}</option>
                                                        </Select>
                                                    </Grid.Col>
                                                    <Grid.Col all={1}>
                                                        <Button type="secondary" label={this.i18n('Reset')} onClick={reset()}/>
                                                    </Grid.Col>
                                                </Grid.Row>
                                            )}
                                        </List.FormFilters>
                                        <Table>
                                            <Table.Row>
                                                <Table.Field name="name" label={this.i18n('Name')} sort="name" route="CronManager.Job.Edit"/>
                                                <Table.Field name="target" align="left" label={this.i18n('Target')} sort="target"/>
                                                <Table.CaseField name="enabled" label={this.i18n('Frequency')} align="left">
                                                    <case value={true}>
                                                        {({data}) => (
                                                            <div>
                                                                {_.get(data, 'frequency.name')}
                                                                <br/>
                                                                {this.i18n('Next Run: {run}', {run: data.nextRunDate})}
                                                                <br/>
                                                                <small>{data.timezone}</small>
                                                            </div>
                                                        )}
                                                    </case>
                                                    <case value={false}>
                                                        {({data}) => (
                                                            <div>
                                                                {_.get(data, 'frequency.name')}
                                                            </div>
                                                        )}
                                                    </case>
                                                </Table.CaseField>
                                                <Table.CaseField name="status" label={this.i18n('Status')} align="left">
                                                    <case value="inactive">{this.i18n('In-active')}</case>
                                                    <case value="scheduled">{this.i18n('Scheduled')}</case>
                                                    <case value="running">{this.i18n('Running')}</case>
                                                </Table.CaseField>
                                                <Table.TimeAgoField name="createdOn" align="left" label={this.i18n('Created')} sort="createdOn"/>
                                                <Table.ToggleField name="enabled" label={this.i18n('Enabled')} align="center"/>
                                                <Table.Actions>
                                                    <Table.RouteAction
                                                        label={this.i18n('View History')}
                                                        icon="fa-history"
                                                        type="primary"
                                                        align="right"
                                                        route="CronManager.Job.History"/>
                                                    <Table.Action
                                                        label={this.i18n('Run Job Now')}
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
                    {({showView, data: {data}}) => <RunJobModal {...{showView, data}}/>}
                </ViewSwitcher.View>
            </ViewSwitcher>
        );
    }
};

export default Webiny.createComponent(JobList, {
    modules: ['ViewSwitcher', 'Link', 'Icon', 'List', 'Grid', 'View', 'Input', 'Button', 'Select', 'Dropdown']
});