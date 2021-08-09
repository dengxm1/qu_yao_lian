import React from 'react';
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
  Popconfirm,
  message
} from 'antd';
import {
  EditOutlined,
  SettingOutlined,
  DeleteOutlined,
  SnippetsOutlined,
  FormOutlined
} from '@ant-design/icons';
import adminApi from 'api/admin';
const { TreeNode } = Tree;
import './index.less';
import RoleManagePreView from './preView';
import RoleManagePower from './power';
import MemberManage from './memberManage';

class RoleManage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      dataSource: [],
      total: 0,
      page: 1,
      pageSize: 10,
      treeData: [],
      selectTreeKeys: [],
      selectRole: {},
      isshowPreView: false,
      isshowPower: false,
      detail: {},
      selPowerData: {},
      rowId: '',
      memberVisible: false,
      memberData: {}
    };
    this.queryParams = {};
  }
  componentDidMount() {
    this.fetchPage();
    //this.fetchTree();
  }
  //获取树结构数据
  fetchTree = () => {
    const roleId = this.state.selectRole.id;

    this.setState({
      treeLoading: true
    });
    adminApi
      .roleModuleTree({
        roleId
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          this.setState(
            {
              treeData: data.dataList
            },
            () => {
              let selkey = [];
              for (let item of data.dataList) {
                if (item.hasSelect) {
                  selkey.push(JSON.stringify(item));
                }
                if (item.children && item.children.length > 0) {
                  for (let index of item.children) {
                    if (index.hasSelect) {
                      selkey.push(JSON.stringify(index));
                    }
                  }
                }
              }

              this.setState({
                selectTreeKeys: selkey
              });
            }
          );
        } else {
          message.error(res.data.message);
        }
        this.setState({
          treeLoading: false
        });
      });
  };

  //转换书结构数据格式
  digui = (data) => {
    let self = this;
    return (
      data &&
      data.map((item) => (
        <TreeNode
          key={JSON.stringify(item)}
          value={item.id}
          title={
            <React.Fragment>
              <p title={item.title} className="treeName">
                <span>{item.title}</span>
                <span style={{ paddingLeft: '15px', color: 'red' }}>
                  {'【' + item.accessName ? item.accessName : '暂无权限' + '】'}
                </span>
                {/* <span onClick={() => self.toPower(item)}>
                  <FormOutlined style={{ paddingLeft: '15px', color: '#1890ff' }} />
                </span> */}
              </p>
            </React.Fragment>
          }
          icon={(node) => {
            return <SnippetsOutlined />;
          }}
          dataRef={item}
          isLeaf={item.isLeaf}
        >
          {item.children && item.children.length !== 0 ? self.digui(item.children) : null}
        </TreeNode>
      ))
    );
  };
  //获取查询列表数据
  fetchPage = () => {
    const { page, pageSize } = this.state;
    this.setState({
      treeLoading: true
    });
    adminApi
      .rolePage({
        currentPage: page,
        pageSize: pageSize,
        ...this.queryParams
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          this.setState(
            {
              dataSource: data.dataList,
              total: data.totalCount,
              selectRole: data.dataList.length > 0 ? data.dataList[0] : {}
            },
            () => {
              this.fetchTree();
            }
          );
        } else {
          message.error(res.data.message);
        }
        this.setState({
          treeLoading: false
        });
      });
  };

  //页面数据显示数量的切换
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
  //获取from查询条件
  onFinish = (values) => {
    for (let key in values) {
      if (values[key]) {
        this.queryParams[key] = values[key];
      } else {
        this.queryParams[key] = '';
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
  //添加按钮事件
  add = () => {
    this.setState({
      isshowPreView: true,
      detail: {
        isadd: true
      }
    });
  };
  //编辑按钮事件
  edit = (text, record, index) => {
    this.setState({
      isshowPreView: true,
      detail: {
        isadd: false,
        value: text
      }
    });
  };
  //查看权限所对应目录结构
  see = (text) => {
    this.setState(
      {
        selectRole: text
      },
      () => {
        this.fetchTree();
      }
    );
  };
  //删除按钮事件
  delete = (text) => {
    let values = {
      id: text
    };
    adminApi.roleDelete(values).then((res) => {
      if (res.data.code == '0') {
        message.success('删除成功');
        this.fetchPage();
      } else {
        message.error(res.data.message);
      }
    });
  };
  //编辑菜单权限
  toPower = (item) => {
    this.setState({
      isshowPower: true,
      selPowerData: item
    });
  };
  //树结构选中数据
  handleClickTreeItem = (selectedKeys, e) => {
    let selectTreeKeys = [];
    for (let item of e.checkedNodes) {
      selectTreeKeys.push(JSON.stringify(item.dataRef));
    }
    this.setState({
      selectTreeKeys: selectTreeKeys
    });
  };

  // 角色模块授权
  roleModule = () => {
    const { selectTreeKeys } = this.state;
    const roleId = this.state.selectRole.id;
    this.setState({
      treeLoading: true
    });
    let selectTreeKeysnew = selectTreeKeys.map((item) => {
      item = JSON.parse(item);
      item.hasSelect = true;
      return item;
    });
    adminApi
      .roleModule({
        roleId: roleId,
        modules: selectTreeKeysnew
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0') {
          message.success('修改成功');
        } else {
          message.error(res.data.message);
        }
        this.setState({
          treeLoading: false
        });
      });
  };
  updataData = () => {
    this.setState(
      {
        isshowPreView: false
      },
      () => {
        this.fetchPage();
      }
    );
  };
  jsonchange = (data, result) => {
    for (let item in data) {
      if (this.state.selPowerData.id == data[item].id) {
        data[item] = Object.assign({}, data[item], result);
      }
      if (data[item].children) {
        this.jsonchange(data[item].children);
      }
    }
  };
  updataDataPower = (value) => {
    if (value) {
      const values = JSON.parse(value.access);
      let result = { accessId: values.id, accessName: values.name };
      let isdata = false;
      let data = this.state.selectTreeKeys;
      let treeData = this.state.treeData;
      for (let item in data) {
        if (this.state.selPowerData.id == JSON.parse(data[item]).id) {
          data[item] = JSON.stringify(Object.assign({}, JSON.parse(data[item]), result));
          isdata = true;
        }
      }

      if (isdata) {
        for (let index in treeData) {
          if (this.state.selPowerData.id == treeData[index].id) {
            treeData[index] = Object.assign({}, treeData[index], result);
          }
          if (treeData[index].children && treeData[index].children.length > 0) {
            this.jsonchange(treeData[index].children, result);
          }
        }
        this.setState({
          selectTreeKeys: data,
          treeData: treeData
        });
      } else {
        message.error('修改失败，请先选中该数据');
      }
      this.setState({
        isshowPower: false
      });
    } else {
      this.setState({
        isshowPower: false
      });
    }
  };
  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };
  handleMemberCancel = (data) => {
    this.setState({
      memberVisible: false
    });
  };
  handleMember = (data) => {
    this.setState({
      memberVisible: true,
      memberData: data
    });
  };

  render() {
    const {
      tableLoading,
      dataSource,
      page,
      pageSize,
      total,
      treeData,
      selectTreeKeys,
      selectRole,
      isshowPreView,
      isshowPower,
      memberVisible,
      memberData,
      detail
    } = this.state;
    const columns = [
      {
        title: '角色名称',
        key: 'name',
        dataIndex: 'name',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 300
          }
        })
      },
      {
        title: '角色别名',
        key: 'alias',
        dataIndex: 'alias',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 300
          }
        })
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
            <Space className="roleButs">
              <a
                onClick={() => {
                  this.handleMember(record);
                }}
              >
                成员管理
              </a>
              <a
                onClick={() => {
                  this.edit(text, record, index);
                }}
              >
                编辑
              </a>
              {/* <a
                onClick={() => {
                  this.see(text, record, index);
                }}
              >
                <SettingOutlined />
              </a> */}
              <Popconfirm
                title="你确定要删除这条数据吗?"
                placement="topRight"
                onConfirm={this.delete.bind(this, text.id)}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </Space>
          );
        }
      }
    ];
    return (
      <div style={{ padding: 16, height: '100%' }} className="rolemanage">
        <h2>角色管理</h2>
        {isshowPreView ? (
          <RoleManagePreView
            detail={detail}
            isshowPreView={isshowPreView}
            onchange={(value) => {
              this.updataData();
            }}
          ></RoleManagePreView>
        ) : (
          ''
        )}
        {isshowPower ? (
          <RoleManagePower
            isshowPower={isshowPower}
            onchange={(value) => {
              this.updataDataPower(value);
            }}
          ></RoleManagePower>
        ) : (
          ''
        )}
        <Row gutter={16} style={{ height: '100%', marginTop: 10 }}>
          <Col span={10}>
            <Card style={{ height: '100%' }}>
              <div style={{ width: '100%' }}>
                <Form layout="inline" onFinish={this.onFinish}>
                  <Form.Item name="name">
                    <Input style={{ width: 160 }} placeholder="角色名称" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      style={{ marginLeft: '15px', color: '#1890ff', borderColor: '#1890ff' }}
                      type="sub"
                      htmlType="submit"
                    >
                      查询
                    </Button>
                  </Form.Item>
                  <Form.Item shouldUpdate style={{ position: 'absolute', right: 0, margin: 0 }}>
                    {() => (
                      <Button type="primary" onClick={this.add} htmlType="button">
                        添加
                      </Button>
                    )}
                  </Form.Item>
                </Form>
                <Table
                  size="small"
                  rowKey="id"
                  loading={tableLoading}
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  scroll={{ x: true }}
                  onRow={(record, index) => {
                    return {
                      onClick: () => this.see(record)
                    };
                  }}
                  rowClassName={this.setRowClassName}
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
                  pageSize={pageSize}
                />
              </div>
            </Card>
          </Col>
          <Col span={14}>
            <Card style={{ height: '100%' }}>
              <div className="roleRightTitle">
                <p>
                  <span style={{ paddingRight: '15px', color: '#1890ff' }}>
                    {selectRole ? selectRole.name : ''}
                  </span>
                  <span>处于可编辑状态，勾选后可保存</span>
                </p>
                <Button type="primary" onClick={this.roleModule}>
                  保存
                </Button>
              </div>
              {treeData.length > 0 ? (
                <Tree
                  multiple={true}
                  checkable
                  showIcon
                  defaultExpandAll
                  checkedKeys={selectTreeKeys}
                  onCheck={this.handleClickTreeItem}
                >
                  {this.digui(treeData)}
                </Tree>
              ) : (
                ''
              )}
            </Card>
          </Col>
        </Row>
        <MemberManage
          visible={memberVisible}
          onCancel={this.handleMemberCancel}
          data={memberData}
          handleData={() => this.fetchPage()}
        />
      </div>
    );
  }
}

export default RoleManage;
