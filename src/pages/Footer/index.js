'use babel';
import React from 'react';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

import LabelList from '../LabelList/'
import Search from '../Search'
import RepertoryList from '../RepertoryList'

export default class App extends React.Component{
    render(){
        return (<Layout>
            <Sider width={156}>
                <LabelList></LabelList>
            </Sider>
            <Layout>
                <Header>
                    <Search></Search>
                </Header>
                <Content>
                    <RepertoryList></RepertoryList>
                </Content>
                <Footer>Footer</Footer>
            </Layout>
        </Layout>);
    }
}