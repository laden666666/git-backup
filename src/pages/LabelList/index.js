'use babel';
import React from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Icon } from 'antd';
import selector from './selector';
import {changeSelectedLabelKey} from '../../service/gitRepertoryService';

class LabelList extends React.Component {
    handleClick = (e) => {
        changeSelectedLabelKey(e.key)
        console.log('click ', e);
    }
    render() {
        return (
            <Menu theme="dark" mode="inline" onClick={this.handleClick} selectedKeys={[this.props.selectedLabelKey]} style={{height: '100%', paddingTop: 10}}>
                {this.props.labels.map(label=>
                    (<Menu.Item key={label.key}>
                        <Icon type="tag" />
                        <span className="nav-text">{label.label}</span>
                    </Menu.Item>)
                )}
            </Menu>
        );
    }
}

export default connect(selector)(LabelList)