import React from 'react';
import moment from 'moment';
import { Row, Col, Table, Pagination, Space, message } from 'antd';
import adminApi from 'api/admin';
import EditionModal from './editionModal';
import { ArrowLeftOutlined } from '@ant-design/icons';

class EditionMore extends React.PureComponent {
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
        pageSize: pageSize,
        source: 2
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
  //跳转至查看详情页
  showModal = (data) => {
    console.log(data);
    this.setState({
      isShow: true,
      detailedRecord: data
    });
  };
  //返回按钮
  toback = () => {
    this.props.history.goBack();
  };
  //关闭查看模态框
  onClose = () => {
    this.setState({
      isShow: false
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
        })
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
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
          <ArrowLeftOutlined onClick={this.toback} style={{ marginRight: 10, fontSize: 18 }} />
          <h2>版本发布记录</h2>
        </div>
        {isShow ? (
          <EditionModal
            visible={isShow}
            detailedRecord={detailedRecord}
            onClose={this.onClose}
          ></EditionModal>
        ) : (
          ''
        )}
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

export default EditionMore;
