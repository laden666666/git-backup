'use babel';
import React from 'react';
import { Table, Button } from 'antd';
import Labels from './Labels';

const columns = [{
    title: '工程名',
    dataIndex: 'name',
    width: '16%',
    className: 'repertoryListColumns',
}, {
    title: '仓库地址',
    dataIndex: 'repertoryURL',
    width: '40%',
    className: 'repertoryListColumns',
}, {
    title: '标签',
    dataIndex: 'label',
    width: '24%',
    className: 'repertoryListColumns',
    render: () => (
        <Labels>
        </Labels>)
}, {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    width: '20%',
    className: 'repertoryListColumns',
    render: () => (
        <div className="repertoryListBtns">
            <Button size={'small'} icon={'edit'}>编辑</Button> &nbsp;
            <Button size={'small'} icon={'delete'} type="danger">删除</Button>
        </div>) },
];

const data = [];
for (let i = 0; i < 0; i++) {
    data.push({
        key: i,
        name: `资源 ${i}`,
        label: ['前端', 'PHP'],
        repertoryURL: `http://www.baidu.comhttp://www.baidu.comhttp://www.baidu.comhttp://www.baidu.comhttp://www.baidu.comhttp://www.baidu.com`,
    });
}

export default class RepertoryList extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    render() {
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div className="repertoryList">
                <Table footer={undefined} pagination={false} rowSelection={rowSelection} columns={columns}
                       dataSource={data} scroll={{y: 'calc(100vh - 180px)'}}
                       locale={{emptyText: <div>目前没有可备份的仓库，点击<span className="noDataRedText">新建</span>或者<span className="noDataRedText">导入</span>创建要备份的git仓库</div>}}/>
            </div>
        );
    }
}
