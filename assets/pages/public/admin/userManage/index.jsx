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
          message.success('????????????');
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
      title: '????????????',
      onOk: () => {
        const params = {
          userId: record.id
        };
        adminApi.transferPermission(params).then((res) => {
          if (res?.data?.success) {
            message.success('??????????????????');
            this.fetchPage();
          } else {
            message.error(res.data.message);
          }
        });
      },
      content: (
        <div style={{ textAlign: 'center' }}>
          <p>
            ????????????????????????????????????????????????{' '}
            <a>
              {record.userName}???{JsEncrypt(record.mobile)}???
            </a>
            ???????????????????????????
          </p>
          <p style={{ marginTop: 20 }}>???????????????????????????</p>
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
        message.success('????????????');
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
        message.success('????????????');
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
        message.success('????????????');
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
        message.success('????????????');
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
        message.success('?????????');
        this.fetchPage();
      } else {
        message.error('????????????');
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
        title: '?????????',
        key: 'userName',
        dataIndex: 'userName'
      },
      {
        title: '????????????',
        key: 'idcardNo',
        dataIndex: 'idcardNo',
        render: (text, record) => {
          return <span>{JsEncrypt(text)}</span>;
        }
      },
      {
        title: '?????????',
        key: 'mobile',
        dataIndex: 'mobile',
        render: (text, record) => {
          return <span>{JsEncrypt(text)}</span>;
        }
      },
      // {
      //   title: '????????????',
      //   key: 'organName',
      //   dataIndex: 'organName'
      // },
      {
        title: '???????????????',
        key: 'isAdmin',
        dataIndex: 'isAdmin',
        render: (text) => {
          return <span>{['???', '???'][+text]}</span>;
        }
      },
      {
        title: '????????????',
        key: 'status',
        dataIndex: 'status',
        render: (text) => {
          return <span>{text == '1' ? '??????' : text == '2' ? '??????' : ''}</span>;
        }
      },
      {
        title: '????????????',
        key: 'createdTime',
        dataIndex: 'createdTime',
        render: (text) => {
          return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        }
      },
      {
        title: '??????',
        key: 'action',
        render: (text, record, index) => {
          const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
          return (
            <span>
              {record.status == '1' ? (
                <span>
                  {userInfo.idcardNo !== JsEncrypt(record.idcardNo) && (
                    <>
                      <a onClick={this.handleMakeOver.bind(this, record)}>????????????</a>
                      <Divider type="vertical" />
                    </>
                  )}
                  <a onClick={this.handleSetRole.bind(this, record)}>????????????</a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="???????????????????"
                    onConfirm={() => this.handleDeleteRole(record)}
                    okText="??????"
                    cancelText="??????"
                  >
                    <a>??????</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="???????????????????"
                    onConfirm={() => this.handleDiableRole(record)}
                    okText="??????"
                    cancelText="??????"
                  >
                    <a>??????</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleManager(record)}>
                    {['???????????????', '???????????????'][+record.isAdmin || 0]}
                  </a>
                </span>
              ) : (
                <span>
                  <a onClick={() => this.handleEnableUser(record)}>??????</a>
                </span>
              )}
            </span>
          );
        }
      }
    ];

    const roleColumns = [
      {
        title: '??????',
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
        {/* <h2>????????????</h2> */}
        <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Form layout="inline" onFinish={this.onFinish}>
              <Form.Item name="userName">
                <Input allowClear style={{ width: 120 }} placeholder="?????????" />
              </Form.Item>
              <Form.Item name="idcardNo">
                <Input allowClear style={{ width: 160 }} placeholder="????????????" />
              </Form.Item>
              <Form.Item name="mobile">
                <Input allowClear style={{ width: 160 }} placeholder="?????????" />
              </Form.Item>
              {/* <Form.Item name="organName"> */}
              {/* <Input allowClear style={{ width: 160 }} placeholder="????????????" /> */}
              {/* </Form.Item> */}
              {/* <Form.Item name="superAdmin" initialValue={undefined}>
                <Select allowClear placeholder="???????????????" style={{ width: 120 }}>
                  <Option key="0" value={0}>
                    ???
                  </Option>
                  <Option key="1" value={1}>
                    ???
                  </Option>
                </Select>
              </Form.Item> */}
              <Form.Item shouldUpdate>
                {() => (
                  <Button type="primary" htmlType="submit">
                    ??????
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
          showTotal={(total) => `???${total}???`}
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
          title="????????????"
          visible={visible}
          width={600}
          onOk={this.handleConfigRole}
          onCancel={this.handleCancel}
        >
          <Row gutter={5} type="flex" style={{ marginTop: 10, justifyContent: 'center' }}>
            <Col span={11}>
              <Card
                title={`${noBindData.length}???`}
                extra="????????????"
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
                title={`${bindData.length}???`}
                extra="????????????"
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
