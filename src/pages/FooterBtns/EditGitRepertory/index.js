import { Modal, Button, Form, Input, AutoComplete } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import {GitRepertoryFactory} from '../../../entity/GitRepertory';

const FormItem = Form.Item;

const EditGitRepertoryForm = Form.create({
    onFieldsChange(props, changedFields) {
        var changedObject = {}
        Object.keys(changedFields).forEach(key=>changedObject[key] = changedFields[key].value)
        props.onChange(changedObject);
    },
    mapPropsToFields(props) {
        return {
            id: Form.createFormField({
                value: props.id,
            }),
            name: Form.createFormField({
                value: props.name,
            }),
            repertoryURL: Form.createFormField({
                value: props.repertoryURL,
            }),
            labels: Form.createFormField({
                value: props.labels,
            }),
        };
    },
    onValuesChange(_, values) {
        console.log(values);
    },
})((props) => {
    const { getFieldDecorator } = props.form;
    return (
        <Form layout="inline">
            <FormItem label="项目名称">
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Username is required!' }],
                })(<Input />)}
            </FormItem>
            <FormItem label="仓库URL地址">
                {getFieldDecorator('repertoryURL', {
                    rules: [{ required: true, message: '仓库URL地址必须填写' },
                        { pattern: /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/, message: '仓库URL地址格式错误' }],
                })(<Input />)}
            </FormItem>
        </Form>
    );
});

export class EditGitRepertory extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            _gitRepertory: props.gitRepertory
        }
    }

    handleFormChange = (changedFields) => {
        this.setState({
            _gitRepertory: { ...this.state._gitRepertory, ...changedFields },
        });
    }

    handleOk = () =>{
        this.refs.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(typeof this.props.onOk === 'function'){
                    this.props.onOk()
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
                <EditGitRepertoryForm ref="form" {...this.state._gitRepertory} onChange={this.handleFormChange} />
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

EditGitRepertory.defaultProps = {
    gitRepertory: GitRepertoryFactory.create()
};