import React, {Component, PropTypes} from 'react';
import Modal from '../../components/modal';
import InputControl from '../../components/input-control';
import Messager from '../../components/messager';
import App from '../../core';
import HTML from '../../utils/html-helper';
import StringHelper from '../../utils/string-helper';
import Lang from '../../lang';

import Server from '../../core/im/im-server';
import chats from '../../core/im/im-chats';

import Selectbox from '../../components/select-box';
import {getFile} from '../../core/im/im-ui'
const  items=[
{
    type: 'select',
    name: '保mi级别',
    className: 'level-2',
    options: [
        {value: '公开', label: "公开"},
        {value: '内部', label: "内部"},
        {value: '秘mi', label: "秘mi"},
        {value: '机mi', label: "机mi"},
    ],
    //hidden: isFlashTrayIconOff,
    caption: '保mi级别:'
}]

class SelectFileUploadSafeLevel extends Component {
    
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
        //let fileAndId = getFile();
        //this.setState({filename: fileAndId[0].name});
        this.state = {
            fileAndId : getFile(),
            safeLevel: '公开',
            
            
            message: '',
            doing: false
        };
        
    }
    //我加的
    static get UserSetting() {
   
        return this.state;
    }
    getSettings() {
        return this.state;
    }
    setSettings(settings) {
        this.setState(Object.assign({}, settings));
    }
    changeConfig(item, value) {
       
        const name = item.name;
        if (typeof value === 'object' && value.target) {
            if (value.target.type === 'checkbox') {
                value = value.target.checked;
            } else {
                value = value.target.value;
            }
        }
        if (item.setConverter) {
            value = item.setConverter(value);
        }
        this.setState({safeLevel: value});
        
        this.setState({[name]: value});
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
        // if (StringHelper.isEmpty(this.state.reasons)) {
        //     return this.setState({message: "事由不能为空"});//Lang.format('user.changePassword.inputRequired', Lang.string('user.changePassword.newPassword'))
        // }
        // if (this.state.reasons.length > 10) {
        //     return this.setState({message: "事由过长"});
        // }
        // if (StringHelper.isEmpty(this.state.reasons)) {
        //     return this.setState({message: "事由不能为空"});
        // }
       
        this.setState({doing: true});
        this.setState({doing: false});
             if (this.props.onFinish) {
                 this.props.onFinish(true);
             }
            //let fileAndId = getFile();
            
            this.state.fileAndId[0]['safe_level'] = this.state.safeLevel;
            //filename = fileAndId[0].name
           // console.log(filename);
            Server.sendFileMessage(this.state.fileAndId[0], this.state.fileAndId[1]);
            
             //console.log(this.state.safeLevel);
             
        // App.server.socket.addAwayReason(this.state.reasons).then(() => {
        //     //我加的
        //     App.server.changeUserStatus('away') ;
        //     this.setState({doing: false});
        //     if (this.props.onFinish) {
        //         this.props.onFinish(true);
            
        //     }
        // }).catch(error => {
        //     this.setState({
        //         message: Lang.error(error) || Lang.string('user.changePassword.failed'),
        //         doing: false
        //     });
        // });
    }
    renderSelectItem(item) {
        let value = this.state[item.name];
        if (item.getConverter) {
            value = item.getConverter(value);
        }
        return (<div className={HTML.classes('control flex', item.className)} key={item.name}>
            <div>{item.caption}</div>
            <Selectbox value={value} options={item.options} onChange={this.changeConfig.bind(this, item)} selectClassName="rounded" />
        </div>);
    }

    render() {
        const {
            filename,
            onFinish,
            className,
            ...other
        } = this.props;
        //我加的
       
        
        return (<div className={HTML.classes('app-user-change-pwd', className)} {...other}>
            {this.state.message && <div className="box danger rounded space-sm">{this.state.message}</div>}
            <div>文件名称:</div>
            <InputControl inputType="text" value={this.state.fileAndId[0].name} disabled={true}  /> 
             {/*  className={this.state.message && (StringHelper.isEmpty(this.state.reasons) ) ? 'has-error' : ''}  */}
           {/* <InputControl inputType="password" className={this.state.message && (StringHelper.isEmpty(this.state.password2) || this.state.password1 !== this.state.password2) ? 'has-error' : ''} disabled={this.state.doing} onChange={this.handleInputChange.bind(this, 'password2')} value={this.state.password2} label={Lang.string('user.changePassword.newPasswordRepeat')} /> */}
            {
                items.map(item => {return this.renderSelectItem(item);})
            }
    
            <div className="has-padding-v">
                <button disabled={this.state.doing} onClick={this.handleConfirmBtnClick} type="button" className="btn primary btn-wide">确认</button>
                 &nbsp;
                <button disabled={this.state.doing} onClick={this.handleCancelBtnClick} type="button" className="btn gray btn-wide">取消</button>
            </div>
        </div>);
    }
}

const show = (callback) => {
    let fileAndId = getFile();
    const modalId = 'miji';
    const onFinish = result => {
        Modal.hide(modalId);
        if (result) {
            Messager.show("添加成功", {type: 'success'});
            
        }
    return modalId;
    
    };
    return Modal.show({
        actions: false,
        id: modalId,
        className: 'app-user-add-awayreason-dialog',
        content: <SelectFileUploadSafeLevel onFinish={onFinish} />,
        title: "文件密级",
    }, callback);
    
};

export default 
{
    show,
   
};
