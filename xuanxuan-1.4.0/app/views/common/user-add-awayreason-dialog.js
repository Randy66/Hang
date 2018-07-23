import React, { Component, PropTypes } from 'react';
import Modal from '../../components/modal';
import InputControl from '../../components/input-control';
import Messager from '../../components/messager';
import App from '../../core';
import HTML from '../../utils/html-helper';
import StringHelper from '../../utils/string-helper';
import Lang from '../../lang';

class UserAddAwayReason extends Component {
    static propTypes = {
        onFinish: PropTypes.func,
        className: PropTypes.string,
    };

    static defaultProps = {
        onFinish: null,
        className: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            oldReason: '',
            reasons: '',

            message: '',
            doing: false
        };
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value, message: '' });
    }

    handleCancelBtnClick = () => {
        if (this.props.onFinish) {
            this.props.onFinish(false);
        }
    }

    handleConfirmBtnClick = () => {
        if (StringHelper.isEmpty(this.state.reasons)) {
            return this.setState({ message: "事由不能为空" });//Lang.format('user.changePassword.inputRequired', Lang.string('user.changePassword.newPassword'))
        }
        if (this.state.reasons.length > 10) {
            return this.setState({ message: "事由过长" });
        }
        if (StringHelper.isEmpty(this.state.reasons)) {
            return this.setState({ message: "事由不能为空" });
        }

        this.setState({ doing: true });

        App.server.socket.addAwayReason(this.state.reasons).then(() => {
            //我加的
            App.server.changeUserStatus('away');
            this.setState({ doing: false });
            if (this.props.onFinish) {
                this.props.onFinish(true);

            }
        }).catch(error => {
            this.setState({
                message: Lang.error(error) || Lang.string('user.changePassword.failed'),
                doing: false
            });
        });
    }

    render() {
        const {
            onFinish,
            className,
            ...other
        } = this.props;
        //我加的
        const userStatus = App.profile.userStatus;

        return (<div className={HTML.classes('app-user-change-pwd', className)} {...other}>
            {this.state.message && <div className="box danger rounded space-sm">{this.state.message}</div>}
            <InputControl inputType="text" className={this.state.message && (StringHelper.isEmpty(this.state.reasons)) ? 'has-error' : ''} disabled={this.state.doing} onChange={this.handleInputChange.bind(this, 'reasons')} value={this.state.reasons} label="添加离开事由" />
            {/* <InputControl inputType="password" className={this.state.message && (StringHelper.isEmpty(this.state.password2) || this.state.password1 !== this.state.password2) ? 'has-error' : ''} disabled={this.state.doing} onChange={this.handleInputChange.bind(this, 'password2')} value={this.state.password2} label={Lang.string('user.changePassword.newPasswordRepeat')} /> */}
            <div className="has-padding-v">
                <button disabled={this.state.doing} onClick={this.handleConfirmBtnClick} type="button" className="btn primary btn-wide">确认</button>
                &nbsp;
                <button disabled={this.state.doing} onClick={this.handleCancelBtnClick} type="button" className="btn gray btn-wide">取消</button>
            </div>
        </div>);
    }
}

const show = (callback) => {
    const modalId = 'user-add-reason';
    const onFinish = result => {
        Modal.hide(modalId);
        if (result) {
            Messager.show("添加成功", { type: 'success' });

        }
    };
    return Modal.show({
        actions: false,
        id: modalId,
        className: 'app-user-add-awayreason-dialog',
        content: <UserAddAwayReason onFinish={onFinish} />,
        title: "离开事由"
    }, callback);
};

export default {
    show,
};
