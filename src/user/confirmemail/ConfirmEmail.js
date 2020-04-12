import React, { Component } from 'react';
import { requestConfirmEmail } from '../../util/APIUtils';

import { notification } from 'antd';

class ConfirmEmail extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount = () => {
        const { id } = this.props.match.params;

        requestConfirmEmail(id)
        .then(res => {
            notification.success({
            });  
        })
        .catch(error => {
            notification.error({
            });
        })
    };

    render(){
        return (
            <div>

            </div>
        )
    }
}

export default ConfirmEmail;