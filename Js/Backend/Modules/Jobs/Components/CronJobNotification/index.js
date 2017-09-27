import Webiny from 'webiny';
import React from 'react';
import CronJobNotificationModal from './Details';

class CronJobNotification extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('onClick');
    }

    onClick() {
        console.log(`Clicked notification #${this.props.notification.id}`);
        this.dialog.show();
    }
}

CronJobNotification.defaultProps = {
    renderer() {
        const {Filters, Label, notification} = this.props;
        return (
            <div onClick={this.onClick}>
                <span>
                    {!notification.read && (
                        <Label type="success">New</Label>
                    )}
                    <strong>{notification.subject}</strong>
                </span><br/>
                <span>{notification.text}</span><br/>
                <span><Filters.TimeAgo value={notification.createdOn}/></span>
                <CronJobNotificationModal notification={notification} ref={ref => this.dialog = ref}/>
            </div>
        );
    }
};

export default Webiny.createComponent(CronJobNotification, {modules: ['Filters', 'Label']});