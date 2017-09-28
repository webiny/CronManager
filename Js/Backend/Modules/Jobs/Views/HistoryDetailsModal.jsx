import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace CronManager.Backend.Jobs.HistoryDetailsModal
 */
class HistoryDetailsModal extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const {Modal, Tabs, Textarea, Button} = this.props;
        return (
            <Modal.Dialog>
                <Modal.Content>
                    <Modal.Header title={this.i18n('History Details')}/>
                    <Modal.Body>
                        <Tabs>
                            <Tabs.Tab label={this.i18n('Details')}>
                                <dl className="dl-horizontal">
                                    <dt>{this.i18n('Job Name')}</dt>
                                    <dd>{this.props.data.job.name}</dd>

                                    <dt>{this.i18n('Job Target')}</dt>
                                    <dd>{this.props.data.job.target}</dd>

                                    <dt>{this.i18n('Server IP')}</dt>
                                    <dd>{this.props.data.serverIp}</dd>

                                    <dt>{this.i18n('Last Run ')}Date</dt>
                                    <dd>{this.props.data.runDate}</dd>

                                    <dt>{this.i18n('Run Time')}</dt>
                                    <dd>{this.props.data.runTime} sec</dd>

                                    <dt>{this.i18n('Response Code')}</dt>
                                    <dd>{this.props.data.responseCode}</dd>
                                </dl>
                            </Tabs.Tab>

                            <Tabs.Tab label={this.i18n('Response')}>
                                <Textarea readOnly={true} value={this.props.data.result}/>
                            </Tabs.Tab>
                            <Tabs.Tab label={this.i18n('Debug Log')}>
                                <Textarea readOnly={true} value={this.props.data.debugLog.message}/>
                            </Tabs.Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button label={this.i18n('Close')} onClick={this.hide}/>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(HistoryDetailsModal, {modules: ['Modal', 'Tabs', 'Textarea', 'Button']});