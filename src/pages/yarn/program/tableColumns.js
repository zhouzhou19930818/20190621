import moment from "moment";
import React from 'react';

// 内存应用详情
export const memoryTopNColumns = (onNameClick) => [
    {
        title: '程序名称',
        dataIndex: 'programName',
        width: 180,
        render: (text) => (<button className="sd-anchor-button" onClick={ () => onNameClick(text) }>{ text }</button>),
    },
    {
        title: '最终状态',
        dataIndex: 'state',
        width: 120,
    },
    {
        title: '区间内最大内存',
        dataIndex: 'allocatedMaxMemory',
        sorter: (a, b) => a.allocatedMaxMemory.localeCompare(b.allocatedMaxMemory),
        width: 180,
    },
    {
        title: '区间内最大CPU',
        dataIndex: 'allocatedMaxVcore',
        sorter: (a, b) => a.allocatedMaxVcore - b.allocatedMaxVcore,
        width: 150,
    },
    {
        title: '总运行时长',
        dataIndex: 'runningTimeStr',
        sorter: (a, b) => a.runningTimeStr - b.runningTimeStr,
        width: 150,
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        width: 180,
    },
    {
        title: '程序类型',
        dataIndex: 'type',
        width: 120,
    },
    {
        title: '队列',
        dataIndex: 'pool',
        width: 150,
    },
    {
        title: '租户',
        dataIndex: 'user',
        width: 120,
    },
    {
        title: '应用',
        dataIndex: 'applicationName',
        width: 150,
        render: (text) => !text || text === 'null' ? '无' : text,
    },
    {
        title: '程序ID',
        dataIndex: 'programId',
        width: 150,

    },
];

// cpu应用详情
export const cpuTopNColumns = (onNameClick) => [
    {
        title: '程序名称',
        dataIndex: 'programName',
        width: 180,
        render: (text) => (<button className="sd-anchor-button" onClick={ () => onNameClick(text) }>{ text }</button>),
    },
    {
        title: '最终状态',
        dataIndex: 'state',
        width: 180,
    },
    {
        title: '区间内最大CPU(个数)',
        dataIndex: 'allocatedMaxVcore',
        sorter: (a, b) => a.allocatedMaxVcore - b.allocatedMaxVcore,
        width: 200,
    },
    {
        title: '区间内最大内存',
        dataIndex: 'allocatedMaxMemory',
        sorter: (a, b) => (a.allocatedMaxMemory).localeCompare(b.allocatedMaxMemory),
        width: 180,
    },
    {
        title: '总运行时长',
        dataIndex: 'runningTimeStr',
        sorter: (a, b) => a.runningTimeStr - b.runningTimeStr,
        width: 180,
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a, b) => (a.startTime).localeCompare(b.startTime),
        width: 180,
    },
    {
        title: '程序类型',
        dataIndex: 'type',
        width: 180,
    },
    {
        title: '队列',
        dataIndex: 'pool',
        width: 180,
    },
    {
        title: '租户',
        dataIndex: 'user',
        width: 180,
    },
    {
        title: '应用',
        dataIndex: 'applicationName',
        width: 180,
        render: (text) => !text || text === 'null' ? '无' : text,
    },
    {
        title: '程序ID',
        dataIndex: 'programId',
        width: 180,
    },
];

// 程序历史详情
export const historyColumns = [
    {
        title: '程序名称',
        dataIndex: 'programName',
        width: 250,
    },
    {
        title: '最终状态',
        dataIndex: 'state',
        width: 120,
    },
    {
        title: '已分配内存',
        dataIndex: 'allocatedMemorySeconds',
        sorter: (a, b) => (a.allocatedMemorySeconds).localeCompare(b.allocatedMemorySeconds),
        width: 130,
    },
    {
        title: '已分配CPU',
        dataIndex: 'allocatedVcoreSeconds',
        sorter: (a, b) => a.allocatedVcoreSeconds - b.allocatedVcoreSeconds,
        width: 130,
        render: (text) => text + '个*s',
    },
    {
        title: '总运行时长',
        dataIndex: 'runningTime',
        sorter: (a, b) => a.runningTime - b.runningTime,
        width: 130,
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        width: 200,
    },
    {
        title: '程序类型',
        dataIndex: 'type',
        width: 120,
    },
    {
        title: '所在队列',
        dataIndex: 'pool',
        width: 150,
    },
    {
        title: '租户',
        dataIndex: 'user',
        width: 120,
    },
    {
        title: '所属应用',
        dataIndex: 'applicationName',
        width: 120,
        render: (text) => !text || text === 'null' ? '无' : text,
    },
    {
        title: '程序ID',
        dataIndex: 'programId',
        width: 180,
    },
];

// 程序运行时长
export const overRunningTimeColumns = [
    {
        title: '所属应用',
        dataIndex: 'applicationName',
        width: 120,
        render: (text) => !text || text === 'null' ? '无' : text,
    },
    {
        title: '程序名称',
        dataIndex: 'programName',
        width: 200,
    },
    {
        title: '程序类型',
        dataIndex: 'type',
        width: 120,
    },
    {
        title: '最终状态',
        dataIndex: 'state',
        width: 120,
    },
    {
        title: '总运行时长',
        dataIndex: 'runningTime',
        sorter: (a, b) => a.runningTime - b.runningTime,
        width: 180,
    },
    {
        title: '已分配内存',
        dataIndex: 'allocatedMemorySeconds',
        sorter: (a, b) => (a.allocatedMemorySeconds).localeCompare(b.allocatedMemorySeconds),
        width: 130,
    },
    {
        title: '已分配CPU',
        dataIndex: 'allocatedVcoreSeconds',
        sorter: (a, b) => a.allocatedVcoreSeconds - b.allocatedVcoreSeconds,
        width: 130,
        render: (text) => text + '个*s',
    },
    {
        title: '所在队列',
        dataIndex: 'pool',
        width: 180,
    },
    {
        title: '租户',
        dataIndex: 'user',
        width: 120,
    },
    {
        title: '程序ID',
        dataIndex: 'programId',
        width: 250,
    },
];