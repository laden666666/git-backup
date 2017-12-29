'use babel';
import React from 'react';
import { AutoComplete, Icon } from 'antd';

function onSelect(value) {
    console.log('onSelect', value);
}

export default class Search extends React.Component {
    state = {
        dataSource: [],
    }

    handleSearch = (value) => {
        this.setState({
            dataSource: !value ? [] : [
                value,
                value + value,
                value + value + value,
            ],
        });
    }
    render() {
        const { dataSource } = this.state;
        return (
            <div>
                <span className="search-text">
                    <Icon type="filter" />
                    检索
                </span>
                <AutoComplete
                    className="search-input"
                    dataSource={dataSource}
                    style={{ width: 200 }}
                    onSelect={onSelect}
                    onSearch={this.handleSearch}
                    placeholder="检索资源"
                />
            </div>
        );
    }
}
