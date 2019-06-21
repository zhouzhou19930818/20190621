import React, { Fragment } from 'react';
import SDTable from 'src/components/SDTable';
import { message, Divider, Input, Modal, Button } from "antd";
import { reduxMapper } from "src/redux/modules/diskTrouble";
import Context from "./Context";
import api from 'src/tools/api';
import SelectTaskModel from './SelectTaskModel'
import { debounce } from "src/tools/utils";
// import { getStatus } from "src/pages/diskTrouble/List/commonStatus";

// 0未装机，1已装机，2正在装机，3装机异常
const allStatus = ['未装机', '已装机', '正在装机', '装机异常', '人工修复（已装机）'];

class TaskBigDataInitialization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            selectedRowKeys: [],
            tableLoading: true,
            scrollY: undefined,
            automaticBaseTaskId: '',
        };
    }

    static contextType = Context;

    columns = [
        {
            title: '主机名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: 120,
            render(text) {
                return (
                    <span style={{ cursor: 'pointer' }}>{text}</span>
                )
            }
        },
        {
            title: '机房',
            dataIndex: 'roomName',
            key: 'roomName',
            width: 100,
        },
        {
            title: '初始化模板',
            dataIndex: 'dcnIp',
            key: 'dcnIp',
            width: 160,
        },
        {
            title: '状态',
            dataIndex: 'baseTaskStatus',
            key: 'baseTaskStatus',
            width: 100,
            render: (status) => <span style={{
                color: status === 5 ? '#008364' : '#213555',
                background: status === 5 ? '#EAF8E5' : '#D2F1FF',
                display: 'inline-block',
                width: '48px',
                height: '24px',
                lineHeight: '24px',
                borderRadius: '2px'
            }}>{allStatus[status]}</span>,
        },
        {
            title: '日志',
            dataIndex: 'sn',
            // key: 'dcnIp',
            width: 160,
        },
        {
            title: '操作',
            dataIndex: 'op',
            width: '10%',
            render: (d, record) => {
                return (
                    <Fragment>
                        <button
                            key="btn_1"
                            className="sd-anchor-button"
                            style={{ color: '#0E6EDF' }}
                            onClick={() => this.onDetailShow(record)}
                        >
                            详情
                        </button>
                        {
                            record.status === 10 ? (
                                <Fragment>
                                    <Divider type="vertical" />
                                    <button
                                        key="btn_2"
                                        className="sd-anchor-button"
                                        style={{ color: '#0E6EDF' }}
                                        onClick={() => this.artificialRestorationProcess(record)}
                                    >
                                        人工修复
                                    </button>
                                </Fragment>
                            ) : null
                        }
                    </Fragment>
                )
            }
        },

    ];

    componentWillReceiveProps(nextProps, nextContext) {
        // 从"未完成任务"获取automaticBaseTaskId
        if (nextProps.automaticBaseTaskId !== this.state.automaticBaseTaskId) {
            this.getList(nextProps.automaticBaseTaskId);
        }
        // websocket 更新
        if (nextProps.websocketMsg) {
            debounce(() => this.getList(nextProps.automaticBaseTaskId));
        }
    }
    componentDidMount() {
    }

    //重装
    reinstall = (record) => {
        if (!this.state.detailVisible) this.setState({ detailVisible: true });
        if (record) this.currentObj = record;
        api.reCreateInstallTask(record).then(res => {
            if (res.data.success !== 'true') {
                console.log(111)
                message.error(res.data.msg);
                return;
            }
            // console.log(222)
            // let obj = res.data.data;
            // obj.statusObj = getStatus(obj.status, 15);
            // this.setState({ detailInfo: obj });
        });
    };

    // 剔除
    delete = (record) => {
        console.log(record)
        api.removeHost(record.automaticHostId).then(res => {
            if (res.data.success !== 'true') {
                message.error(res.data.msg);
                return;
            }
            this.getList(this.props.automaticBaseTaskId);
        });
    };

    getList = (baseTaskId) => {
        if (!this.state.tableLoading) this.setState({ tableLoading: true });
        if (!baseTaskId) return;
        api.getHostByBaseTaskId(baseTaskId).then(res => {
            if (res.data.success !== 'true') {
                this.setState({ tableLoading: false });
                message.error(res.data.msg);
                return;
            }
            this.setState({
                tableLoading: false,
                dataSource: res.data.data,
                selectedRowKeys: res.data.data.map(d => d.automaticBaseTaskId),
            });
        });
    };

    openModalAddInfo = (type) => {
        this.setState({ modalAddInfoVisible: true })
    }

    render() {
        const state = this.state;
        return (
            <Fragment>
                <div className="sd-filter-form">
                    <Button htmlType="button"
                        type="primary"
                        className="sd-minor"
                        style={{ margin: '0 8px 10px 15px' }}
                        onClick={() => this.openModalAddInfo("modalAddInfo")}
                    >
                        选择模版
                    </Button>
                    {/*title:弹出框标题  visible:是否可见  onCancel:取消按钮，右上角X号事件*/}
                    <Modal
                        title='选择模版'
                        className="select-task-list"
                        visible={this.state.modalAddInfoVisible}
                        onCancel={() => {
                            this.setState({ modalAddInfoVisible: false })
                        }}
                        footer={null}
                    >
                        <SelectTaskModel getList={this.getList} changeModalList={this.changeModalList} />
                    </Modal>
                    <Input.Search
                        // onChange={this.onSearchChange}
                        placeholder="请输入关键字"
                        style={{ width: '230px', float: 'right', marginRight: '14px' }} />
                </div>
                {/* <div style={{ float: 'right', margin: '-10px 20px 10px 0', }}>
                <Input.Search
                    placeholder="请输入关键字"
                    style={{ width: 252 }}
                    onChange={e => this.handleSearch(e.target.value)}
                />
            </div> */}
                <SDTable
                    rowKey="id"
                    id="testclick"
                    columns={this.columns}
                    dataSource={state.dataSource}
                    scroll={{ y: 200 }}
                />
            </Fragment>
        )
    }
}

export default reduxMapper(TaskBigDataInitialization);
