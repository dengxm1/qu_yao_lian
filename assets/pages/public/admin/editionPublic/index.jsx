import React from 'react';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Tree,
  Table,
  Pagination,
  Popconfirm,
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
import EllipsisTooltip from '../../../../components/EllipsisTooltip';
import EditionDrawer from './editionModal';

const { RangePicker } = DatePicker;
const { TreeNode } = Tree;

class EditionPublic extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      dataSource: [],
      total: 0,
      page: 1,
      pageSize: 10,
      detailedRecord: {},
      isShow: false
    };
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
      .imprintPage({
        currentPage: page,
        pageSize: pageSize
        //source: 2
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
  onClose = (isUpdate) => {
    this.setState(
      {
        isShow: false
      },
      () => {
        if (isUpdate) {
          this.fetchPage();
        }
      }
    );
  };
  //跳转至查看详情页
  showModal = (data) => {
    console.log(data);
    this.setState({
      isShow: true,
      detailedRecord: data
    });
  };
  //删除数据
  handleEditionDel = (id) => {
    adminApi.imprintDelete({ id }).then((res) => {
      console.log(res);
      if (res.data.code == '0') {
        message.success('删除成功');
        this.fetchPage();
      } else {
        message.error(res.data.message);
      }
    });
  };

  render() {
    const that = this;
    const { tableLoading, page, pageSize, total, dataSource, detailedRecord, isShow } = this.state;

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
        title: '版本编号',
        key: 'version',
        dataIndex: 'version',
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
        title: '发布时间',
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
        title: '端口',
        key: 'source',
        dataIndex: 'source',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        }),
        render: (text, record, index) => {
          return <span>{text == 2 ? 'PC端' : '小程序'}</span>;
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
              <a onClick={() => that.showModal(record)}>详情</a>
              <Popconfirm
                title="你确定要删除这条通知吗?"
                placement="topRight"
                onConfirm={this.handleEditionDel.bind(this, record.id)}
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
      <div style={{ padding: 16, height: '100%' }}>
        <h2>版本发布</h2>
        {isShow ? (
          <EditionDrawer
            visible={isShow}
            detailedRecord={detailedRecord}
            onClose={this.onClose}
          ></EditionDrawer>
        ) : (
          ''
        )}
        <Button type="primary" onClick={this.showModal} style={{ margin: '10px 0' }}>
          新增版本发布内容
        </Button>
        <Row gutter={16} style={{ height: '100%', marginTop: 10 }}>
          <Col span={24}>
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default EditionPublic;
