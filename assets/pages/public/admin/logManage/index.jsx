import React from 'react';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Tree,
  Table,
  Pagination,
  Input,
  Form,
  Button,
  Empty,
  Spin,
  Space,
  DatePicker,
  message
} from 'antd';
import { SnippetsOutlined } from '@ant-design/icons';
import adminApi from 'api/admin';
import EllipsisTooltip from 'components/EllipsisTooltip';
import LogModal from './logModal';

const { RangePicker } = DatePicker;
const { TreeNode } = Tree;

class LogManage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeLoading: false,
      treeList: [],
      sortId: '',
      selectTreeKeys: [],
      tableLoading: false,
      dataSource: [],
      total: 0,
      page: 1,
      pageSize: 10,
      detailedRecord: {},
      isShow: false
    };
    this.treeQueryParams = {};
    this.queryParams = {};
  }

  componentDidMount() {
    this.fetchTree();
    this.fetchPage();
  }

  fetchTree = () => {
    this.setState({
      treeLoading: true
    });
    adminApi
      .logTree({
        ...this.treeQueryParams
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          this.setState({
            treeList: data.dataList
          });
        } else {
          message.error(res.data.message);
        }
        this.setState({
          treeLoading: false
        });
      });
  };

  fetchPage = () => {
    const { page, pageSize, sortId } = this.state;
    this.setState({
      tableLoading: true
    });
    adminApi
      .logPage({
        currentPage: page,
        pageSize: pageSize,
        sortId,
        ...this.queryParams
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          this.setState({
            dataSource: data.dataList,
            total: data.totalCount
          });
        } else {
          message.error(res.data.message);
        }
        this.setState({
          tableLoading: false
        });
      });
  };

  onFinish = (values) => {
    this.queryParams = {};
    values.startDate = values.time && values.time[0].format('YYYY-MM-DD');
    values.endDate = values.time && values.time[1].format('YYYY-MM-DD');
    delete values.time;
    for (let key in values) {
      if (values[key]) {
        this.queryParams[key] = values[key];
      }
    }
    this.setState(
      {
        page: 1
      },
      () => {
        this.fetchPage();
      }
    );
  };

  digui = (data) => {
    return (
      data &&
      data.map((item) => (
        <TreeNode
          key={item.id}
          value={item.id}
          title={
            <React.Fragment>
              <span title={item.name}>{item.name}</span>
            </React.Fragment>
          }
          icon={(node) => {
            return <SnippetsOutlined />;
          }}
          dataRef={item}
          isLeaf={item.isLeaf}
        >
          {item.children && item.children.length !== 0 ? this.digui(item.children) : null}
        </TreeNode>
      ))
    );
  };

  handleClickTreeItem = (selectedKeys, e) => {
    this.setState(
      {
        sortId: selectedKeys[0],
        selectTreeKeys: selectedKeys
      },
      () => {
        this.fetchPage();
      }
    );
  };

  handleChangeTablePage = (page, pageSize) => {
    this.setState(
      {
        page,
        pageSize
      },
      () => {
        this.fetchPage();
      }
    );
  };
  onClose = () => {
    this.setState({
      isShow: false
    });
  };
  //跳转至查看详情页
  showModal = (data) => {
    this.setState({
      isShow: true,
      detailedRecord: data
    });
  };

  render() {
    const that = this;
    const {
      treeLoading,
      treeList,
      selectTreeKeys,
      tableLoading,
      page,
      pageSize,
      total,
      dataSource,
      detailedRecord,
      isShow
    } = this.state;

    const columns = [
      {
        title: '请求接口路径',
        key: 'url',
        dataIndex: 'url',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 300
          }
        }),
        render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
      },
      {
        title: '日志信息',
        key: 'logMessage',
        dataIndex: 'logMessage',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 300
          }
        }),
        render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
      },
      {
        title: '操作人',
        key: 'operatorName',
        dataIndex: 'operatorName',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        })
      },
      {
        title: '操作人IP',
        key: 'operatorIp',
        dataIndex: 'operatorIp',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        })
      },
      {
        title: '操作时间',
        key: 'createdTime',
        dataIndex: 'createdTime',
        onHeaderCell: () => ({
          style: { minWidth: 180 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        }),
        render: (text) => {
          return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        }
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        onHeaderCell: () => ({
          style: { minWidth: 80 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        }),
        render: (text, record, index) => {
          return (
            <Space>
              <a onClick={() => that.showModal(record)}>查看</a>
            </Space>
          );
        }
      }
    ];
    return (
      <div style={{ padding: 16, height: '100%' }}>
        <h2>日志管理</h2>
        {isShow ? (
          <LogModal
            visible={isShow}
            detailedRecord={detailedRecord}
            onClose={this.onClose}
          ></LogModal>
        ) : (
          ''
        )}
        <Row gutter={16} style={{ height: '100%', marginTop: 10 }}>
          <Col span={5}>
            <Card style={{ height: '100%' }}>
              {treeList && treeList.length == 0 ? (
                <Empty description="暂无数据" style={{ marginTop: 30 }}></Empty>
              ) : (
                <Spin spinning={treeLoading}>
                  <Tree
                    showIcon
                    defaultExpandParent
                    defaultExpandAll
                    selectedKeys={selectTreeKeys}
                    onSelect={this.handleClickTreeItem}
                  >
                    {this.digui(treeList)}
                  </Tree>
                </Spin>
              )}
            </Card>
          </Col>
          <Col span={19}>
            <Card style={{ height: '100%' }}>
              <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                  <Form layout="inline" onFinish={this.onFinish}>
                    <Form.Item name="name">
                      <Input style={{ width: 160 }} placeholder="通知名称" />
                    </Form.Item>
                    <Form.Item name="time">
                      <RangePicker placeholder={['开始时间', '结束时间']} />
                    </Form.Item>
                    <Form.Item shouldUpdate>
                      {() => (
                        <Button type="primary" htmlType="submit">
                          查询
                        </Button>
                      )}
                    </Form.Item>
                  </Form>
                </div>
              </div>
              <Table
                rowKey="id"
                loading={tableLoading}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                scroll={{ x: true }}
              />
              <Pagination
                total={total}
                showTotal={(total) => `共${total}条`}
                showSizeChanger
                pageSizeOptions={['10', '20', '50', '100']}
                onChange={this.handleChangeTablePage}
                onShowSizeChange={this.handleChangeTablePage}
                current={page}
                pageSize={pageSize}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LogManage;
