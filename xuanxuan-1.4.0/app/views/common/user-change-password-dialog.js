import React, {Component, PropTypes} from 'react';
import Modal from '../../components/modal';
import InputControl from '../../components/input-control';
import Messager from '../../components/messager';
import App from '../../core';
import HTML from '../../utils/html-helper';
import StringHelper from '../../utils/string-helper';
import Lang from '../../lang';

class UserChangePassword extends Component {
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
            oldPassword: '', 
            password1: '',
            password2: '',
            message: '',
            doing: false
        };
    }

    handleInputChange(name, value) {
        this.setState({[name]: value, message: ''});
    }

    handleCancelBtnClick = () => {
        if (this.props.onFinish) {
            this.props.onFinish(false);
        }
    }

    handleConfirmBtnClick = () => {
        if (StringHelper.isEmpty(this.state.oldPassword)) {
            return this.setState({message: '请输入旧密码!'});
        }
        if (this.state.oldPassword.length < 6) {
            return this.setState({message: '旧密码错误!'});
        }//以上我改的
        if (StringHelper.isEmpty(this.state.password1)) {
            return this.setState({message: Lang.format('user.changePassword.inputRequired', Lang.string('user.changePassword.password1'))});
        }
        if (this.state.password1.length < 6) {
            return this.setState({message: Lang.string('user.changePassword.denySimplePassword')});
        }
        if (StringHelper.isEmpty(this.state.password2)) {
            return this.setState({message: Lang.format('user.changePassword.inputRequired', Lang.string('user.changePassword.password2'))});
        }
        if (this.state.password1 !== this.state.password2) {
            return this.setState({message: Lang.string('user.changePassword.passwordNotSame')});
        }
        this.setState({doing: true});
  //我改了
        if(App.server.socket.checkOldPassword(this.state.oldPassword)){
            App.server.socket.changeUserPassword(this.state.password1).then(() => {
                this.setState({doing: false});
                 if (this.props.onFinish) {
                    this.props.onFinish(true);
                }
            }).catch(error => {
                this.setState({
                    message: Lang.error(error) || Lang.string('user.changePassword.failed'),
                    doing: false
                });
            });
    }else{
        this.setState({
            message: '旧密码错误!',
            doing: false
        });
    }
}
    render() {
        const {
            onFinish,
            className,
            ...other
        } = this.props;
        return (<div className={HTML.classes('app-user-change-pwd', className)} {...other}>
            {this.state.message && <div className="box danger rounded space-sm">{this.state.message}</div>}
            {/* 我加的 */}
            <InputControl inputType="password" className={this.state.message && (StringHelper.isEmpty(this.state.oldPassword) || this.state.oldPassword !== this.state.password2) ? 'has-error' : ''} disabled={this.state.doing} onChange={this.handleInputChange.bind(this, 'oldPassword')} value={this.state.oldPassword} label='旧密码' />
            <InputControl inputType="password" className={this.state.message && (StringHelper.isEmpty(this.state.password1) || this.state.password1 !== this.state.password2) ? 'has-error' : ''} disabled={this.state.doing} onChange={this.handleInputChange.bind(this, 'password1')} value={this.state.password1} label={Lang.string('user.changePassword.newPassword')} />
            <InputControl inputType="password" className={this.state.message && (StringHelper.isEmpty(this.state.password2) || this.state.password1 !== this.state.password2) ? 'has-error' : ''} disabled={this.state.doing} onChange={this.handleInputChange.bind(this, 'password2')} value={this.state.password2} label={Lang.string('user.changePassword.newPasswordRepeat')} />
            <div className="has-padding-v">
                <button disabled={this.state.doing} onClick={this.handleConfirmBtnClick} type="button" className="btn primary btn-wide">{Lang.string('user.changePassword.btn.confirm')}</button>
                 &nbsp;
                <button disabled={this.state.doing} onClick={this.handleCancelBtnClick} type="button" className="btn gray btn-wide">{Lang.string('common.cancel')}</button>
            </div>
        </div>);
    }
}

const show = (callback) => {
    const modalId = 'user-change-pwd';
    const onFinish = result => {
        Modal.hide(modalId);
        if (result) {
            Messager.show(Lang.string('user.changePassword.success'), {type: 'success'});
        }
    };
    return Modal.show({
        actions: false,
        id: modalId,
        className: 'app-user-change-pwd-dialog',
        content: <UserChangePassword onFinish={onFinish} />,
        title: Lang.string('user.changePassword.heading')
    }, callback);
};

export default {
    show,
};
