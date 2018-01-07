'use babel';
import React from 'react';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

import LabelList from '../LabelList/'
import Search from '../Search'
import RepertoryList from '../RepertoryList'
import FooterBtns from '../FooterBtns'
import EditGitRepertory from '../EditGitRepertory'
import Backup from '../Backup'
import ImportGitRepertory from '../ImportGitRepertory'

import { selectGitRepertory } from '../../service/gitRepertoryService';

export default class App extends React.Component{
    constructor(props){
        super(props)
        selectGitRepertory()
    }

    render(){
        return (<Layout>
            <Sider width={156}>
                {/* 标签列表 */}
                <LabelList></LabelList>
            </Sider>
            <Layout>
                <Header>
                    <Search></Search>
                </Header>
                <Content>
                    <RepertoryList></RepertoryList>
                </Content>
                <Footer>
                    <FooterBtns></FooterBtns>
                    {/* 编辑对话框 */}
                    <EditGitRepertory></EditGitRepertory>
                    {/* 导入对话框 */}
                    <ImportGitRepertory></ImportGitRepertory>
                    {/* 备份对话框 */}
                    <Backup></Backup>
                </Footer>
            </Layout>
        </Layout>);
    }
}