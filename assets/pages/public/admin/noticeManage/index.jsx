import React from 'react';
import moment from 'moment';
import { Table, Form, DatePicker, Button, Input, Space, Popconfirm, message } from 'antd';
import adminApi from 'api/admin';
import NoticeModal from './noticeModal';
import NoticeDrawer from './noticeDrawer';
import NoticeUpdate from './update';

const { RangePicker } = DatePicker;

class NoticeManage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      dataSource: [],
      total: 0,
      page: 1,
      pageSize: 10,
      visible: false,
      drawerVisible: false,
      noticeRecord: null,
      isupdate: false
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
      .noticePage({
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

  hanleShowModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCloseModal = (needRefresh) => {
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
  };

  handleShowDrawer = (record) => {
    this.setState(
      {
        noticeRecord: record
      },
      () => {
        this.setState({
          drawerVisible: true
        });
      }
    );
  };
  handleShowUpdate = (record) => {
    this.setState(
      {
        noticeRecord: record
      },
      () => {
        this.setState({
          isupdate: true
        });
      }
    );
  };

  handleCloseDrawer = () => {
    this.setState(
      {
        drawerVisible: false,
        noticeRecord: null,
        isupdate: false
      },
      function() {
        this.fetchPage();
      }
    );
  };

  handleNoticeDel = (id) => {
    adminApi
      .noticeDel({
        id
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          message.success('删除成功');
          this.fetchPage();
        } else {
          message.error(res.data.message);
        }
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
  setData = () => {};
  render() {
    const {
      tableLoading,
      dataSource,
      total,
      page,
      pageSize,
      visible,
      drawerVisible,
      noticeRecord,
      isupdate
    } = this.state;
    const columns = [
      {
        title: '信息资源名称',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '类型',
        key: 'resourceType',
        dataIndex: 'resourceType',
        render: (text, record, index) => {
          return <span>{text === 1 ? '通知公告' : text === 2 ? '信息公告' : '常见问题'}</span>;
        }
      },
      {
        title: '格式',
        key: 'format',
        dataIndex: 'format',
        render: (text, record, index) => {
          return <span>{text === 1 ? '文件' : text === 2 ? '文本' : '富文本'}</span>;
        }
      },
      {
        title: '发布平台',
        key: 'platform',
        dataIndex: 'platform',
        render: (text, record, index) => {
          return <span>{text ? 'PC端' : '小程序'}</span>;
        }
      },
      {
        title: '排序',
        key: 'sequence',
        dataIndex: 'sequence'
      },
      {
        title: '创建时间',
        key: 'createdTime',
        dataIndex: 'createdTime',
        render: (text) => {
          return <span>{moment(text).format('YYYY-MM-DD')}</span>;
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          return (
            <Space>
              <a onClick={this.handleShowDrawer.bind(this, record)}>查看</a>
              {record.format != 1 ? (
                <a onClick={this.handleShowUpdate.bind(this, record)}>修改</a>
              ) : (
                ''
              )}
              <Popconfirm
                title="你确定要删除这条通知吗?"
                placement="topRight"
                onConfirm={this.handleNoticeDel.bind(this, record.id)}
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
      <div style={{ padding: 16 }}>
        {/* 新增弹窗 */}
        {visible ? (
          <NoticeModal
            visible={visible}
            noticeRecord={noticeRecord}
            onClose={this.handleCloseModal}
          />
        ) : (
          ''
        )}
        {/* 详情弹窗 */}
        <NoticeDrawer
          visible={drawerVisible}
          noticeRecord={noticeRecord}
          onClose={this.handleCloseDrawer}
        />
        {/* 修改弹窗*/}
        {isupdate ? (
          <NoticeUpdate
            visible={isupdate}
            noticeRecord={noticeRecord}
            onClose={this.handleCloseDrawer}
          />
        ) : (
          ''
        )}
        <h2>信息资源发布</h2>
        <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
          <Button type="primary" onClick={this.hanleShowModal} style={{ marginRight: 10 }}>
            新增
          </Button>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Form layout="inline" onFinish={this.onFinish}>
              <Form.Item name="name">
                <Input style={{ width: 160 }} placeholder="信息资源名称" />
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
          // loading={tableLoading}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            defaultCurrent: 1,
            total: total,
            current: page,
            pageSize: 10,
            onChange: this.handleChangeTablePage
          }}
        />
        {/* <Pagination
          total={total}
          showTotal={(total) => `共${total}条`}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          onChange={this.handleChangeTablePage}
          onShowSizeChange={this.handleChangeTablePage}
          current={page}
          pageSize={pageSize} */}
        {/* /> */}
      </div>
    );
  }
}

export default NoticeManage;
