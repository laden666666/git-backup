import React from 'react';
import { Modal, Button, Form, Input, List, message, Icon } from 'antd';
import PropTypes from 'prop-types';
import selector from './selector'
import {connect} from 'react-redux'
import {GitRepertoryFactory} from '../../entity/GitRepertory';
import {addGitRepertorys, getAllGitRepertoryName, closeImportGitRepertory} from '../../service/gitRepertoryService'
import backupGitService from '../../service/backupGitService'

const FormItem = Form.Item;
const TextArea = Input.TextArea

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};

class ImportGitRepertory extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            //文本框中输入的需要导入的仓库url字符串
            willImportURLStr: '',
            //对该url字符串校验的结果
            isValid: true,
            //导入分3步骤：1.用户输入url字符串。2.根据url字符串生成Repertory数组，并对其校验。3.用户给各个校验成功的Repertory命名工程名
            step: 1,
            //由该字符串解析后的仓库数组
            willImportRepertoryList: [],
            //解析后的仓库数组有效性的校验结果
            repertoryCheckResultMap: {},
            //正在校验的资源Id
            vlidatingRepertoryID: 0,
        }

        this._windowId = false

        getAllGitRepertoryName().then(names => {
            this._allGitRepertoryName = names
        })
    }

    componentWillReceiveProps(nextProps, nextContext){
        if(true === nextProps.importVisible && false === this.props.importVisible){
            this.setState({
                //文本框中输入的需要导入的仓库url字符串
                willImportURLStr: '',
                //对该url字符串校验的结果
                isValid: true,
                //导入分3步骤：1.用户输入url字符串。2.根据url字符串生成Repertory数组，并对其校验。3.用户给各个校验成功的Repertory命名工程名
                step: 1,
                //由该字符串解析后的仓库数组
                willImportRepertoryList: [],
                //解析后的仓库数组有效性的校验结果
                repertoryCheckResultMap: {},
                //正在校验的资源Id
                vlidatingRepertoryID: 0,
            })

            //窗口的id，当窗口关闭时候，无法取消后台的异步处理，给窗口加一个id，用于每一个异步过程结束后判断是否继续任务
            this._windowId = Date.now()

            getAllGitRepertoryName().then(names => {
                this._allGitRepertoryName = names
            })
        }
    }

    handleInputChange = (e)=>{
        var willImportURLStr = e.target.value

        this.setState({
            willImportURLStr,
            isValid: this.validateRepertoryURLStr(willImportURLStr)
        })
    }

    /**
     * 对url字符串校验
     * @param willImportURLStr
     * @returns {*}
     */
    validateRepertoryURLStr = (willImportURLStr)=>{
        if(!willImportURLStr){
            willImportURLStr = ''
        }
        var arr = willImportURLStr.split('\n')
        return arr.reduce((result, url)=>{
            return result && backupGitService.checkGitURL(url)
        },true,)
    }

    next = async ()=>{
        var {willImportURLStr, isValid} = this.state
        if(!willImportURLStr && isValid){
            message.error('该仓库URL地址是无效的');
            return
        }

        var newNames = []
        var self = this
        function getUseableName(name, index=0) {
            var _name = name + (index == 0 ? '' : index)
            if(~self._allGitRepertoryName.indexOf(_name)){
                return getUseableName(name, index + 1)
            }
            if(~newNames.indexOf(_name)){
                return getUseableName(name, index + 1)
            }

            return _name
        }

        var willImportRepertoryList = willImportURLStr.split('\n').map(url=>{
            var repertory = GitRepertoryFactory.create()
            var repeName = backupGitService.getReopName(url)
            repertory.name = getUseableName(repeName)
            newNames.push(repertory.name)
            repertory.repertoryURL = url
            return repertory
        })

        await this.setState({
            willImportRepertoryList,
            step: 2,
        })
        this.validateRepertoryURL(this._windowId)
    }

    /**
     * 校验url是否可用
     * @returns {Promise.<void>}
     */
    validateRepertoryURL = async (windowId)=>{
        if(this._windowId != windowId){
            return
        }

        const {step, willImportRepertoryList,  repertoryCheckResultMap, vlidatingRepertoryID} = this.state
        var index = willImportRepertoryList.findIndex(repertory=>repertory.id == vlidatingRepertoryID) + 1

        if(this._windowId != windowId){
            return
        }

        if(index >= willImportRepertoryList.length){
            this.setState({
                vlidatingRepertoryID: 0,
                step: 3,
            })
        } else {
            var gitRepertory = willImportRepertoryList[index]
            this.setState({
                vlidatingRepertoryID: gitRepertory.id,
            })
            var result = await backupGitService.checkURLIsRepo(gitRepertory.repertoryURL)
            this.setState({
                repertoryCheckResultMap :  {...repertoryCheckResultMap, [gitRepertory.id]: result}
            })
            this.validateRepertoryURL(windowId)
        }
    }

    handleOk = async ()=>{
        await addGitRepertorys(this.state.willImportRepertoryList)
        this._windowId = 0
        closeImportGitRepertory()
    }
    handleCancel = ()=>{
        this._windowId = 0
        closeImportGitRepertory()
    }

    renderForm = () => {
        const {step, willImportRepertoryList,  repertoryCheckResultMap, vlidatingRepertoryID} = this.state
        switch (step){
            case (1):
                return (<Form>
                        <FormItem
                            {...{labelCol: {
                                xs: { span: 24 },
                                sm: { span: 4 },
                            },
                                wrapperCol: {
                                    xs: { span: 24 },
                                    sm: { span: 18 },
                            },}}
                            label="仓库URL"
                            validateStatus={this.state.isValid ? "" : "error"}
                            help={this.state.isValid ? "" : "格式错误"}
                        >
                            <TextArea value={this.state.willImportURLStr} placeholder="请输入要导入的git仓库URL，多个URL用换行区分"
                                      autosize={{ minRows: 2, maxRows: 100 }} onInput={this.handleInputChange}/>
                        </FormItem>
                    </Form>)
            case (2):
                return (<List
                        bordered
                        dataSource={willImportRepertoryList}
                        renderItem={item => {
                            var icon
                            if( item.id == vlidatingRepertoryID){
                                icon = <Icon type="loading" />
                            } else if( repertoryCheckResultMap[item.id] === undefined){
                                icon = <Icon type="sync" />
                            } else if( repertoryCheckResultMap[item.id] === true){
                                icon = <Icon type="check" />
                            } else if( repertoryCheckResultMap[item.id] === false){
                                icon = <Icon type="close" />
                            }
                            return (<List.Item>
                                    {icon}
                                    &nbsp;
                                    {item.repertoryURL}
                                </List.Item>)
                        }}
                    >
                    </List>)
            case (3):
                return (<Form layout="vertical">
                    {willImportRepertoryList.map(repertory=>{
                        return (<FormItem
                            {...{labelCol: {
                                xs: { span: 24 },
                            },
                                wrapperCol: {
                                xs: { span: 24 },
                            },}}
                            key={repertory.id}
                            label={repertory.name}
                            validateStatus={this.state.isValid ? "" : "error"}
                            help={this.state.isValid ? "" : "格式错误"}
                        >
                            <span>{repertory.repertoryURL}</span>
                        </FormItem>)
                    })}
                </Form>)
        }
    }

    render() {
        const {step, willImportRepertoryList,  repertoryCheckResultMap, vlidatingRepertoryID} = this.state

        //按钮渲染
        var btns = [], title = ''
        switch (step){
            case (1):
                title = '输入仓库URL'
                btns = [
                    <Button key="back" onClick={this.handleCancel}>取消</Button>,
                    <Button key="next" type="primary" onClick={this.next}>
                        下一步
                    </Button>
                ]
                break
            case (2):
                title = '正在校验git仓库URL'
                btns = [
                    <Button key="back" onClick={this.handleCancel}>取消</Button>,
                ]
                break
            case (3):
                title = '确定git仓库工程名'
                btns = [
                    <Button key="back" onClick={this.handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                        导入
                    </Button>
                ]
                break
        }

        return (
            <Modal
                maskClosable={false}
                destroyOnClose
                visible={this.props.importVisible}
                title={title}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={btns}
            >
                {this.renderForm()}
            </Modal>
        );
    }
}

ImportGitRepertory.propTypes = {
    //编辑的GitRepertory对象，如果为空则表示为新建
    editRepertory: PropTypes.object,
};

export default connect(selector)(ImportGitRepertory)
