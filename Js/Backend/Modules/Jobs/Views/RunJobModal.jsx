import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class RunJobModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);

        this.state = {
            jobRunning: true,
            status: 'info',
            message: 'Cron job is running ... please wait',
            cronId: this.props.data.id
        };

        this.bindMethods('runCron');
        this.runCron();
    }

    runCron() {
        const api = new Webiny.Api.Endpoint('/services/cron-manager/runner');
        return api.get('run-job/' + this.props.data.id).then(ar => {
            if (ar.response.status !== 200) {
                this.setState({
                    status: 'error',
                    message: 'Oopss..something went wrong',
                    jobRunning: false
                });

                return;
            }

            this.setState({
                status: 'success',
                message: 'Cron was executed, please check the cron history for more details',
                jobRunning: false
            });
        });
    }

    render() {
        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title={'Running ' + this.props.data.name}/>
                <Ui.Modal.Body>

                    <Ui.Alert type={this.state.status}>{this.state.message}</Ui.Alert>

                    {this.state.jobRunning && (
                        <div style={{position: 'relative'}}>
                            <div className="loading-overlay">
                                <div className="loading-overlay__icon-wrapper">
                                    <div className="loading-overlay__icon"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!this.state.jobRunning && (
                        <center>
                            <Ui.Link
                                type="default"
                                route="CronManager.Job.History"
                                params={{'id': this.state.cronId}}>
                                Cron History
                            </Ui.Link>
                        </center>
                    )}

                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Close" disabled={this.state.jobRunning && 'disabled'} onClick={this.hide}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default RunJobModal;