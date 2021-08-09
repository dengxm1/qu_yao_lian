import React from 'react';
import moment from 'moment';
import {
  Button,
  Form,
  Input,
  DatePicker,
  Table,
  Pagination,
  Space,
  message,
  Popconfirm
} from 'antd';
import { CheckCircleTwoTone, PrinterOutlined } from '@ant-design/icons';
import proCityLetCodeApi from 'api/proCityLetCode';
import codeManageApi from 'api/codeManage';
import Code from './code';
import CodePreview from './codePreview';
import { getLodop, loadCLodop, needCLodop } from 'utils/print/LodopFuncs';

class ProCityLetCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      page: 1,
      pageSize: 10,
      dataSource: [],
      printDataSource: [],
      total: 0,
      codeId: '',
      visible: false,
      isPreview: false,
      userId: '',
      userName: '',
      organId: '',
      organName: ''
    };
    this.queryParams = {};
  }

  componentDidMount() {
    if (window.location.search) {
      sessionStorage.setItem('tokenId', this.getQueryParams('userId'));
      sessionStorage.setItem('userName', decodeURI(this.getQueryParams('userName')));
      this.setState(
        {
          userId: this.getQueryParams('userId'),
          userName: decodeURI(this.getQueryParams('userName')),
          organId: this.getQueryParams('organId'),
          organName: decodeURI(this.getQueryParams('organName'))
        },
        () => {
          this.fetchPage();
        }
      );
    }
  }

  getQueryParams = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return '';
  };

  fetchPage = () => {
    const { page, pageSize, userId, userName, organId, organName } = this.state;
    this.setState({
      tableLoading: true
    });
    proCityLetCodeApi
      .page({
        currentPage: page,
        pageSize,
        userId,
        userName,
        organId,
        organName,
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
      codeVisible: true
    });
  };

  handleCloseDrawer = (needRefresh) => {
    this.setState(
      {
        codeVisible: false
      },
      () => {
        if (needRefresh) {
          this.fetchPage();
        }
      }
    );
  };

  handleShowDetail = (record) => {
    if (record.status === 1) {
      message.info('码正在生成中，请稍后重试');
      this.fetchPage();
    } else {
      this.setState(
        {
          codeId: record.id
        },
        () => {
          this.setState({
            isPreview: true
          });
        }
      );
    }
  };

  handleShowPreview = (id) => {
    this.setState(
      {
        codeId: id,
        codeVisible: false
      },
      () => {
        this.setState({
          isPreview: true
        });
      }
    );
  };

  handleBack = () => {
    this.setState(
      {
        codeId: '',
        isPreview: false
      },
      () => {
        this.fetchPage();
      }
    );
  };

  onFinish = (values) => {
    console.log('Finish:', values);
    this.queryParams = {};
    values.date = values.date && values.date.format('YYYY-MM-DD');
    for (let key in values) {
      if (values[key]) {
        console.log(values[key]);
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
  //700*500的码
  confirm = (id) => {
    this.printPageView(700, 500, id);
  };
  //500*300的码
  cancel = (id) => {
    this.printPageView(500, 300, id);
  };
  //打印
  printPageView = (W, H, id) => {
    codeManageApi
      .codePage({
        applyId: id,
        currentPage: '',
        pageSize: '',
        type: ''
      })
      .then((res) => {
        const { data } = res.data;
        if (data) {
          this.setState(
            {
              printDataSource: data.dataList
            },
            () => {
              this.print(W, H);
            }
          );
        }
        this.setState({
          tableLoading: false
        });
      });
  };
  //打印
  print = (W, H) => {
    try {
      let LODOP = getLodop();
      if (LODOP.VERSION) {
        let code = '';
        LODOP.PRINT_INIT(''); //打印初始化
        LODOP.SET_PRINT_PAGESIZE(1, W, H, '5mm'); //这里3表示纵向打印且纸高“按内容的高度”；500表示纸宽50mm；20表示页底空白2mm
        W == 700 ? LODOP.SET_PRINT_STYLE('FontSize', 12) : LODOP.SET_PRINT_STYLE('FontSize', 8); //设置对象风格
        LODOP.SET_PRINT_STYLE('Bold', 1);
        LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true); //设置以纸张边缘为基点
        for (let item of this.state.printDataSource) {
          LODOP.NewPage();
          code = 'http://zjll.zjamr.zj.gov.cn/' + item.code;
          if (item.productType) {
            LODOP.ADD_PRINT_TEXT('2%', 0, '100%', '10%', '浙冷链');
          } else {
            LODOP.ADD_PRINT_TEXT('10%', 0, '100%', '10%', '浙冷链');
          }
          W == 700
            ? LODOP.SET_PRINT_STYLEA(0, 'FontSize', 15)
            : LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11);
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2);
          LODOP.ADD_PRINT_TEXT('16%', 0, '100%', '10%', item.productType);
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2);
          LODOP.ADD_PRINT_TEXT('27%', '10%', '15%', '', '支付宝扫码');
          LODOP.SET_PRINT_STYLEA(0, 'TextNeatRow', true); //允许标点溢出，且英文单词拆开
          W == 700
            ? LODOP.ADD_PRINT_BARCODE('28%', '28%', 140, 140, 'QRCode', code)
            : LODOP.ADD_PRINT_BARCODE('28%', '28%', 100, 100, 'QRCode', code);
          //LODOP.ADD_PRINT_BARCODE('27%', '28%', width, height, 'QRCode', code);
          //LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 7); //设置二维码版本为7
          LODOP.ADD_PRINT_TEXT('28%', '75%', '30%', '', '溯源码');
          W == 700
            ? LODOP.ADD_PRINT_TEXT('46%', '75%', '25%', '', item.code)
            : LODOP.ADD_PRINT_TEXT('46%', '75%', '30%', '', item.code);
          LODOP.SET_PRINT_STYLEA(0, 'TextNeatRow', true); //允许标点溢出，且英文单词拆开
        }
        LODOP.PREVIEW(); //最后一个打印(预览)语句
      }
    } catch (err) {
      message.error(err);
    }
  };

  render() {
    const {
      tableLoading,
      page,
      pageSize,
      dataSource,
      total,
      codeId,
      codeRecord,
      codeVisible,
      isPreview,
      userId,
      userName,
      organId,
      organName
    } = this.state;

    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => {
          return <span>{(page - 1) * 10 + index + 1}</span>;
        }
      },
      {
        title: '领码数量',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: '领码人',
        dataIndex: 'userName',
        key: 'userName'
      },
      {
        title: '领码时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        render: (text) => {
          return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a onClick={this.handleShowDetail.bind(this, record)}>查看</a>
            <a
              onClick={() => {
                // window.open(`${proCityLetCodeApi.downloadExcelUrl}?onlineApplyId=${record.id}`);
                // setTimeout(() => {
                //   this.fetchPage();
                // }, 1000);
                if (record.status === 1) {
                  message.info('码正在生成中，请稍后重试');
                  this.fetchPage();
                } else {
                  proCityLetCodeApi
                    .downloadExcel({
                      onlineApplyId: record.id
                    })
                    .then(() => {
                      this.fetchPage();
                    });
                }
              }}
            >
              下载
              {record.hasDownload ? (
                <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginLeft: 5 }} />
              ) : null}
            </a>
            <Popconfirm
              title="请选择打印以下哪种类型尺寸的码！"
              onConfirm={() => {
                this.confirm(record.id);
              }}
              onCancel={() => {
                this.cancel(record.id);
              }}
              okText="70*50"
              cancelText="50*30"
            >
              <a>打印码</a>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <div style={{ padding: 16 }}>
        {/* 领码弹窗 */}
        <Code
          visible={codeVisible}
          // codeRecord={codeRecord}
          userId={userId}
          userName={userName}
          organId={organId}
          organName={organName}
          onShowPreview={this.handleShowPreview}
          onClose={this.handleCloseDrawer}
        />
        {isPreview && codeId ? (
          <CodePreview codeId={codeId} onBack={this.handleBack} />
        ) : (
          <React.Fragment>
            <h2>省市领码</h2>
            <p style={{ paddingLeft: 8, marginTop: 10, marginBottom: 15 }}>
              省市领码功能仅对市场监督管理局员工账号开放，用于市场监督管理局为企业或个人统一领码。
            </p>
            <div style={{ display: 'flex', marginBottom: 10 }}>
              <Button type="primary" onClick={this.hanleShowModal} style={{ marginRight: 10 }}>
                省市领码
              </Button>
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Form layout="inline" onFinish={this.onFinish}>
                  <Form.Item name="userName">
                    <Input style={{ width: 120 }} placeholder="领取人" />
                  </Form.Item>
                  <Form.Item name="date">
                    <DatePicker placeholder="领取时间" />
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
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default ProCityLetCode;
