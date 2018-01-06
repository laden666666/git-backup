import React from 'react';
import { Modal, Button, Form, Input, AutoComplete } from 'antd';
import PropTypes from 'prop-types';
import Labels from '../Labels/index';
import {GitRepertoryFactory} from '../../entity/GitRepertory';
import {addGitRepertory} from '../../service/gitRepertoryService'

const FormItem = Form.Item;

class ImportGitRepertory extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            willImportRepertoryURL: [],
        }
    }


    render() {
        return (
            <Modal
                visible={true}
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
                <Input />
            </Modal>
        );
    }
}

ImportGitRepertory.propTypes = {
    //是否显示模态框，编辑（新建）GitRepertory
    visible: PropTypes.bool.isRequired,
    //编辑的GitRepertory对象，如果为空则表示为新建
    editRepertory: PropTypes.object,
};

export default ImportGitRepertory
