'use babel';
import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Input, Tooltip, Icon } from 'antd';
import { AutoComplete } from 'antd';

const dataSource = ['前端', 'PHP', 'C++', '安卓'];

export default class Labels extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            inputVisible: false,
            inputValue: '',
            dataSource: [...dataSource],
        };
    }

    //删除标签
    handleClose = (removedTag) => {
        const tags = this.props.value.filter(tag => tag !== removedTag);
        this.props.onChange(tags)
    }


    //显示输入框
    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }
    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    //选择成功
    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = [...this.props.value];
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
            this.props.onChange(tags)
        }
        this.setState({
            inputVisible: false,
            inputValue: '',
        });
    }

    handleSelect = (value) => {
        const state = this.state;
        const inputValue = value;
        let tags = [...this.props.value];
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
            this.props.onChange(tags)
        }
        this.setState({
            inputVisible: false,
            inputValue: '',
        });
    }

    handleSearch = (value) => {
    }

    saveInputRef = input => this.input = input

    render() {
        const { inputVisible, inputValue } = this.state;
        const tags = [...this.props.value]
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
                            onInput={this.handleInputChange}
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

Labels.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
}

Labels.defaultProps = {
    onChange: ()=>{},
};