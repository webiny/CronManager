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

        const statProps = {
            api: '/entities/cron-manager/job',
            url: '/' + Webiny.Router.getParams('id')
        };

        return (
            <Ui.Data ui="stats" {...statProps}>
                {data => (
                    <Ui.View.List>
                        <Ui.View.Header title={'Cron Job History: ' + _.get(data, 'name')}>
                            <Ui.Link type="default" align="right" route="CronManager.Jobs">Back to Job List</Ui.Link>
                        </Ui.View.Header>
                        <Ui.View.Body>
                            <Ui.Grid.Row>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={4}>
                                        <Ui.Tile.Tile>
                                            <Ui.Tile.Header title="# of executions"/>
                                            <Ui.Tile.Body>
                                                <h1>{_.get(data, 'stats.numberOfRuns')}</h1>
                                            </Ui.Tile.Body>
                                        </Ui.Tile.Tile>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={4}>
                                        <Ui.Tile.Tile>
                                            <Ui.Tile.Header title="Success ratio"/>
                                            <Ui.Tile.Body>
                                                <h1>{_.round(((_.get(data, 'stats.successfulRuns') / _.get(data, 'stats.numberOfRuns')) * 100), 2)}%</h1>
                                            </Ui.Tile.Body>
                                        </Ui.Tile.Tile>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={4}>
                                        <Ui.Tile.Tile>
                                            <Ui.Tile.Header title="Avg. response time"/>
                                            <Ui.Tile.Body>
                                                <h1>{_.round(_.get(data, 'stats.totalExecTime') / _.get(data, 'stats.numberOfRuns'), 5)}
                                                    sec</h1>
                                            </Ui.Tile.Body>
                                        </Ui.Tile.Tile>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <br/>
                                    <Ui.List.ApiContainer ui="historyList" {...listProps}>

                                        <Table.Table>
                                            <Table.Row>
                                                <Table.TimeAgoField name="runDate" align="left" label="Run Date" sort="runDate"/>
                                                <Table.Field name="runTime" align="left" label="Run Time" sort="runTime"/>
                                                <Table.Field name="responseCode" align="left" label="Response Code" sort="responseCode"/>
                                                <Table.Field align="right">
                                                    {data => (
                                                        <span>
                                                            <Ui.Button
                                                                type="default"
                                                                label="Show Details"
                                                                onClick={this.ui('historyDetailsModal:show')}/>
                                                            <HistoryDetailsModal ui="historyDetailsModal" data={data}/>
                                                        </span>
                                                    )}
                                                </Table.Field>
                                            </Table.Row>

                                            <Table.Empty/>
                                        </Table.Table>

                                        <Ui.List.Pagination/>
                                    </Ui.List.ApiContainer>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        </Ui.View.Body>
                    </Ui.View.List>
                )}
            </Ui.Data>
        );
    }
};

export default JobHistoryList;