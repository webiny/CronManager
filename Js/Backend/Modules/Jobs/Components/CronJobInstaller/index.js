import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import CreateJobModal from './CreateJobModal';
import styles from './styles.css';

class CronJobInstaller extends Webiny.Ui.FormComponent {

}

CronJobInstaller.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    renderer() {
        const {Button, styles} = this.props;

        const props = {
            className: styles['form-control'],
            readOnly: true,
            type: 'text',
            value: this.props.value || ''
        };

        return (
            <div className={this.classSet(styles['form-group'])}>
                {this.renderLabel()}
                {this.renderInfo()}
                <div className={styles['input-group']}>
                    <input {...props}/>
                    <Button onClick={() => this.modal.show()} type="primary" className={styles.btnCopy}>Install Cron Job</Button>
                    <CreateJobModal ref={ref => this.modal = ref} url={this.props.value}/>
                </div>
                {this.renderDescription()}
            </div>
        );
    }
});

export default Webiny.createComponent(CronJobInstaller, {modules: ['Input', 'Button'], styles});