import React from 'react';
import moment from 'moment';
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Pagination,
  message,
  Modal,
  Row,
  Col,
  Card,
  Divider,
  Popconfirm
} from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import adminApi from 'api/admin';
import loginApi from 'api/login';
import JsEncrypt from 'utils/jsEncrypt.js';
const { Option } = Select;

class UserManage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      page: 1,
      pageSize: 10,
      dataSource: [],
      total: 0,
      userId: null,
      userName: null,
      noBindSelectKeys: [],
      noBindLoading: false,
      noBindData: [],
      bindSelectKeys: [],
      bindLoading: false,
      bindData: [],
      visible: false
    };
    this.queryParams = {};
  }

  componentDidMount() {
    this.fetchPage();
  }

  fetchPage = () => {
    const { page, pageSize } = this.state;
    this.setState({
      tableLoading: true
    });
    adminApi
      .getUserListWithCompany({
        currentPage: page,
        pageSize: 10,
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

  fetchNobingPage = () => {
    const { userId } = this.state;
    this.setState({
      noBindLoading: true
    });
    adminApi
      .noSelectList({
        userId
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          this.setState({
            noBindData: data.dataList
          });
        } else {
          message.error(res.data.message);
        }
        this.setState({
          noBindLoading: false
        });
      });
  };

  fetchBindPage = () => {
    const { userId } = this.state;
    this.setState({
      bindLoading: true
    });
    adminApi
      .userRoleList({
        userId
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          this.setState({
            bindData: data.dataList
          });
        } else {
          message.error(res.data.message);
        }
        this.setState({
          bindLoading: false
        });
      });
  };

  handleSetAdmin = (id) => {
    adminApi
      .setSuperAdmin({
        userId: id
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          message.success('设置成功');
          this.fetchPage();
        } else {
          message.error(res.data.message);
        }
      });
  };

  handleSetRole = (record) => {
    this.setState(
      {
        userId: record.id,
        userName: record.userName,
        visible: true
      },
      () => {
        this.fetchNobingPage();
        this.fetchBindPage();
      }
    );
  };

  handleMakeOver = (record) => {
    Modal.confirm({
      width: 666,
      title: '移交权限',
      onOk: () => {
        const params = {
          userId: record.id
        };
        adminApi.transferPermission(params).then((res) => {
          if (res?.data?.success) {
            message.success('移交权限成功');
            this.fetchPage();
          } else {
            message.error(res.data.message);
          }
        });
      },
      content: (
        <div style={{ textAlign: 'center' }}>
          <p>
            你将会把当前账号的所有权限移交给{' '}
            <a>
              {record.userName}（{JsEncrypt(record.mobile)}）
            </a>
            ，并退出当前公司。
          </p>
          <p style={{ marginTop: 20 }}>是否确认离职转让？</p>
        </div>
      )
    });
  };

  onSelectNoBind = (selectedRowKeys, selectedRows) => {
    this.setState({
      noBindSelectKeys: selectedRowKeys
    });
  };

  onSelectBind = (selectedRowKeys, selectedRows) => {
    this.setState({
      bindSelectKeys: selectedRowKeys
    });
  };

  handleBindRole = () => {
    const { noBindSelectKeys, noBindData, bindData } = this.state;
    let temp1 = noBindData;
    let temp2 = bindData;
    let res = temp1.filter((item) => noBindSelectKeys.includes(item.id));
    temp1 = temp1.filter((item) => !noBindSelectKeys.includes(item.id));
    temp2 = temp2.concat(res);
    this.setState({
      noBindData: temp1,
      bindData: temp2,
      noBindSelectKeys: []
    });
  };

  handleUnBindRole = () => {
    const { bindSelectKeys, noBindData, bindData } = this.state;
    let temp1 = noBindData;
    let temp2 = bindData;
    let res = temp2.filter((item) => bindSelectKeys.includes(item.id));
    temp2 = temp2.filter((item) => !bindSelectKeys.includes(item.id));
    temp1 = temp1.concat(res);
    this.setState({
      noBindData: temp1,
      bindData: temp2,
      bindSelectKeys: []
    });
  };

  handleConfigRole = () => {
    const { bindData, userId, userName } = this.state;
    let payload = {
      userId,
      userName,
      roleIds: bindData.map((item) => item.id)
    };
    adminApi.userRole(payload).then((res) => {
      const { data } = res.data;
      if (res.data.code === '0' && data) {
        message.success('设置成功');
        this.setState({
          visible: false
        });
        this.fetchPage();
      } else {
        message.error(res.data.message);
      }
    });
  };

  handleCancel = () => {
    this.setState({
      noBindSelectKeys: [],
      bindSelectKeys: [],
      userId: null,
      visible: false
    });
  };

  onFinish = (values) => {
    this.queryParams = {};
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

  handleDeleteRole = (record) => {
    const params = {
      userId: record.id
    };
    adminApi.deleteUser(params).then((res) => {
      if (res?.data?.success) {
        message.success('删除成功');
        this.fetchPage();
      } else {
        message.error(res.data.message);
      }
    });
  };
  handleEnableUser = (record) => {
    const params = {
      userId: record.id
    };
    adminApi.enableUser(params).then((res) => {
      if (res?.data?.success) {
        message.success('启用成功');
        this.fetchPage();
      } else {
        message.error(res.data.message);
      }
    });
  };
  handleDiableRole = (record) => {
    const params = {
      userId: record.id
    };
    adminApi.disableUser(params).then((res) => {
      if (res?.data?.success) {
        message.success('禁用成功');
        this.fetchPage();
      } else {
        message.error(res.data.message);
      }
    });
  };
  handleManager = (record) => {
    const antion = +record.isAdmin ? 'clearAdmin' : 'setAdmin';
    const params = {
      ...record,
      status: 3,
      userId: record.id
    };
    loginApi[antion]({ ...params }).then((res) => {
      if (res?.data?.success) {
        message.success('已设置');
        this.fetchPage();
      } else {
        message.error('操作失败');
      }
    });
  };
  render() {
    const {
      tableLoading,
      page,
      pageSize,
      dataSource,
      total,
      noBindSelectKeys,
      noBindLoading,
      noBindData,
      bindSelectKeys,
      bindLoading,
      bindData,
      visible
    } = this.state;

    const columns = [
      {
        title: '用户名',
        key: 'userName',
        dataIndex: 'userName'
      },
      {
        title: '身份证号',
        key: 'idcardNo',
        dataIndex: 'idcardNo',
        render: (text, record) => {
          return <span>{JsEncrypt(text)}</span>;
        }
      },
      {
        title: '手机号',
        key: 'mobile',
        dataIndex: 'mobile',
        render: (text, record) => {
          return <span>{JsEncrypt(text)}</span>;
        }
      },
      // {
      //   title: '所属公司',
      //   key: 'organName',
      //   dataIndex: 'organName'
      // },
      {
        title: '是否管理员',
        key: 'isAdmin',
        dataIndex: 'isAdmin',
        render: (text) => {
          return <span>{['否', '是'][+text]}</span>;
        }
      },
      {
        title: '账号状态',
        key: 'status',
        dataIndex: 'status',
        render: (text) => {
          return <span>{text == '1' ? '启用' : text == '2' ? '禁用' : ''}</span>;
        }
      },
      {
        title: '创建时间',
        key: 'createdTime',
        dataIndex: 'createdTime',
        render: (text) => {
          return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
          return (
            <span>
              {record.status == '1' ? (
                <span>
                  {userInfo.idcardNo !== JsEncrypt(record.idcardNo) && (
                    <>
                      <a onClick={this.handleMakeOver.bind(this, record)}>移交权限</a>
                      <Divider type="vertical" />
                    </>
                  )}
                  <a onClick={this.handleSetRole.bind(this, record)}>配置角色</a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确定要删除吗?"
                    onConfirm={() => this.handleDeleteRole(record)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a>删除</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确定要禁用吗?"
                    onConfirm={() => this.handleDiableRole(record)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a>禁用</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleManager(record)}>
                    {['设置管理员', '取消管理员'][+record.isAdmin || 0]}
                  </a>
                </span>
              ) : (
                <span>
                  <a onClick={() => this.handleEnableUser(record)}>启用</a>
                </span>
              )}
            </span>
          );
        }
      }
    ];

    const roleColumns = [
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name'
      }
    ];

    const noBindSelection = {
      selectedRowKeys: noBindSelectKeys,
      onChange: this.onSelectNoBind
    };

    const bindSelection = {
      selectedRowKeys: bindSelectKeys,
      onChange: this.onSelectBind
    };

    return (
      <div style={{ padding: 25 }}>
        {/* <h2>用户管理</h2> */}
        <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Form layout="inline" onFinish={this.onFinish}>
              <Form.Item name="userName">
                <Input allowClear style={{ width: 120 }} placeholder="用户名" />
              </Form.Item>
              <Form.Item name="idcardNo">
                <Input allowClear style={{ width: 160 }} placeholder="身份证号" />
              </Form.Item>
              <Form.Item name="mobile">
                <Input allowClear style={{ width: 160 }} placeholder="手机号" />
              </Form.Item>
              {/* <Form.Item name="organName"> */}
              {/* <Input allowClear style={{ width: 160 }} placeholder="所属公司" /> */}
              {/* </Form.Item> */}
              {/* <Form.Item name="superAdmin" initialValue={undefined}>
                <Select allowClear placeholder="是否管理员" style={{ width: 120 }}>
                  <Option key="0" value={0}>
                    否
                  </Option>
                  <Option key="1" value={1}>
                    是
                  </Option>
                </Select>
              </Form.Item> */}
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
          // loading={tableLoading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
        <Pagination
          total={total}
          showTotal={(total) => `共${total}条`}
          showSizeChanger
          style={{ marginTop: '10px', float: 'right', paddingBottom: '20px' }}
          pageSizeOptions={['10', '20', '50', '100']}
          onChange={this.handleChangeTablePage}
          // onShowSizeChange={this.handleChangeTablePage}
          current={page}
          pageSize={10}
        />
        <Modal
          destroyOnClose
          title="配置角色"
          visible={visible}
          width={600}
          onOk={this.handleConfigRole}
          onCancel={this.handleCancel}
        >
          <Row gutter={5} type="flex" style={{ marginTop: 10, justifyContent: 'center' }}>
            <Col span={11}>
              <Card
                title={`${noBindData.length}项`}
                extra="可选角色"
                size="small"
                style={{ height: '100%' }}
              >
                <Table
                  rowKey="id"
                  rowSelection={noBindSelection}
                  // loading={noBindLoading}
                  columns={roleColumns}
                  dataSource={noBindData}
                  size="small"
                  pagination={false}
                />
              </Card>
            </Col>
            <Col
              span={1}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                margin: '0px 10px'
              }}
            >
              <Button
                type="primary"
                icon={<RightOutlined />}
                size="small"
                disabled={noBindSelectKeys.length == 0}
                onClick={this.handleBindRole}
              />
              <Button
                type="primary"
                icon={<LeftOutlined />}
                size="small"
                disabled={bindSelectKeys.length == 0}
                onClick={this.handleUnBindRole}
                style={{ marginTop: 10 }}
              />
            </Col>
            <Col span={11}>
              <Card
                title={`${bindData.length}项`}
                extra="已选角色"
                size="small"
                style={{ height: '100%' }}
              >
                <Table
                  rowKey="id"
                  rowSelection={bindSelection}
                  loading={bindLoading}
                  columns={roleColumns}
                  dataSource={bindData}
                  size="small"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default UserManage;
