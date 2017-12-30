'use babel';
import React from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';
import { AutoComplete } from 'antd';

const dataSource = ['前端', 'PHP', 'C++', '安卓'];

export default class Labels extends React.Component {
    state = {
        tags: [],
        inputVisible: false,
        inputValue: '',
        dataSource: [...dataSource],
    };

    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }

    handleSelect = (value) => {
        const state = this.state;
        const inputValue = value;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }

    handleSearch = (value) => {
        if (dataSource.indexOf(value) != -1){
            return
        } else {
            this.setState({
                dataSource: !value ? [] : [
                    value,
                    ...dataSource,
                ],
            });
        }
    }

    saveInputRef = input => this.input = input

    render() {
        const { tags, inputVisible, inputValue } = this.state;
        return (
            <div>
                {tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                    <AutoComplete
                        style={{ width: 78 }}
                        dataSource={this.state.dataSource}
                        onSelect={this.handleSelect}
                        onSearch={this.handleSearch}
                    >
                        <Input
                            ref={this.saveInputRef}
                            type="text"
                            size="small"
                            style={{ width: 78 }}
                            value={inputValue}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputConfirm}
                            onPressEnter={this.handleInputConfirm}
                        />
                    </AutoComplete>
                )}
                {!inputVisible && (
                    <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                        <Icon type="plus" /> 增添标签
                    </Tag>
                )}
            </div>
        );
    }
}