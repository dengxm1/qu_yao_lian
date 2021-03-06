import React from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Pagination,
  Space,
  Form,
  Card,
  Tree,
  Empty,
  Spin,
  Menu,
  Modal,
  message
} from 'antd';
import { SnippetsOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import adminApi from 'api/admin';
import MenuModal from './menuModal';
import './index.less';

const { TreeNode } = Tree;
const { confirm } = Modal;

class MenuManage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      treeLoading: false,
      treeList: [],
      treeData: [],
      rightClickNodeTreeItem: null,
      pid: null,
      id: null,
      record: null,
      selectTreeKeys: [],
      tableLoading: false,
      dataSource: [],
      total: 0,
      page: 1,
      pageSize: 10
    };
    this.queryParams = {};
  }

  componentDidMount() {
    this.fetchTree();
    this.fetchPage();

    window.oncontextmenu = function(e) {
      e.preventDefault();
    };
  }

  componentWillUnmount() {
    window.oncontextmenu = function(e) {
      return true;
    };
  }

  fetchTree = () => {
    this.setState({
      treeLoading: true
    });
    adminApi.moduleTree().then((res) => {
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

  getTreeData = (data) => {
    return (
      data &&
      data.map((item) => {
        if (item.children) {
          return {
            title: item.title,
            key: item.id,
            pid: item.pid,
            id: item.id,
            value: item,
            children: this.getTreeData(item.children)
          };
        }
        return {
          title: item.title,
          key: item.id,
          id: item.id,
          pid: item.pid,
          value: item
        };
      })
    );
  };

  fetchPage = (type) => {
    const { page, pageSize, pid, id } = this.state;
    this.setState({
      tableLoading: true
    });
    let api = null;
    if (type !== 'search') {
      api = adminApi.modulePage;
    } else {
      api = adminApi.getModuleByTitle;
    }

    api({
      currentPage: page,
      pageSize: pageSize,
      pid,
      id,
      ...this.queryParams
    }).then((res) => {
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

  handleSaveOrder = () => {};

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
        this.fetchPage('search');
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

  onMouseDown = (e) => {
    if (e.button !== 2) {
      //  ???????????????????????????????????????
    } else {
      const className = e.target.getAttribute('class');
      if (className === 'ant-tree-title' || className === 'iconfont' || e.target.tagName === 'SPAN')
        return;
      const mouseLocation = {
        pageX: e.clientX,
        pageY: e.clientY
      };
      setTimeout(() => {
        this.setState({
          rightClickNodeTreeItem: {
            ...mouseLocation,
            id: null
          }
        });
      }, 200);
    }
  };

  setNull = () => {
    this.setState({
      rightClickNodeTreeItem: null
    });
  };

  treeRightClick = ({ event, node }) => {
    this.setState({
      rightClickNodeTreeItem: {
        pageX: event.clientX,
        pageY: event.clientY,
        id: node.key,
        record: node.value,
        categoryName: node.title
      },
      selectedKeys: [node.key]
    });
  };

  getNodeTreeRightClickMenu = () => {
    const { pageX, pageY, id, record, categoryName } = { ...this.state.rightClickNodeTreeItem };
    const tmpStyle = {
      position: 'absolute',
      left: `${pageX - 220}px`,
      top: `${pageY - 100}px`,
      backgroundColor: '#e6f7ff',
      color: '#999',
      borderRadius: 5,
      zIndex: 99,
      boxShadow: '0 0 5px #999'
    };
    const menu = (
      <Menu style={tmpStyle} className="self-right-menu">
        <Menu.Item key="1" onClick={() => this.showTreeModal(false, id)}>
          ??????
        </Menu.Item>
        <Menu.Item key="2" onClick={() => this.showTreeModal(true, id, record)}>
          ??????
        </Menu.Item>
        <Menu.Item key="3" onClick={() => this.handleDelTreeItem(id)}>
          ??????
        </Menu.Item>
      </Menu>
    );
    const menuOnlyAdd = (
      <Menu style={tmpStyle} className="self-right-menu">
        <Menu.Item key="1" onClick={() => this.showTreeModal(false, id)}>
          ??????
        </Menu.Item>
      </Menu>
    );

    return this.state.rightClickNodeTreeItem == null ? null : id == null ? menuOnlyAdd : menu;
  };

  showTreeModal = (isEdit, pid, record = null, id) => {
    this.setState(
      {
        isEdit,
        pid,
        id,
        record
      },
      () => {
        this.setState({
          visible: true
        });
      }
    );
  };

  handleCloseModal = (needRefresh) => {
    this.setState(
      {
        visible: false
      },
      () => {
        if (needRefresh) {
          this.fetchTree();
          this.fetchPage();
        }
      }
    );
  };

  handleDelTreeItem = (id) => {
    let _this = this;
    confirm({
      title: '????????????????????????????',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        adminApi
          .moduleDelById({
            id
          })
          .then((res) => {
            if (res.data.code === '0') {
              message.success('????????????');
              _this.fetchTree();
              _this.fetchPage();
            } else {
              message.error(res.data.message);
            }
          });
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  handleClickTreeItem = (selectedKeys, e) => {
    if (selectedKeys.length) {
      this.setState(
        {
          pid: e.node.pid,
          id: e.node.id,
          selectTreeKeys: selectedKeys
        },
        () => {
          this.fetchPage();
        }
      );
    }
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

  render() {
    const {
      isEdit,
      visible,
      pid,
      record,
      treeLoading,
      treeList,
      selectTreeKeys,
      tableLoading,
      page,
      pageSize,
      total,
      dataSource
    } = this.state;

    const columns = [
      {
        title: '??????',
        key: 'index',
        onHeaderCell: () => ({
          style: { minWidth: 80 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 80
          }
        }),
        render: (text, record, index) => {
          return <span>{(page - 1) * pageSize + index + 1}</span>;
        }
      },
      // {
      //   title: '?????????',
      //   key: 'name',
      //   dataIndex: 'name',
      //   onHeaderCell: () => ({
      //     style: { minWidth: 120 }
      //   }),
      //   onCell: () => ({
      //     style: {
      //       whiteSpace: 'nowrap',
      //       maxWidth: 300
      //     }
      //   })
      // },
      {
        title: '????????????',
        key: 'title',
        dataIndex: 'title',
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
        title: '????????????',
        key: 'path',
        dataIndex: 'path',
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
        title: '????????????',
        key: 'enable',
        dataIndex: 'enable',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        }),
        render: (text) => {
          return <span>{text ? '??????' : '?????????'}</span>;
        }
      },
      {
        title: '??????',
        key: 'action',
        fixed: 'right',
        align: 'center',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        }),
        render: (text, record, index) => {
          return (
            <Space>
              <a onClick={this.showTreeModal.bind(this, true, record.pid, record)}>??????</a>
              <a onClick={this.handleDelTreeItem.bind(this, record.id)}>??????</a>
            </Space>
          );
        }
      }
    ];

    return (
      <div style={{ padding: 16 }}>
        <h2>????????????</h2>
        {/* ?????? */}
        {visible ? (
          <MenuModal
            isEdit={isEdit}
            visible={visible}
            pid={pid}
            record={record}
            onClose={this.handleCloseModal}
          />
        ) : null}
        <Row gutter={16} onClick={this.setNull} style={{ display: 'flex', marginTop: 10 }}>
          <Col span={6} onMouseDown={this.onMouseDown} style={{ flex: 1 }}>
            <Card className="treeCard">
              <div className="treeCardHeader" onClick={this.handleSaveOrder}>
                <span>?????????????????????</span>
              </div>
              <div className="treeCardBody">
                {this.getNodeTreeRightClickMenu()}
                {treeList && treeList.length == 0 ? (
                  <Empty description="????????????" style={{ marginTop: 30 }}></Empty>
                ) : (
                  // <Spin spinning={treeLoading}>
                  <Tree
                    showLine
                    showIcon
                    defaultExpandAll
                    selectedKeys={selectTreeKeys}
                    onSelect={this.handleClickTreeItem}
                    onRightClick={this.treeRightClick}
                    treeData={this.getTreeData(treeList)}
                  >
                    {/* {this.digui(treeList)} */}
                  </Tree>
                  // </Spin>
                )}
              </div>
            </Card>
          </Col>
          <Col span={18} style={{ flex: 1 }}>
            <Card className="subMenuCard">
              <div className="searchDiv">
                <Form layout="inline" onFinish={this.onFinish}>
                  <Form.Item name="title">
                    <Input allowClear style={{ width: 160 }} placeholder="????????????" />
                  </Form.Item>
                  <Form.Item shouldUpdate>
                    {() => (
                      <Button type="primary" htmlType="submit">
                        ??????
                      </Button>
                    )}
                  </Form.Item>
                </Form>
              </div>
              <Table
                rowKey="id"
                // loading={tableLoading}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                scroll={{ x: true }}
              />
              <Pagination
                total={total}
                style={{ marginTop: '10px', float: 'right', paddingBottom: '20px' }}
                showTotal={(total) => `???${total}???`}
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

export default MenuManage;
