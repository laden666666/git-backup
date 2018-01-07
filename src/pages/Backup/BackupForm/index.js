import React from 'react';
import { Form, Input,Checkbox, Switch } from 'antd';
const {dialog} = require('electron').remote

const FormItem = Form.Item;

// 选择目录控件
class ChooseDirectory extends React.Component {
    constructor(props) {
        super(props);
    
    }
    handleClick = (e) => {
        e.preventDefault()
        var result = dialog.showOpenDialog({properties: [ 'openDirectory']})
        if(result){
            const onChange = this.props.onChange;
            if (onChange) {
                onChange(result[0]);
            }
        }
    }
    render() {
        return (
                <Input
                    readOnly={true}
                    value={this.props.value}
                    style={{cursor: 'pointer'}}
                    onClick={this.handleClick}
                />
        );
    }
}

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 9 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    },
};
class BackupForm extends React.Component {
    render() {
        var decorator = localStorage.getItem('decorator') || ''
        var useZip = localStorage.getItem('useZip') != 'false'
        var hasTimeStamp = localStorage.getItem('useZip') != 'false'
        
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="login-form">
                <FormItem
                    {...formItemLayout}
                    label="选择保存目录"
                >
                    {getFieldDecorator('decorator', {
                        initialValue: decorator,
                        rules: [{ required: true, message: '必须选择保存目录' }],
                    })(
                        <ChooseDirectory onChange={e=>{
                            localStorage.setItem('decorator', e)
                        }}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否启用zip压缩"
                >
                    {getFieldDecorator('useZip', {initialValue: useZip,})(
                        <Switch defaultChecked={useZip} onChange={e=>{
                            localStorage.setItem('useZip', e)
                        }}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否以时间戳命名"
                >
                    {getFieldDecorator('hasTimeStamp', {initialValue: hasTimeStamp,})(
                        <Switch defaultChecked={hasTimeStamp} onChange={e=>{
                            localStorage.setItem('hasTimeStamp', e)
                        }}/>
                    )}
                </FormItem>
            </Form>
        );
    }
}
  
export default Form.create()(BackupForm);
