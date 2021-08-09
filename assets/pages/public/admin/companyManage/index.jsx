import React from 'react';
import moment from 'moment';
import { Form, Input, Select, Button, Table, Pagination, message } from 'antd';
import adminApi from 'api/admin';
import EllipsisTooltip from 'components/EllipsisTooltip';

const { Option } = Select;

class CompanyManage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      page: 1,
      pageSize: 10,
      dataSource: [],
      total: 0
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
      .companyPage({
        pageNum: page,
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

  render() {
    const { tableLoading, page, pageSize, dataSource, total } = this.state;

    const columns = [
      {
        title: '企业名称/组织名称',
        key: 'companyName',
        dataIndex: 'companyName',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 400
          }
        }),
        render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
      },
      {
        title: '企业类型',
        key: 'companyType',
        dataIndex: 'companyType',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        }),
        render: (text) => {
          return <span>{text === '1' ? '生产企业' : '流通企业'}</span>;
        }
      },
      {
        title: '统一社会信用代码',
        key: 'uniformCode',
        dataIndex: 'uniformCode',
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
        title: '法定代表人/姓名',
        key: 'uniformName',
        dataIndex: 'uniformName',
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
        title: '经营场所',
        key: 'businessPlace',
        dataIndex: 'businessPlace',
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
        title: '经营范围',
        key: 'businessScope',
        dataIndex: 'businessScope',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 250
          }
        }),
        render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
      },
      {
        title: '营业期限',
        key: 'businessTerm',
        dataIndex: 'businessTerm',
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
        title: '企业联系人',
        key: 'contactPerson',
        dataIndex: 'contactPerson',
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
        title: '联系人手机号',
        key: 'contactPersonTel',
        dataIndex: 'contactPersonTel',
        onHeaderCell: () => ({
          style: { minWidth: 120 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        })
      },
      // {
      //   title: '是否已更新',
      //   key: 'hasUpdate',
      //   dataIndex: 'hasUpdate',
      //   onHeaderCell: () => ({
      //     style: { minWidth: 120 }
      //   }),
      //   onCell: () => ({
      //     style: {
      //       whiteSpace: 'nowrap'
      //     }
      //   }),
      //   render: (text) => {
      //     return <span>{text ? '是' : '否'}</span>;
      //   }
      // },
      {
        title: '创建时间',
        key: 'createdTime',
        dataIndex: 'createdTime',
        fixed: 'right',

        onHeaderCell: () => ({
          style: { minWidth: 180 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        }),
        render: (text) => {
          return <span>{moment(text).format('YYYY-MM-DD')}</span>;
        }
      }
    ];

    return (
      <div style={{ padding: 16 }}>
        <h2>企业管理</h2>
        <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Form layout="inline" onFinish={this.onFinish}>
              <Form.Item name="companyName">
                <Input allowClear style={{ width: 160 }} placeholder="企业名称" />
              </Form.Item>
              <Form.Item name="uniformCode">
                <Input allowClear style={{ width: 160 }} placeholder="统一社会信用代码" />
              </Form.Item>
              <Form.Item name="companyType" initialValue={undefined}>
                <Select allowClear placeholder="企业类型" style={{ width: 120 }}>
                  <Option key="0" value="1">
                    生产企业
                  </Option>
                  <Option key="2" value="2">
                    流通企业
                  </Option>
                </Select>
              </Form.Item>
              {/* <Form.Item name="contactPersonTel">
                <Input allowClear style={{ width: 160 }} placeholder="联系人手机号" />
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
          loading={tableLoading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: true }}
        />
        <Pagination
          total={total}
          showTotal={(total) => `共${total}条`}
          style={{ marginTop: '10px', float: 'right', paddingBottom: '20px' }}
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

export default CompanyManage;
