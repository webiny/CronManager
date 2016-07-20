import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class HelpModal extends Webiny.Ui.ModalComponent {

    renderDialog() {
        return (
            <Ui.Modal.Dialog>
                <Ui.Modal.Header title="Help"/>
                <Ui.Modal.Body>
                    <h3>About</h3>
                    <p>
                        Cron Manager is a tool used to schedule and execute cron jobs using a simple interface.
                    </p>
                    <p>
                        For each cron job the app automatically saves execution data and all responses. This way you
                        can easily track the execution of your cron jobs.
                        <br/>
                        The grid presented behind automatically refreshes and changes the status for each scheduled job.
                        This way you can immediately know if a job is active, scheduled or currently running.
                    </p>
                    <h3>Setup</h3>
                    <p>
                        On your server make sure you define the following cron job:
                    </p>
                    <Ui.Copy.Input value={`* * * * * wget ${webinyApiPath}/services/cron-manager/runner/run >/dev/null 2>&1`}/>
                    <p>
                        This is the root job that's used to execute and schedule any other jobs created via Cron Manager.
                    </p>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Close" onClick={this.hide}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default HelpModal;