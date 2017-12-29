'use babel';
import React from 'react';
import { Layout, Menu, Icon } from 'antd';

export default class LabelList extends React.Component {
    handleClick = (e) => {
        console.log('click ', e);
    }
    render() {
        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{height: '100%', paddingTop: 10}}>
                <Menu.Item key="1">
                    <Icon type="tag" />
                    <span className="nav-text">全部标签</span>
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="tag" />
                    <span className="nav-text">前端</span>
                </Menu.Item>
                <Menu.Item key="3">
                    <Icon type="tag" />
                    <span className="nav-text">PHP</span>
                </Menu.Item>
                <Menu.Item key="4">
                    <Icon type="tag" />
                    <span className="nav-text">吉莱特</span>
                </Menu.Item>
            </Menu>
        );
    }
}
