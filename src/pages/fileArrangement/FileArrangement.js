import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { Select, Tabs, Button, Input, Modal, Icon, Checkbox, message } from 'antd';
import { ContainerBody } from "src/components/LittleComponents";
import api from "src/tools/api";
import SDTable from "src/components/SDTable";
import { downloadFile } from "src/tools/utils";

import tableColumns from './tableColumns';

const TabPane = Tabs.TabPane;
const { Option } = Select;

// styled-components样式包装组件

const StyledTabs = styled(Tabs)`
    /* 覆写antd样式 */
    .ant-tabs-bar.ant-tabs-top-bar {
        background: #ffffff;
        border-radius: 4px;
        border-bottom: 2px solid #D3E4FF;
        margin: 3px 1px 0;
        box-shadow: 0 0 4px 1px rgba(80, 84, 90, 0.1);

        .ant-tabs-tab {
            padding: 9px 15px 13px;
            margin-left: 20px;
            font-size: 15px;
            font-family: SourceHanSansCN-Regular, "Microsoft YaHei", sans-serif;
            font-weight: 400;
            color: rgba(65, 97, 136, 1);
        }
    }
`;

// tab外框
const StyledPane = styled.div`
    box-shadow: 0 0 4px 1px rgba(80, 84, 90, 0.1);
    background: #ffffff;
    margin-bottom: 10px;
    padding: 16px;
`;

// 查询条件表单
const StyledForm = styled.div`
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
`;

// 表单内容
const StyledFormItem = styled.div`
    display: inline-block;
    margin-right: 15px;

    & > span {
        padding-left: 10px;
    }
`;

// 下拉菜单
const StyledSelect = styled(Select)`
    display: inline-block;
    width: 160px;
    vertical-align: middle;
`;

// 集群下啦菜单
const StyledClusterSelect = styled(StyledSelect)`
    margin-right: 15px;
`;

// 按钮
const StyledButton = styled(Button)`
    height: 32px;
    border-radius: 2px;
    text-shadow: none;
    box-shadow: 0 2px 4px 0 rgba(16, 112, 225, 0.16);
    margin-right: 10px;
`;

// 查询按钮
const StyledPrimaryButton = styled(StyledButton)`
    height: 32px;
    border: none;
    background: #1B67E0;
    color: #ffffff;

    &:hover {
        background: #1B67E0;
        color: #ffffff;
    }
`;

// 数字输入框
const StyledNumberInput = styled(Input)`
    width: 80px;
    height: 32px;
    vertical-align: middle;
    margin-left: 10px;
`;

// 导出列选择输入框
const ExportModal = styled(Modal)`
    top: ${props => `${props.top}px`};
    left: ${props => `${props.left}px`};
    margin: 0;
`;

// 导出按钮
const ExportBtn = styled.a`
    font-size: 15px;
    float: right;
`;

// 导出列名选择checkbox
const FlexCheckboxGroup = styled(Checkbox.Group)`
    display: flex;
    flex-wrap: wrap;

    label {
        flex: 50%;
        margin: 0;
    }
`;

// 小文件梳理组件
export default function FileArrangement(props) {
    // 集群选择值
    const [clusterValue, setClusterValue] = useState('');
    // 集群获取失败状态
    // const [clusterRequestError, setClusterRequestError] = useState(false);

    //集群选项
    const [clusterOptions, setClusterOptions] = useState([]);
    useEffect(() => {
        getClusterOptions();
    }, []);// 近首次加载时触发

    // 上方tab列表
    const topPanes = [
        {
            key: 'tab1',
            title: 'HDFS文件处理',
            content: <HDFS clusterValue={clusterValue} />,
        }
    ];

    // 下方tab列表
    const bottomPanes = [
        {
            key: 'tab1',
            title: '小文件处理',
            content: <FragmentFile clusterValue={clusterValue} />,
        }
    ];

    // 获取集群列表
    const getClusterOptions = async () => {
        try {
            const res = await api.getClusterBasicInfo();

            if (res.data.success !== 'true') {
                message.destroy();
                message.error(res.data.msg);
                // setClusterRequestError(true);
                return;
            }

            setClusterOptions(res.data.data);
            setClusterValue(res.data.data[0].clusterName);
            // setClusterRequestError(false);
        } catch (err) {
            message.destroy();
            message.error('获取集群列表失败');
        }
    };

    // 集群选项修改事件
    const onClusterChange = (value) => {
        setClusterValue(value);
    };

    return (
        <ContainerBody>
            <StyledTabs
                defaultActiveKey="tab1"
                // className="sd-tabs bordered-title-tabs"
                tabBarExtraContent={
                    <StyledClusterSelect
                        notFoundContent="暂无数据"
                        value={clusterValue}
                        onChange={onClusterChange}
                    >
                        {
                            clusterOptions.map(item =>
                                <Option key={item.clusterName} value={item.clusterName}>
                                    {item.clusterName}
                                </Option>
                            )
                        }
                    </StyledClusterSelect>
                }
            >
                {
                    topPanes.map(pane =>
                        <TabPane key={pane.key} tab={pane.title}>{pane.content}</TabPane>
                    )
                }
            </StyledTabs>
            <StyledTabs
                defaultActiveKey="tab1"
            // className="sd-tabs bordered-title-tabs"
            >
                {
                    bottomPanes.map(pane =>
                        <TabPane key={pane.key} tab={pane.title}>{pane.content}</TabPane>
                    )
                }
            </StyledTabs>
        </ContainerBody>
    );
}





// HDFS文件处理组件
function HDFS(props) {
    // 表格式选项列表
    const tableTypeOptions = [
        {
            name: '地市分区表',
            columns: 'regionColumns',
            value: '1'
        }, {
            name: '天（小时）分区表',
            columns: 'dailyColumns',
            value: '4, 5',
        }, {
            name: '周分区表',
            columns: 'weeklyColumns',
            value: '3',
        }, {
            name: '月分区表',
            columns: 'monthlyColumns',
            value: '2',
        }, {
            name: '其他分区表',
            columns: 'otherColumns',
            value: '7'
        },
    ];

    // 表格式选择值
    const [tableType, setTableType] = useState('1');
    // 列表查询中状态
    const [fetching, setFetching] = useState(false);
    // 列表数据
    const [dataSource, setDataSource] = useState([]);
    // 导出模态框显隐
    const [exportModalVisible, setExportModalVisible] = useState(false);
    // 导出模态狂位置
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    // 导出模态狂checkbox选中值
    const [checkedColumns, setCheckedColumns] = useState(
        tableColumns[(tableTypeOptions.find(item => item.value === tableType)).columns].reduce((acc, cur) => {
            return cur.checkboxDisabled ? [...acc, cur.title] : acc
        }, [])
    );

    // 首次加载获取列表数据
    useEffect(() => {
        getHDFSList();
    }, [props.clusterValue]);

    // 表格式修改事件
    const onTableTypeChange = (value) => {
        setTableType(value);
        setCheckedColumns(tableColumns[(tableTypeOptions.find(item => item.value === value)).columns].reduce((acc, cur) => {
            return cur.checkboxDisabled ? [...acc, cur.title] : acc
        }, []));
        setDataSource([]);
    };

    // 导出模态框显隐控制
    const toggleExportModal = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        !exportModalVisible && setModalPosition({
            x: rect.x,
            y: rect.y + rect.height + 10
        });
        setExportModalVisible(!exportModalVisible);
    };

    // 到处模态框checkbox修改事件
    const onCheckedColumnsChange = (checkedValues) => {
        setCheckedColumns(checkedValues);
    };

    // 获取HDFS列表内容
    const getHDFSList = async () => {
        if (!props.clusterValue) return;

        try {
            await setFetching(true);

            const res = await api.getHDFSFileList({
                "clusterName": props.clusterValue,
                "tablePartitionTypes": tableType.split(',')
            });
            const data = await res.data;

            if (data.success !== 'true') {
                data.msg && message.error(data.msg);
                setDataSource([]);
                setFetching(false);
                return;
            }

            setDataSource(data.data.map(item => { return { ...item, key: item.id } }));
            setFetching(false);
        } catch (err) {
            setDataSource([]);
            setFetching(false);

            message.destroy();
            message.error('获取HDFS列表失败');
        }
    };

    // 导出HDFS列表内容
    const exportHDFS = async () => {
        const res = await api.exportHDFSFileList({
            "clusterName": props.clusterValue,
            "exportFields": checkedColumns,
            "tablePartitionTypes": tableType.split(',')
        });

        downloadFile(res);
    };

    return (
        <StyledPane>
            <StyledForm>
                <StyledFormItem>
                    <span>请选择表格式：</span>
                    <StyledSelect
                        notFoundContent="暂无数据"
                        value={tableType}
                        onChange={onTableTypeChange}
                    >
                        {
                            tableTypeOptions.map(item =>
                                <Option key={item.name} value={item.value}>
                                    {item.name}
                                </Option>
                            )
                        }
                    </StyledSelect>
                </StyledFormItem>
                <StyledFormItem>
                    <StyledPrimaryButton onClick={getHDFSList}>立即更新</StyledPrimaryButton>
                    <StyledButton onClick={toggleExportModal}>导出</StyledButton>
                </StyledFormItem>
            </StyledForm>
            <SDTable
                columns={tableColumns[(tableTypeOptions.find(item => item.value === tableType)).columns]}
                dataSource={dataSource}
                className="sd-table-simple"
                scroll={{ x: '175%' }}
                loading={fetching}
                bordered={true}
            />

            <ExportModal
                title={
                    <Fragment>
                        选择导出字段
                        <ExportBtn
                            onClick={exportHDFS}
                        >
                            <Icon type="arrow-right" />确认导出
                        </ExportBtn>
                    </Fragment>
                }
                top={modalPosition.y}
                left={modalPosition.x}
                width={400}
                closable={false}
                maskClosable={true}
                maskStyle={{
                    background: 'none'
                }}
                visible={exportModalVisible}
                onCancel={toggleExportModal}
                footer={null}
            >
                <FlexCheckboxGroup
                    options={tableColumns[(tableTypeOptions.find(item => item.value === tableType)).columns].map(item => {
                        return {
                            label: item.title,
                            value: item.title,
                            disabled: item.checkboxDisabled
                        };
                    })}
                    value={checkedColumns}
                    onChange={onCheckedColumnsChange}
                />
            </ExportModal>
        </StyledPane>
    );
}





// 小文件处理组件
function FragmentFile(props) {
    // 列表查询中状态
    const [fetching, setFetching] = useState(false);
    // 列表数据
    const [dataSource, setDataSource] = useState([]);
    // 文件大小输入值
    const [fileSize, setFileSize] = useState(10);
    // 表文件数量输入值
    const [fileAmount, setFileAmount] = useState(1);

    // 首次加载获取列表数据
    useEffect(() => {
        getFragmentList();
    }, [props.clusterValue]);

    // 获取HDFS列表内容
    const getFragmentList = async () => {
        if (!props.clusterValue) return;

        try {
            await setFetching(true);

            const res = await api.getFragmentFileList({
                "clusterName": props.clusterValue,
                "fileNumBounds": parseInt(fileAmount),
                "fileSizeBounds": parseInt(fileSize),
                "top": 10
            });
            const data = await res.data;

            if (data.success !== 'true') {
                data.msg && message.error(data.msg);
                setDataSource([]);
                setFetching(false);
                return;
            }

            setDataSource(data.data.map((item, index) => { return { ...item, key: index } }));
            setFetching(false);
        } catch (err) {
            setDataSource([]);
            setFetching(false);

            message.destroy();
            message.error('获取HDFS列表失败');
        }
    };

    // 导出HDFS列表内容
    const exportFragment = async () => {
        const res = await api.exportFragmentFileList({
            "clusterName": props.clusterValue,
            "fileNumBounds": parseInt(fileAmount),
            "fileSizeBounds": parseInt(fileSize),
            "top": 10
        });

        downloadFile(res);
    };

    return (
        <StyledPane>
            <StyledForm>
                <StyledFormItem>
                    <span>{`文件大小 <`}</span>
                    <StyledNumberInput
                        type='number'
                        value={fileSize}
                        onChange={e => setFileSize(e.target.value)}
                    />
                </StyledFormItem>
                <StyledFormItem>
                    <span>{`表文件数量 >`}</span>
                    <StyledNumberInput
                        type='number'
                        value={fileAmount}
                        onChange={e => setFileAmount(e.target.value)}
                    />
                </StyledFormItem>
                <StyledFormItem>
                    <StyledPrimaryButton onClick={getFragmentList}>查询</StyledPrimaryButton>
                    <StyledButton onClick={exportFragment}>导出</StyledButton>
                </StyledFormItem>
            </StyledForm>
            <SDTable
                columns={tableColumns.fragmentFileColumns}
                dataSource={dataSource}
                pagination={false}
                className="sd-table-simple"
                scroll={{ x: '130%' }}
                bordered={true}
                loading={fetching}
            />
        </StyledPane>
    );
}