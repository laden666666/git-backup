'use babel';
import React from 'react';
import {connect} from 'react-redux';
import { Icon, Input } from 'antd';
import selector from './selector';
import {changeFilterText} from '../../service/gitRepertoryService';

const SearchInput = Input.Search;

class Search extends React.Component {

    handleSearch = (value)=>{
        changeFilterText(value)
    }

    render() {
        return (
            <div>
                <span className="search-text">
                    <Icon type="filter" />
                    检索
                </span>
                <SearchInput placeholder="请输入检索词" enterButton onSearch={this.handleSearch} style={{ width: 200 }} className="search-input"/>
            </div>
        );
    }
}

export default connect(selector)(Search)
