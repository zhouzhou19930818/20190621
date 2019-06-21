/** 装机管理-设置IP
 *  @author luodt on 2019.06.14
 */
import React, { Component, Fragment } from 'react';
import { Input, Popover, Checkbox } from 'antd';
import styled from 'styled-components';
import update from 'immutability-helper';

import { debounce } from 'src/tools/utils';
import api from "src/tools/api";

import SDTable from "src/components/SDTable";
import SDModal from "src/components/SDModal";
import IpInput from "src/components/IpInput";

import NETCARDIMG from 'src/assets/images/port.png';

// 主机绑定状态
const STATUS = [
    {
        text: '未绑定',
        bgColor: '#CDD1DA',
        color: '#fff',
    },
    {
        text: '绑定成功',
        bgColor: '#EAF8E5',
        color: '#008364',
    },
    {
        text: '绑定失败',
        bgColor: '#FFF6C9',
        color: '#614836',
    },
    {
        text: '绑定中',
        bgColor: '#D2F1FF',
        color: '#213555',
    }
];
const StatusBtn = styled.span`
        background: ${(props) => props.bgColor || '#CDD1DA'};
        color: ${(props) => props.color || '#fff'};
        padding: 4px 16px;
        border-radius: 2px;
        white-space: nowrap;
    `;

// 主机操作按钮
const OperationBtn = styled.span`
        display: inline-block;
        color: ${(props) => props.disabled ? '#CDD1DA' : '#0B72D9'};
        margin-right: 16px;
        cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};

        &:last-of-type {
            margin: 0;
        }
    `;

// 表格2次样式
const IPTable = styled(SDTable)`
        margin-top: 12px;
        .ant-table {
            border-bottom: 1px solid #E8EAED;
        }
    `;

// IP输入项组件
const IPSetItemContainer = styled.div`
        margin-bottom: 8px;

        &:last-of-type {
            margin-bottom: 0;
        }

        &>div {
            display: inline-block;
            vertical-align: top;
        }

        &>span:first-of-type {
            color: #585E69;
            margin-right: 32px;
        }

        .net-card-item {
            &::before {
                content: url(${NETCARDIMG});
                margin: 0 6px 0 18px;
                vertical-align: sub;
            }

            color: #686F7A;
            vertical-align: middle;     
        }
    `;

// 新增按钮
const AddBtn = styled.span`
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 18px;
        text-align: center;
        background: #D3E5F6;
        color: #0B72D9;
        font-weight: 600;
        margin-left: 8px;
        cursor: pointer;
    `;

class TaskSetIp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 表格数据加载
            tableLoading: false,

            // 表格数据
            tableData: [],

            // 详情弹框显示状态
            isDeatilModalShow: false,
        };

        // 为了展开所有行生效而定义的储存所有行key的数组
        this.expandedRowKeys = [];

        // 表头
        this.columns = [
            {
                title: '主机',
                dataIndex: 'host',
                width: 140,
            }, {
                title: '机房',
                dataIndex: 'engineRoom',
                width: 140,
            }, {
                title: '设置IP',
                dataIndex: 'ip',
                width: 100,
                render: (text) => <span>{text.length}</span>,
            }, {
                title: '掩码',
                dataIndex: 'mask',
                width: 184,
                render: (text, row, index) => <IpInput index={`mask_${index}`} onChangeIp={(ip) => console.log(ip)} />,
            }, {
                title: '网关',
                dataIndex: 'gateWay',
                width: 184,
                render: (text, row, index) => <IpInput index={`gateWay_${index}`} onChangeIp={(ip) => console.log(ip)} />,
            }, {
                title: 'DNS',
                dataIndex: 'dns',
                width: 184,
                render: (text, row, index) => <IpInput index={`dms_${index}`} onChangeIp={(ip) => console.log(ip)} />,
            }, {
                title: '状态',
                dataIndex: 'status',
                width: 124,
                render: (data) => {
                    const { text = '未绑定', ...otherConfig } = STATUS[data];
                    return <StatusBtn {...otherConfig}>{text}</StatusBtn>
                },
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: 160,
                render: (text, row) => <Fragment>
                    <OperationBtn
                        disabled={[0, 3].includes(row.status)}
                        onClick={() => this.toggleDetailModal(row)}
                    >
                        详情
                    </OperationBtn>
                    <OperationBtn
                        disabled={[0, 1, 3].includes(row.status)}
                        onClick={() => this.handleRetry(row)}
                    >
                        重试
                    </OperationBtn>
                    <OperationBtn
                        disabled={[0, 1, 3].includes(row.status)}
                        onClick={() => this.handleDeleteRow(row)}
                    >
                        剔除
                    </OperationBtn>
                </Fragment>
            },
        ];

    }

    componentDidMount() {
        this.getTableData();
    }

    // 获取表格数据
    getTableData = () => {
        this.setState({
            tableLoading: true
        }, () => {
            // api.getTableData().then(res => {
            const json = [
                {
                    host: '主机001',
                    engineRoom: '萝岗机房',
                    status: 0,
                    netCardList: ['1', '2', '3', '4'],
                },
                {
                    host: '主机002',
                    engineRoom: '萝岗机房',
                    status: 1,
                    netCardList: ['5', '6', '7'],
                },
                {
                    host: '主机003',
                    engineRoom: '萝岗机房',
                    status: 2,
                    netCardList: ['8', '9', '10', '11', '12'],
                },
                {
                    host: '主机004',
                    engineRoom: '萝岗机房',
                    status: 3,
                    netCardList: ['13', '14'],
                }
            ];
            const data = json.map(item => {
                this.expandedRowKeys.push(item.host);
                const ipArr = [], netCardArr = [];
                for (let i = 0; i < item.netCardList.length; i++) {
                    if (!(i % 2)) {
                        ipArr.push({
                            ipUrl: '',
                            index: ipArr.length
                        });
                    }
                    netCardArr.push({
                        value: item.netCardList[i],
                        ipIndex: Math.floor(i / 2)
                    });
                }
                return {
                    ...item,
                    netCardList: netCardArr,
                    ip: ipArr
                }
            });
            this.setState({
                tableLoading: false,
                tableData: data
            })
            // })
        })
    }

    /** 渲染IP、网卡分配输入框
     * @param {object} row:表格行的数据集合
     */
    renderIpSettingArea = (row, index) => {
        return row.ip.map((item, key) => <IpSetItem
            key={item.index}
            rowIndex={index}
            ipListIndex={key}
            item={item}
            ipList={row.ip}
            netCardList={row.netCardList}
            handleDealIpItem={this.handleDealIpItem}
            handleChange={this.handleChangeIP}
            handleChangeNetcard={this.handleChangeNetcard}
        />)
    }

    /** ip设置项的新增与删除
     * @description 新增时只对ip做新增处理，删除时要把该ip绑定的网卡状态归置为-1
     * @param {string} type: 新增(add)/删除(del)
     * @param {number} parentId: 表格行的索引值
     * @param {number} key: ip的key值
     */
    handleDealIpItem = (type, parentId, key) => {
        // 该行的IP集合
        const ipList = this.state.tableData[parentId].ip;
        let opts = {};
        if (type === 'add') {
            opts = {
                ip: {
                    $push: [{
                        ipUrl: '',
                        index: ipList[ipList.length - 1].index + 1, // 新的key值=最后一个ip的index+1
                    }]
                }
            };
        } else {
            opts = {
                netCardList: {
                    $apply: x => x.map(k => {
                        if (k.ipIndex === ipList[key].index) {
                            k.ipIndex = -1;
                        }
                        return k;
                    })
                },
                ip: { $splice: [[key, 1]] },
            }
        }
        this.setState(update(this.state, {
            tableData: {
                [parentId]: opts
            }
        }));
    }

    /** ip输入项值得储存
     * @param {string} type: 改变项
     * @param {string} val: 改变后的值
     * @param {number} parentId : 表格行的索引
     * @param {number} key: 索引 
     */
    handleChangeIP = (type, val, parentId, key) => {
        this.setState(update(this.state, {
            tableData: {
                [parentId]: {
                    ip: {
                        [key]: {
                            [type]: { $set: val }
                        }
                    }
                }
            }
        }))
    }

    /** 网卡选择的改变事件
     *  @description
     *  @param {number} ipIndex: 点击该网卡的ipIndex
     *  @param {boolean} checkValue: 选中（true）/不选(false)
     *  @param {number} parentId: 表格行索引
     *  @param {number} key: 网卡在列表中的索引
     */
    handleChangeNetcard = (ipIndex, checkValue, parentId, key) => {
        this.setState(update(this.state, {
            tableData: {
                [parentId]: {
                    netCardList: {
                        [key]: {
                            ipIndex: checkValue ? { $set: ipIndex } : { $set: -1 }
                        }
                    }
                }
            }
        }))
    }

    /** 根据主机名称、机房名称模糊查询数据
     * @param {string} val: 输入的值
     */
    handleSearch = (val) => {
        this.setState({ tableLoading: true });
        const fn = (value) => () => {
            // api.getModelByNameOrDesc(value).then((res) => {
            this.setState({
                // dataSource: res.data.data && res.data.data.map((d, i) => ({ ...d, index: i + 1 })),
                tableLoading: false,
            })
            // })
        };
        debounce(fn(val));
    }

    /** 详情弹框的显示方法
     * @param {object} data: 表格行的数据
     */
    toggleDetailModal = (data) => {
        if ([0, 3].includes(data.status)) return;
        const visible = !this.state.isDeatilModalShow;
        // if(visible) {

        // }
        this.setState({
            isDeatilModalShow: visible
        })
    }

    /** 重试绑定
     *  @param {object} data 表格行的数据
     */
    handleRetry = (data) => {

    }

    /** 剔除
     *  @param {object} data 表格行的数据
     */
    handleDeleteRow = (data) => {

    }

    render() {
        const { tableLoading, tableData, isDeatilModalShow } = this.state;

        return (
            <Fragment>
                <IPTable
                    className="task-table-wrapper"
                    rowKey="host"
                    loading={tableLoading}
                    columns={this.columns}
                    dataSource={tableData}
                    scroll={{ y: 300, x: true }}
                    pagination={false}
                    // 设置展开图标列隐藏
                    expandIconAsCell={false}
                    expandIconColumnIndex={-1}
                    expandedRowKeys={this.expandedRowKeys}
                    expandedRowRender={(record, index) => this.renderIpSettingArea(record, index)}
                />
                <span className="execute-btn">执行</span>
                <SDModal
                    title="绑定详情"
                    visible={isDeatilModalShow}
                    onCancel={this.toggleDetailModal}
                >

                </SDModal>
            </Fragment>
        )
    }
}

class IpSetItem extends Component {

    state = {
        // 网卡已被其他绑定的提示
        bindTip: undefined,
    }

    /** 改变输入值
     * @param {string} type： 改变项 
     * @param {string} val ：改变后的值
     */
    handleChangeVal = (type, val) => {
        const { rowIndex, ipListIndex, handleChange } = this.props;
        handleChange(type, val, rowIndex, ipListIndex);
    }

    /** IP输入项对应的网卡选择组件
     *  @description 已被其他IP选择的网卡变成灰色勾选状，点击该类型的复选框需要提示该网卡已被绑定
     */
    netCardSelector = () => {
        const { item, netCardList } = this.props;
        const { bindTip } = this.state;
        return (
            <div className="netcard-selector">
                {
                    (netCardList || []).map((x, index) => {
                        return (
                            <Checkbox
                                key={x.value}
                                dataIndex={index}
                                ipIndex={x.ipIndex}
                                className={x.ipIndex > -1 && x.ipIndex !== item.index ? 'fake-checkbox' : ''}
                                onChange={this.onChange}
                                value={x.value}
                                checked={x.ipIndex > -1}
                            >{x.value}</Checkbox>
                        )
                    })
                }
                {
                    bindTip ? <div className="bind-tip-box" onClick={this.handleClick}>
                        该网卡已绑定IP（{bindTip.hasIpUrl}），是否重新绑定？
                        <span>重新绑定</span>
                    </div> : null
                }
            </div>
        )
    };

    /** 点击重复绑定提示框（蒙层）的事件
     *  @description 如果点击了【重新绑定】之外的地方默认不绑定，关闭提示；
     *  @description 点击了【重新绑定】,则改变该网卡的绑定关系
     */
    handleClick = e => {
        if (!e.target.className) {
            const { rowIndex, item, handleChangeNetcard } = this.props;
            handleChangeNetcard(item.index, true, rowIndex, this.state.bindTip.dataIndex);
        }
        this.setState({ bindTip: undefined })
    }

    /** 勾选网卡的回调事件
     *  @param {array} checkedValue :选中的网卡数组
     *  @description 如果该网卡已绑定且绑定的ip不是当前的ip，已绑定的ip不为空时提示【重新绑定】
     */
    onChange = (e) => {
        const { checked, ipIndex, dataIndex } = e.target;
        const { rowIndex, item, handleChangeNetcard, ipList } = this.props;

        if (ipIndex > -1 && item.index !== ipIndex) {
            const hasIpUrl = ipList.find(k => k.index === ipIndex).ipUrl;
            if (hasIpUrl.length) {
                this.setState({ bindTip: { hasIpUrl, dataIndex } });
            } else {
                handleChangeNetcard(item.index, true, rowIndex, dataIndex);
            }
        } else {
            handleChangeNetcard(item.index, checked, rowIndex, dataIndex);
        }

    }

    render() {
        const { ipList, rowIndex, ipListIndex, item, netCardList, handleDealIpItem } = this.props;
        const netCard = netCardList.filter(k => k.ipIndex === item.index);

        return (
            <IPSetItemContainer>
                <span>IP{item.index + 1}</span>

                <Popover
                    title={null}
                    trigger="click"
                    placement="topLeft"
                    content={this.netCardSelector()}
                    overlayClassName="task-netcard-popover"
                >
                    <IpInput
                        index={`ipset${rowIndex}_${ipListIndex}`}
                        ip={item.ipUrl}
                        onChangeIp={(ip) => this.handleChangeVal('ipUrl', ip)}
                    />
                </Popover>

                <span style={{ display: 'inline-block', width: 56 }}>
                    <AddBtn onClick={() => handleDealIpItem('add', rowIndex)}>+</AddBtn>
                    {
                        ipList.length > 1 && <AddBtn onClick={() => handleDealIpItem('del', rowIndex, ipListIndex)}>-</AddBtn>
                    }
                </span>

                {
                    (netCard || []).map(data => <span className="net-card-item" key={data.value}>{data.value}</span>)
                }
            </IPSetItemContainer>
        )
    }
}

export default TaskSetIp;