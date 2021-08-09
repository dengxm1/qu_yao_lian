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
  Modal,
  Tabs,
  message,
  Select,
  Tooltip,
  Popconfirm,
  Radio
} from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import codeManageApi from 'api/codeManage';
import CodePreview from './codePreview';
import { getLodop, loadCLodop, needCLodop } from 'utils/print/LodopFuncs';
import printLogo from 'public/imgs/print.png';
import { urlDownload } from 'utils/download.js';
import './index.less';

const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
class CodeManger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
      selectedRowKeys: [],
      tableLoading: false,
      page: 1,
      pageSize: 10,
      dataSource: [],
      printDataSource: [],
      total: 0,
      codeId: '',
      isPreview: false,
      record: {},
      printModalVisible: false,
      imgList: [],
      detailData: {},
      codeType: 1
    };
    this.queryParams = {};
    this.querySelfParams = {};
  }

  componentDidMount() {
    this.fetchPage();
  }

  fetchPage = () => {
    const { page, pageSize, activeKey } = this.state;
    this.setState({
      tableLoading: true
    });
    codeManageApi
      .getBarCodeList({
        currentPage: page,
        pageSize,
        companyId: companyInfo.companyId,
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

  handleShowDetail = (id) => {
    this.setState(
      {
        codeId: id
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

  //查询
  onFinish = (values) => {
    this.queryParams = {};
    if (values.stockOutTime) {
      values.startDate = values.stockOutTime && values.stockOutTime[0].format('YYYY-MM-DD');
      values.endDate = values.stockOutTime && values.stockOutTime[1].format('YYYY-MM-DD');
      delete values.stockOutTime;
    }
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
        pageSize,
        selectedRowKeys: []
      },
      () => {
        this.fetchPage();
      }
    );
  };
  //700*500的码
  confirm = (record) => {
    this.printPageView(700, 500, record);
  };
  //500*300的码
  cancel = (record) => {
    this.printPageView(500, 300, record);
  };
  //打印
  printPageView = (W, H, record) => {
    const { currentTab } = this.state;
    if (record) {
      if (currentTab === '2') {
        this.setState(
          {
            printDataSource: [record]
          },
          () => {
            this.print(W, H);
          }
        );
      } else {
        codeManageApi
          .getBatchNumberList({
            productId: record.id
          })
          .then((res) => {
            if (res?.data?.data) {
              const data = res.data.data;
              this.setState(
                {
                  printDataSource: data.dataList
                },
                () => {
                  this.print(W, H);
                }
              );
            }
          });
      }
    }
    this.setState({
      tableLoading: false
    });
  };
  //打印
  print = (W, H) => {
    const globalVal =
      sessionStorage.getItem('config') && JSON.parse(sessionStorage.getItem('config'));
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
          const num = item.combinationBatchNumber ? '/bat/' + item.combinationBatchNumber : '';
          code = `${globalVal && globalVal.zslCodeUrl}/gtin/${item.combinationBarCode + num}`;

          const imgLeft = W === 700 ? '33%' : '33.5%';
          LODOP.ADD_PRINT_IMAGE('78%', imgLeft, 120, 60, `<img src=${printLogo}/>`);
          LODOP.SET_PRINT_STYLEA(0, 'HtmWaitMilSecs', 100); //延迟100毫秒
          LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); //图片显示原大小
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2);
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2);
          LODOP.SET_PRINT_STYLEA(0, 'TextNeatRow', true); //允许标点溢出，且英文单词拆开
          W == 700
            ? LODOP.ADD_PRINT_BARCODE('20%', '28%', 140, 140, 'QRCode', code)
            : LODOP.ADD_PRINT_BARCODE('10%', '28%', 100, 100, 'QRCode', code);
        }
        LODOP.PREVIEW(); //最后一个打印(预览)语句
      }
    } catch (err) {
      message.error(err);
    }
  };
  handleDownLoad = (record) => {
    const { currentTab } = this.state;
    if (currentTab == '1') {
      codeManageApi
        .downLoadExcel({
          productId: record.id
        })
        .then((res) => {
          let str = res.headers['content-disposition'];
          let index = str.indexOf('=');
          let eleLink = document.createElement('a');
          eleLink.download = str.slice(index + 1);
          eleLink.download = `${record.productName}.xls`;
          eleLink.style.display = 'none';
          eleLink.setAttribute('href', window.URL.createObjectURL(res.data));
          // 触发点击
          document.body.appendChild(eleLink);
          eleLink.click();
          // 然后移除
          document.body.removeChild(eleLink);
          this.fetchPage();
        });
    } else {
      codeManageApi
        .exportExcelNew({
          id: record.id
        })
        .then((res) => {
          urlDownload(res.config.url, `${record.productName}.xls`);
          this.fetchPage();
        });
    }
  };

  render() {
    const { page, pageSize, dataSource, total, codeId, isPreview } = this.state;

    const columns = [
      {
        title: '追溯码编号',
        key: 'productName',
        dataIndex: 'productName',
        fixed: 'left',
        onHeaderCell: () => ({
          style: { minWidth: 150 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        }),
        render: (text, record) => {
          return text && text.length > 25 ? (
            <Tooltip title={text}>{`${text.slice(0, 25)}...`}</Tooltip>
          ) : (
            text
          );
        }
      },
      {
        title: '药品通用名',
        key: 'productName',
        dataIndex: 'productName',
        fixed: 'left',
        onHeaderCell: () => ({
          style: { minWidth: 150 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        }),
        render: (text, record) => {
          return text && text.length > 25 ? (
            <Tooltip title={text}>{`${text.slice(0, 25)}...`}</Tooltip>
          ) : (
            text
          );
        }
      },
      {
        title: '药品条码',
        key: 'barCode',
        dataIndex: 'barCode',
        onHeaderCell: () => ({
          style: { minWidth: 150 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        })
      },
      {
        title: '药品类别',
        key: 'barCode',
        dataIndex: 'barCode',
        onHeaderCell: () => ({
          style: { minWidth: 150 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        })
      },
      {
        title: '药品规格',
        key: 'barCode',
        dataIndex: 'barCode',
        onHeaderCell: () => ({
          style: { minWidth: 150 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        })
      },
      {
        title: '生产企业',
        key: 'barCode',
        dataIndex: 'barCode',
        onHeaderCell: () => ({
          style: { minWidth: 150 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        })
      },
      {
        title: '操作人',
        key: 'userName',
        dataIndex: 'userName',
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
        title: '生成时间',
        key: 'createdTime',
        dataIndex: 'createdTime',
        onHeaderCell: () => ({
          style: { minWidth: 150 }
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap'
          }
        }),
        render: (text, record) => {
          return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>;
        }
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        onHeaderCell: () => ({
          style: { minWidth: 160 }
        }),
        render: (text, record) => (
          <Space size="middle">
            <a onClick={this.handleShowDetail.bind(this, record.id)}>查看</a>
            <Popconfirm
              title="请选择打印以下哪种类型尺寸的码！"
              onConfirm={() => {
                this.confirm(record);
              }}
              onCancel={() => {
                this.cancel(record);
              }}
              okText="70*50"
              cancelText="50*30"
            >
              <a>打印</a>
            </Popconfirm>
            <a
              onClick={() => {
                this.handleDownLoad(record);
              }}
            >
              下载
              {record.hasDownload ? (
                <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginLeft: 5 }} />
              ) : null}
            </a>
          </Space>
        )
      }
    ];

    return (
      <div>
        {isPreview && codeId ? (
          <CodePreview codeId={codeId} name="追溯码中心" onBack={this.handleBack} />
        ) : (
          <React.Fragment>
            <div style={{ display: 'flex', marginBottom: 30, marginTop: 10 }}>
              <Form layout="inline" onFinish={this.onFinish}>
                <Form.Item name="barCode">
                  <Input allowClear placeholder="药品通用名" />
                </Form.Item>
                <Form.Item name="barCode">
                  <Input allowClear placeholder="药品条码" />
                </Form.Item>
                <Form.Item name="barCode">
                  <Input allowClear placeholder="药品类别" />
                </Form.Item>
                <Form.Item name="barCode">
                  <Input allowClear placeholder="生产企业" />
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
            <Table
              rowKey="id"
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: true }}
              pagination={false}
            />
            <Pagination
              total={total}
              style={{ marginTop: '10px', float: 'right', paddingBottom: '20px' }}
              showTotal={(total) => `共${total}条`}
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
              onChange={(page, pageSize) => this.handleChangeTablePage(page, pageSize)}
              onShowSizeChange={(page, pageSize) => this.handleChangeTablePage(page, pageSize)}
              current={page}
              pageSize={pageSize}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default CodeManger;
