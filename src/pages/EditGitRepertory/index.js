import React from 'react';
import { Modal, Button, Form, Input, AutoComplete, message, Spin } from 'antd';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Labels from '../Labels/index';
import {GitRepertoryFactory} from '../../entity/GitRepertory';
import {addGitRepertory, editGitRepertory, closeEditGitRepertory, checkGitRepertoryName} from '../../service/gitRepertoryService'
import backupGitService from '../../service/backupGitService'

import selector from './selector';

const FormItem = Form.Item;

const EditGitRepertoryForm = Form.create({
    onFieldsChange(props, changedFields) {
        var gitRepertory = {}
        Object.keys(changedFields).forEach(key=>gitRepertory[key] = changedFields[key].value)
        props.onChange({gitRepertory, formInfo: changedFields});
    },
    mapPropsToFields(props) {
        const {editRepertory, formInfo} = props
        return {
            id: Form.createFormField({
                ...formInfo.id,
                value: editRepertory.id,
            }),
            name: Form.createFormField({
                ...formInfo.name,
                value: editRepertory.name,
            }),
            repertoryURL: Form.createFormField({
                ...formInfo.repertoryURL,
                value: editRepertory.repertoryURL,
            }),
            labels: Form.createFormField({
                ...formInfo.labels,
                value: [...editRepertory.labels || []],
            }),
        };
    },
    onValuesChange(_, values) {
        console.log(values);
    },
})((props) => {
    const { getFieldDecorator, setFieldsValue } = props.form;

    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
    };
    const {id} = props.editRepertory
    return (
        <Form>
            <FormItem label="项目名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                    validateFirst: true,
                    rules: [{ required: true, message: '项目名必须填写' },
                        {validator(rule, value, callback) {
                            checkGitRepertoryName(id, value).then(result=>{
                                if(result){
                                    callback()
                                } else {
                                    callback(new Error('该工程名已存在'))
                                }
                            }, err=>{
                                callback(err)
                            })
                        }},],
                })(<Input />)}
            </FormItem>
            <FormItem label="仓库URL地址" {...formItemLayout}>
                {getFieldDecorator('repertoryURL', {
                    validateFirst: true,
                    rules: [{ required: true, message: '仓库URL地址必须填写' },
                        {validator(rule, value, callback) {
                            if(backupGitService.checkGitURL(value)){
                                callback()
                            } else {
                                callback(new Error('仓库URL地址格式错误'))
                            }

                        }},],
                })(props.isEdit ? <span>{props.editRepertory.repertoryURL}</span> : <Input /> )}
            </FormItem>
            <FormItem label="标签" {...formItemLayout}>
                {getFieldDecorator('labels', {
                })(<Labels ></Labels>)}
            </FormItem>
        </Form>
    );
});

class EditGitRepertory extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            //受控控件，这里使用gitRepertory初始化真正的表单_gitRepertory。
            _gitRepertory: props.editRepertory ? props.editRepertory : GitRepertoryFactory.create(),
            //表单验证的相关信息的保存
            formInfo: {},
            //缓存是新建还是编辑
            isEdit: props.editRepertory ? true : false,
            //表单提交中
            loading: false
        }
    }

    async componentWillReceiveProps(nextProps, nextContext){
        if(null === nextProps.editRepertory || nextProps.editRepertory != this.props.editRepertory){
            await this.setState({
                //受控控件，这里使用gitRepertory初始化真正的表单_gitRepertory。
                _gitRepertory: nextProps.editRepertory ? nextProps.editRepertory : GitRepertoryFactory.create(),
                //表单验证的相关信息的保存
                formInfo: {},
                //缓存是新建还是编辑
                isEdit: nextProps.editRepertory ? true : false
            })
        }
    }

    handleFormChange = ({formInfo, gitRepertory}) => {
        this.setState({
            _gitRepertory: { ...this.state._gitRepertory, ...gitRepertory },
            formInfo: {...this.state.formInfo, ...formInfo},
        });
    }

    handleOk = () =>{
        this.refs.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                try{
                    this.setState({
                        loading: true
                    })

                    if(this.state.isEdit){
                        await editGitRepertory(this.state._gitRepertory)
                    } else {
                        //如果是新建校验是否是有效git资源
                        if(await backupGitService.checkURLIsRepo(this.state._gitRepertory.repertoryURL)){
                            await addGitRepertory(this.state._gitRepertory)
                        } else {
                            message.error('该仓库URL地址是无效的');
                        }
                    }
                    if(typeof this.props.onOk === 'function'){
                        this.props.onOk(this.state._gitRepertory)
                    }
                    closeEditGitRepertory()
                } catch (e){
                    console.log(e)
                }
                this.setState({
                    loading: false
                })
            }
        });
    }

    handleCancel = () =>{
        if(typeof this.props.onCancel === 'function'){
            this.props.onCancel()
        }
        closeEditGitRepertory()
    }

    render() {
        const { visible } = this.props;
        const fields = this.state.fields;
        return (
            <Modal
                destroyOnClose
                visible={visible}
                title="Title"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>取消</Button>,
                    <Button key="submit" loading={this.state.loading} type="primary" onClick={this.handleOk}>
                        保存
                    </Button>,
                ]}
            >
                <Spin tip="正在校验仓库URL地址的有效性..." spinning={this.state.loading} delay={500} >
                    <EditGitRepertoryForm ref="form" isEdit={this.state.isEdit} editRepertory={this.state._gitRepertory} formInfo={this.state.formInfo} onChange={this.handleFormChange} />
                </Spin>
            </Modal>
        );
    }
}

EditGitRepertory.propTypes = {
    //是否显示模态框，编辑（新建）GitRepertory
    visible: PropTypes.bool.isRequired,
    //编辑的GitRepertory对象，如果为空则表示为新建
    editRepertory: PropTypes.object,
};

export default connect(selector)(EditGitRepertory)
