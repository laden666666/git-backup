import React from 'react';
import { Modal, Button, Form, Input, AutoComplete } from 'antd';
import PropTypes from 'prop-types';
import Labels from '../RepertoryList/Labels/index';
import {GitRepertoryFactory} from '../../entity/GitRepertory';
import {addGitRepertory, editGitRepertory} from '../../service/gitRepertoryService'

const FormItem = Form.Item;

const EditGitRepertoryForm = Form.create({
    onFieldsChange(props, changedFields) {
        var gitRepertory = {}
        Object.keys(changedFields).forEach(key=>gitRepertory[key] = changedFields[key].value)
        props.onChange({gitRepertory, formInfo: changedFields});
    },
    mapPropsToFields(props) {
        const {gitRepertory, formInfo} = props
        return {
            id: Form.createFormField({
                ...formInfo.id,
                value: gitRepertory.id,
            }),
            name: Form.createFormField({
                ...formInfo.name,
                value: gitRepertory.name,
            }),
            repertoryURL: Form.createFormField({
                ...formInfo.repertoryURL,
                value: gitRepertory.repertoryURL,
            }),
            labels: Form.createFormField({
                ...formInfo.labels,
                value: [...gitRepertory.labels],
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
    return (
        <Form>
            <FormItem label="项目名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: '项目名必须填写' }],
                })(<Input />)}
            </FormItem>
            <FormItem label="仓库URL地址" {...formItemLayout}>
                {getFieldDecorator('repertoryURL', {
                    rules: [{ required: true, message: '仓库URL地址必须填写' },
                        { pattern: /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/, message: '仓库URL地址格式错误' }],
                })(<Input />)}
            </FormItem>
            <FormItem label="标签" {...formItemLayout}>
                {getFieldDecorator('labels', {
                })(<Labels ></Labels>)}
            </FormItem>
        </Form>
    );
});

export class EditGitRepertory extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            //受控控件，这里使用gitRepertory初始化真正的表单_gitRepertory。
            _gitRepertory: props.gitRepertory ? props.gitRepertory : GitRepertoryFactory.create(),
            //表单验证的相关信息的保存
            formInfo: {},
            //缓存是新建还是编辑
            isEdit: props.gitRepertory ? true : false
        }
    }

    handleFormChange = ({formInfo, gitRepertory}) => {
        this.setState({
            _gitRepertory: { ...this.state._gitRepertory, ...gitRepertory },
            formInfo: {...this.state.formInfo, ...formInfo},
        });
    }

    handleOk = () =>{
        this.refs.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(typeof this.props.onOk === 'function'){
                    if(this.state.isEdit){
                        editGitRepertory(this.state._gitRepertory)
                    } else {
                        addGitRepertory(this.state._gitRepertory)
                    }
                    this.props.onOk(this.state._gitRepertory)
                }
            }
        });
    }

    handleCancel = () =>{
        if(typeof this.props.onCancel === 'function'){
            this.props.onCancel()
        }
    }

    render() {
        const { visible } = this.props;
        const fields = this.state.fields;
        return (
            <Modal
                visible={visible}
                title="Title"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                        保存
                    </Button>,
                ]}
            >
                <EditGitRepertoryForm ref="form" gitRepertory={this.state._gitRepertory} formInfo={this.state.formInfo} onChange={this.handleFormChange} />
            </Modal>
        );
    }
}

EditGitRepertory.propTypes = {
    //是否显示模态框，编辑（新建）GitRepertory
    visible: PropTypes.bool.isRequired,
    //编辑的GitRepertory对象，如果为空则表示为新建
    gitRepertory: PropTypes.object,
};
