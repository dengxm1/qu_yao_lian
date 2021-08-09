import React from 'react';
import { Button, Form, Input, Table, Pagination, Space, Popconfirm, message } from 'antd';
import PowerModal from './powerModal';
import adminApi from 'api/admin';

class PowerManage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      dataSource: [],
      total: 0,
      page: 1,
      pageSize: 10,
      visible: false,
      record: null
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
      .accessPage({
        currentPage: page,
        pageSize: pageSize,
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

  handleDelPower = (id) => {
    adminApi
      .accessDelById({
        id
      })
      .then((res) => {
        if (res.data.code === '0') {
          message.success('删除成功');
          this.fetchPage();
        } else {
          message.error(res.data.message);
        }
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

  hanleShowModal = () => {
    this.setState({
      isEdit: false,
      visible: true
    });
  };

  handleEditPower = (record) => {
    this.setState(
      {
        isEdit: true,
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
        isEdit: false,
        record: null
      },
      () => {
        this.setState(
          {
            visible: false
          },
          () => {
            if (needRefresh) {
              this.fetchPage();
            }
          }
        );
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

  render() {
    const { tableLoading, dataSource, total, page, pageSize, isEdit, visible, record } = this.state;

    const columns = [
      {
        title: '序号',
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
      {
        title: '权限名称',
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
        title: '权限可操作方法',
        key: 'access',
        dataIndex: 'access',
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
        title: '备注',
        key: 'memo',
        dataIndex: 'memo',
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
              <a onClick={this.handleEditPower.bind(this, record)}>编辑</a>
              <Popconfirm
                placement="topRight"
                title="您确认要删除该权限吗?"
                onConfirm={this.handleDelPower.bind(this, record.id)}
                okText="确认"
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
      <div style={{ padding: 16 }}>
        <h2>权限管理</h2>
        <PowerModal
          isEdit={isEdit}
          visible={visible}
          record={record}
          onClose={this.handleCloseModal}
        />
        <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
          <Button type="primary" onClick={this.hanleShowModal} style={{ marginRight: 10 }}>
            新增权限
          </Button>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Form layout="inline" onFinish={this.onFinish}>
              <Form.Item name="name">
                <Input allowClear style={{ width: 160 }} placeholder="权限名称" />
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
      </div>
    );
  }
}

export default PowerManage;
