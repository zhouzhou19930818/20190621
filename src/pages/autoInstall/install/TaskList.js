// 装机任务
import React, { Fragment } from 'react';
import { Button, Input, message, Modal, Avatar, Progress, Icon } from 'antd';
import moment from 'moment';
import SDTable from 'src/components/SDTable';
import api from "src/tools/api";
// import { withRouter } from 'react-router-dom';
import TaskInfo from './TaskInfo';
import { reduxMapper } from "src/redux/modules/installManager";


// 0未装机，1已装机，2正在装机，3装机异常
const allStatus = ['未装机', '已装机', '正在装机', '装机异常', '人工修复（已装机）'];

class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            tableLoading: true,
            dataSource: [],
            scrollY: undefined,
            currentObj: {
                obj: {},
                fields: {},
            },
            installResult: [],
            modalVisible: false,
            modalAddInfoVisible: false,
            detailDataSource: {
                success: [],
                failed: [],
            }
        };
    }
    columns = [
        {
            title: '任务名称',
            dataIndex: 'baseTaskName',
            key: 'baseTaskName',
            width: 120,
        },
        {
            title: '创建人',
            dataIndex: 'createUserName',
            key: 'createUserName',
            width: 80,
            render() {
                return (
                    <Avatar size="small" icon="user" />
                )
            }
        },
        {
            title: '开始时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '主机个数',
            dataIndex: 'baseTaskHostTotal',
            key: 'baseTaskHostTotal',
            width: 100,
            onCell: (record, index) => {
                return {
                    style: {
                        textAlign: 'center',
                        paddingRight: 45,
                    }
                }
            },
            render(totalTaskPoint, record) {
                return (
                    <span>{totalTaskPoint}</span>
                );
            }
        },
        {
            title: '状态',
            dataIndex: 'baseTaskStatus',
            key: 'baseTaskStatus',
            width: 140,
            render: (status) => <span style={{
                color: status === 5 ? '#008364' : '#213555',
                background: status === 5 ? '#EAF8E5' : '#D2F1FF',
                display: 'inline-block',
                height: '24px',
                lineHeight: '24px',
                borderRadius: '2px'
            }}>{allStatus[status]}</span>,
        },
        {
            title: '提示',
            key: 'op',
            width: 100,
            render: (automaticBaseTaskId) => {
                return (
                    <div>{automaticBaseTaskId.index % 2 === 0
                        ? <Icon type="warning" theme="filled" style={{ color: '#f4c022' }} />
                        : <Icon type="pause-circle" theme="filled" style={{ color: '#686f7a' }} />
                    }
                    </div>
                )
            }
        },
        {
            title: '处理进度',
            dataIndex: 'speedOfProgress',
            key: 'speedOfProgress',
            width: 120,
            sorter: (a, b) => parseInt(a.speedOfProgress * 100) - parseInt(b.speedOfProgress * 100),
            render(speedOfProgress, record) {
                const percent = parseInt(speedOfProgress * 100);
                return (
                    <Progress percent={percent} strokeColor="#22C151" />
                );
            },
        },
    ];

    componentDidMount() {
        console.log(this.props)
        this.getList();
        this.setScrollY();
        // this.getTaskStatusMsg();
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.getList();
        // if (nextProps.taskId && nextProps.taskId !== this.props.taskId) {
        //     this.connectWebsocket(() => {
        //         this.websocket.send(JSON.stringify({ taskId: nextProps.taskId }));
        //     });
        //     this.getTaskStatusMsg(nextProps.taskId);
        // }
    };

    //根据主机任务状态获取任务目前处于哪个步骤
    // getTaskStatusMsg = (baseTaskStatus) => {
    //     console.log(baseTaskStatus)
    //     api.getAllBaseTask().then(res => {
    //         console.log(res)
    //         if (res.data.success !== 'true') {
    //             message.error(res.data.msg);
    //             return;
    //         }
    //         const data = res.data.data;
    //         this.props.changeStepCurrent(data.baseTaskStatus);
    //         this.props.changeTaskLatestStep(data.baseTaskStatus);
    //     })
    // };

    // 获取列表数据
    getList = (options = {}) => {
        if (!this.state.tableLoading) this.setState({ tableLoading: true });
        // if(JSON.stringify(options) !== '{}'){
        // }
        api.getAllBaseTask(options).then(res => {
            // console.log(res)
            if (res.data.success !== 'true') {
                this.setState({ tableLoading: false });
                message.error(res.data.msg);
                return;
            }
            this.setState({
                tableLoading: false,
                dataSource: res.data.data && res.data.data.map((d, i) => ({ ...d, index: i + 1 })),
            });
        }).catch(() => {
            this.setState({ tableLoading: false });
        });
    };

    setScrollY = () => {
        const contentEl = document.getElementsByClassName('router-wrapper')[0];
        let scrollY = undefined;
        if (contentEl) {
            const contentPadding = 16;
            const contentTabs = 61;
            const contentFilterForm = 37;
            const contentTablePagination = 44;
            const contentTableHead = 64; // 当表格内容占两行时的高度, 43: 一行的高度
            const containerHeight = contentEl.clientHeight;
            scrollY = containerHeight - contentPadding - contentTabs - contentFilterForm - contentTablePagination - contentTableHead;
        }
        this.setState({ scrollY });
    };

    onRowSelect = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };

    //弹出一个弹出框用于新增信息
    openModalAddInfo = (type) => {
        this.setState({ modalAddInfoVisible: true })
    }
    changeModalList = (a) => {
        this.setState({
            modalAddInfoVisible: a
        }, () => {
            // console.log(this.state.modalAddInfoVisible)
        })
    }
    render() {
        const state = this.state;
        return (
            <div>
                <div className="sd-filter-form">
                    <Button htmlType="button"
                        type="primary"
                        className="sd-minor"
                        onClick={() => this.openModalAddInfo("modalAddInfo")}
                    >
                        创建任务
                    </Button>
                    {/*title:弹出框标题  visible:是否可见  onCancel:取消按钮，右上角X号事件*/}
                    <Modal
                        className="open-task-list"
                        visible={this.state.modalAddInfoVisible}
                        onCancel={() => {
                            this.setState({ modalAddInfoVisible: false })
                        }}
                        footer={null}
                    >
                        <TaskInfo getList={this.getList} changeModalList={this.changeModalList} />
                    </Modal>
                    <Icon type="warning" theme="filled" style={{ color: '#f4c022' }} className="icon-name-first icon-name" />
                    <span className="span-style span-task-style">待处理</span>
                    <Icon type="pause-circle" theme="filled" style={{ color: '#686f7a' }} className="icon-name-first icon-name" />
                    <span className="span-style span-task-style">暂停中</span>
                    <Input.Search
                        // onChange={this.onSearchChange}
                        placeholder="请输入名称或描述"
                    />
                </div>
                <SDTable
                    onRow={(record, index) => {
                        return {
                            onClick: event => {
                                this.props.changeTaskId(record.automaticBaseTaskId);
                                this.props.changeIsExpendContent(true);
                            } // 点击行
                        };
                    }}
                    id="task-testclick"
                    className="task-table-wrapper"
                    columns={this.columns}
                    rowKey="BaseTaskId"
                    loading={state.tableLoading}
                    dataSource={state.dataSource}
                    scroll={{ x: true, y: state.scrollY }}
                />
            </div>
        )
    }
}

export default reduxMapper(TaskList);
// export default  withRouter(reduxMapper(TaskList));