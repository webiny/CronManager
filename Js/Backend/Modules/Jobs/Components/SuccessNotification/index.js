import React from 'react';

export default ({notification}) => {
    return (
        <div>
            <span className="icon-check icon"/>
            <div className="drop-txt">
                <a href="#">{notification.subject}</a>
            </div>
        </div>
    );
};