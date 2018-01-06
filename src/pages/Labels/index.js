'use babel';
import React from 'react';
import PropTypes from 'prop-types';
import selector from './selector';
import { connect } from 'react-redux';
import { Tag, Input, Tooltip, Icon } from 'antd';
import { AutoComplete } from 'antd';

class Labels extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            inputVisible: false,
            inputValue: '',
            dataSource: [...props.labels.filter(label => !~props.value.indexOf(label))],
        };
    }

    //删除标签
    handleClose = (removedTag) => {
        const tags = this.props.value.filter(tag => tag !== removedTag);
        this.props.onChange(tags)
    }


    //显示输入框
    showInput = () => {
        this.setState({ inputVisible: true }, () => this.refs.autoComplete.focus());
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
            dataSource: [...this.props.labels.filter(label => label != inputValue).filter(label => !~this.props.value.indexOf(label))],
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
            dataSource: [...this.props.labels.filter(label => !~this.props.value.indexOf(label))],
        });
    }

    handleSearch = (value) => {
        this.setState({
            dataSource: this.props.labels.filter(label => ~label.indexOf(value)).filter(label => !~this.props.value.indexOf(label)),
        });
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
                        ref="autoComplete"
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

export default connect(selector)(Labels)