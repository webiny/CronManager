import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import HistoryDetailsModal from './HistoryDetailsModal';

/**
 * @i18n.namespace CronManager.Backend.Jobs.JobHistoryList
 */
class JobHistoryList extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.bindMethods('getSuccessRatio, getAvgResponseTime');
    }

    getSuccessRatio(jobData) {
        let successRatio = 100;
        if (_.get(jobData, 'stats.numberOfRuns', 0) > 0) {
            successRatio = _.round(((_.get(jobData, 'stats.successfulRuns') / _.get(jobData, 'stats.numberOfRuns')) * 100), 2);
        }

        return successRatio + '%';
    }

    getAvgResponseTime(jobData) {
        let avgResponseTime = 0;
        if (_.get(jobData, 'stats.numberOfRuns', 0) > 0) {
            avgResponseTime = _.round(_.get(jobData, 'stats.totalExecTime') / _.get(jobData, 'stats.numberOfRuns'), 5);
        }

        return avgResponseTime + 'sec';
    }

}

JobHistoryList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/cron-manager/jobs',
            url: Webiny.Router.getParams('id') + '/history',
            sort: '-runDate',
            fields: 'job,runDate,runTime,responseCode,successful,serverIp,debugLog,result',
            connectToRouter: true
        };

        const statProps = {
            api: '/entities/cron-manager/job',
            url: Webiny.Router.getParams('id'),
            prepareLoadedData: ({data}) => data.entity
        };

        const {ViewSwitcher, View, Data, Link, Grid, Tile, List, Button} = this.props;
        const Table = List.Table;

        return (
            <ViewSwitcher>
                <ViewSwitcher.View view="jobListView" defaultView>
                    {({showView}) => (
                        <view>
                            <Data {...statProps}>
                                {({data}) => (
                                    <View.List>
                                        <View.Header title={this.i18n('Cron Job History: {name}', {name: _.get(data, 'name')})}>
                                            <Link type="default" align="right" route="CronManager.Jobs">{this.i18n('Back to Job List')}</Link>
                                        </View.Header>
                                        <View.Body>
                                            <Grid.Row>
                                                <Grid.Row className="text-center">
                                                    <Grid.Col all={4}>
                                                        <Tile>
                                                            <Tile.Header className="text-center" title={this.i18n('# of executions')}/>
                                                            <Tile.Body>
                                                                <h1>{_.get(data, 'stats.numberOfRuns')}</h1>
                                                            </Tile.Body>
                                                        </Tile>
                                                    </Grid.Col>
                                                    <Grid.Col all={4}>
                                                        <Tile>
                                                            <Tile.Header title={this.i18n('Success ratio')}/>
                                                            <Tile.Body>
                                                                <h1>{this.getSuccessRatio(data)}</h1>
                                                            </Tile.Body>
                                                        </Tile>
                                                    </Grid.Col>
                                                    <Grid.Col all={4}>
                                                        <Tile>
                                                            <Tile.Header title={this.i18n('Avg. response time')}/>
                                                            <Tile.Body>
                                                                <h1>{this.getAvgResponseTime(data)}</h1>
                                                            </Tile.Body>
                                                        </Tile>
                                                    </Grid.Col>
                                                </Grid.Row>
                                                <Grid.Col all={12}>
                                                    <br/>
                                                    <List {...listProps}>
                                                        <Table>
                                                            <Table.Row>
                                                                <Table.TimeAgoField
                                                                    name="runDate"
                                                                    align="left"
                                                                    label={this.i18n('Run Date')}
                                                                    sort="runDate"/>
                                                                <Table.Field
                                                                    name="runTime"
                                                                    align="left"
                                                                    label={this.i18n('Run Time')}
                                                                    sort="runTime"/>
                                                                <Table.Field
                                                                    name="responseCode"
                                                                    align="center"
                                                                    label={this.i18n('Response Code')}
                                                                    sort="responseCode"/>
                                                                <Table.Field align="right">
                                                                    {({data}) => (
                                                                        <Button
                                                                            type="default"
                                                                            label={this.i18n('Show Details')}
                                                                            onClick={() => showView('historyModalView')(data)}/>
                                                                    )}
                                                                </Table.Field>
                                                            </Table.Row>
                                                        </Table>
                                                        <List.Pagination/>
                                                    </List>
                                                </Grid.Col>
                                            </Grid.Row>
                                        </View.Body>
                                    </View.List>
                                )}
                            </Data>
                        </view>
                    )}
                </ViewSwitcher.View>
                <ViewSwitcher.View view="historyModalView" modal>
                    {params => <HistoryDetailsModal {...params} />}
                </ViewSwitcher.View>
            </ViewSwitcher>
        );
    }
};

export default Webiny.createComponent(JobHistoryList, {modules: ['ViewSwitcher', 'View', 'Data', 'Link', 'Grid', 'Tile', 'List', 'Button']});