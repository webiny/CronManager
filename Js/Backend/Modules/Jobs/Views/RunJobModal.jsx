import Webiny from 'Webiny';

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
        return api.get('run/' + this.props.data.id).then(ar => {
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

    renderDialog() {
        const {Modal, Alert, Link, Button} = this.props;
        return (
            <Modal.Dialog>
                <Modal.Header title={'Running ' + this.props.data.name}/>
                <Modal.Body>
                    <Alert type={this.state.status}>{this.state.message}</Alert>

                    {this.state.jobRunning && (
                        <div style={{position: 'relative'}}>
                            <div className="loading-overlay">
                                <div className="loading-overlay__icon-wrapper">
                                    <div className="loading-overlay__icon"/>
                                </div>
                            </div>
                        </div>
                    )}

                    {!this.state.jobRunning && (
                        <center>
                            <Link
                                type="default"
                                route="CronManager.Job.History"
                                params={{'id': this.state.cronId}}>
                                Cron History
                            </Link>
                        </center>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button label="Close" disabled={this.state.jobRunning && 'disabled'} onClick={this.hide}/>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(RunJobModal, {modules: ['Modal', 'Alert', 'Link', 'Button']});