import React from 'react';

export const regionColumns = [
    {
        title: '文件路径',
        dataIndex: 'path',
        width: 350,
        checkboxDisabled: true,
    }, {
        title: '总文件数',
        dataIndex: 'totalFileNum',
        width: 100,
        checkboxDisabled: true,
    }, {
        title: '一级分区个数',
        dataIndex: 'partitionMsgs',
        width: 170,
        checkboxDisabled: true,
        render: (text, record) => (
            <span><a>{text[0].partitionValueNum}</a></span>
        )
    }, {
        title: '一级分区类型',
        dataIndex: 'partitionMsgs',
        width: 170,
        checkboxDisabled: true,
        render: (text, record) => (
            <span>{text[0].partitionType}</span>
        )
    }, {
        title: '二级分区个数',
        dataIndex: 'partitionMsgs',
        width: 170,
        checkboxDisabled: true,
        render: (text, record) => (
            <span><a>{text[1].partitionValueNum}</a></span>
        )
    }, {
        title: '二级分区类型',
        dataIndex: 'partitionMsgs',
        width: 170,
        checkboxDisabled: true,
        render: (text, record) => (
            <span>{text[1].partitionType}</span>
        )
    }, {
        title: '总文件大小',
        dataIndex: 'totalFileSize',
        width: 110,
        checkboxDisabled: true,
    }, {
        title: '平均一级分区大小',
        dataIndex: 'partitionMsgs',
        width: 150,
        checkboxDisabled: true,
        render: (text, record) => (
            <span>{(record.totalFileSize / record.partitionMsgs[0].partitionValueNum).toFixed(1)}</span>
        )
    }, {
        title: 'Block(块)个数',
        dataIndex: 'totalBlockNum',
        width: 130,
    }, {
        title: '数据库',
        dataIndex: 'databases',
        width: 100,
    }, {
        title: '数据库表',
        dataIndex: 'tables',
        width: 100,
    }, {
        title: '用户',
        dataIndex: 'user',
        width: 100,
    }, {
        title: '用户组',
        dataIndex: 'group',
    },
];

export const dailyColumns = [
    {
        title: '文件路径',
        dataIndex: 'path',
        width: 350,
        checkboxDisabled: true,
    }, {
        title: '总文件数',
        dataIndex: 'totalFileNum',
        width: 100,
        checkboxDisabled: true,
    }, {
        title: '一级分区个数',
        dataIndex: 'partitionMsgs',
        width: 170,
        checkboxDisabled: true,
        render: (text, record) => (
            <span><a>{text[0].partitionValueNum}</a></span>
        )
    }, {
        title: '一级分区类型',
        dataIndex: 'partitionMsgs',
        width: 170,
        checkboxDisabled: true,
        render: (text, record) => (
            <span>{text[0].partitionType}</span>
        )
    }, {
        title: '总文件大小',
        dataIndex: 'totalFileSize',
        width: 110,
        checkboxDisabled: true,
    }, {
        title: '平均一级分区大小',
        dataIndex: 'partitionMsgs',
        width: 150,
        checkboxDisabled: true,
        render: (text, record) => (
            <span>{(record.totalFileSize / record.partitionMsgs[0].partitionValueNum).toFixed(1)}</span>
        )
    }, {
        title: 'Block(块)个数',
        dataIndex: 'totalBlockNum',
        width: 130,
    }, {
        title: '数据库',
        dataIndex: 'databases',
        width: 100,
    }, {
        title: '数据库表',
        dataIndex: 'tables',
        width: 100,
    }, {
        title: '用户',
        dataIndex: 'user',
        width: 100,
    }, {
        title: '用户组',
        dataIndex: 'group',
    },
];

export const weeklyColumns = dailyColumns;

export const monthlyColumns = dailyColumns;

export const otherColumns = [
    {
        title: '文件路径',
        dataIndex: 'path',
        width: 350,
        checkboxDisabled: true,
    }, {
        title: '总文件数',
        dataIndex: 'totalFileNum',
        width: 100,
        checkboxDisabled: true,
    }, {
        title: '总文件大小',
        dataIndex: 'totalFileSize',
        width: 110,
        checkboxDisabled: true,
    }, {
        title: '平均一级分区大小',
        dataIndex: 'partitionMsgs',
        width: 150,
        checkboxDisabled: true,
        render: (text, record) => (
            <span>{(record.totalFileSize / record.partitionMsgs[0].partitionValueNum).toFixed(1)}</span>
        )
    }, {
        title: 'Block(块)个数',
        dataIndex: 'totalBlockNum',
        width: 130,
    }, {
        title: '数据库',
        dataIndex: 'databases',
        width: 100,
    }, {
        title: '数据库表',
        dataIndex: 'tables',
        width: 100,
    }, {
        title: '用户',
        dataIndex: 'user',
        width: 100,
    }, {
        title: '用户组',
        dataIndex: 'group',
    },
];

export const fragmentFileColumns = [
    {
        title: '文件路径',
        dataIndex: 'tablePath',
        width: 350,
        checkboxDisabled: true,
    }, {
        title: '小文件数量',
        dataIndex: 'totalFragment',
        width: 120,
        checkboxDisabled: true,
    }, {
        title: '小文件数TOP1的分区',
        dataIndex: 'partitionPath',
        width: 180,
    }, {
        title: '该分区小文件数',
        dataIndex: 'partitionFragment',
        width: 140,
    }, {
        title: '数据库',
        dataIndex: 'database',
        width: 100,
    }, {
        title: '数据库表',
        dataIndex: 'table',
        width: 100,
    }, {
        title: '用户',
        dataIndex: 'user',
        width: 100,
    }, {
        title: '用户组',
        dataIndex: 'group',
    },
];

const tableColumns = {
    regionColumns,
    dailyColumns,
    weeklyColumns,
    monthlyColumns,
    otherColumns,
    fragmentFileColumns
};

export default tableColumns;