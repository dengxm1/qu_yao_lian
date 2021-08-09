import React from 'react';
import moment from 'moment';
import {
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Table,
  Pagination,
  Space,
  Tabs,
  message,
  Popconfirm
} from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { getLodop, loadCLodop, needCLodop } from 'utils/print/LodopFuncs';
import CodeModal from './code';
import CodeImage from '../compontent/codeImage';
import codeManageApi from 'api/codeManage';

class Relevance extends React.Component {
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
      detailData: null,
      codeImageVisible: false,
      codeVisible: false
    };
    this.queryParams = {};
  }

  componentDidMount() {
    this.fetchPage();
  }

  fetchPage = () => {
    const { page, pageSize, activeKey } = this.state;
    this.setState({
      tableLoading: true
    });
    // 领取空码
    codeManageApi
      .getBarCodeList({
        currentPage: page,
        pageSize,
        companyId: sessionStorage.getItem('companyId'),
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
  //查看溯源码图片
  handleShowDetail = (detailData) => {
    this.setState(
      {
        codeId: detailData.id,
        detailData: detailData
      },
      () => {
        this.setState({
          codeImageVisible: true
        });
      }
    );
  };
  //申请溯源码显示
  hanleShowModal = () => {
    this.setState({
      codeVisible: true
    });
  };
  //申请溯源码隐藏
  handleCloseModal = (needRefresh) => {
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
  //列表查询
  onFinish = (values) => {
    this.queryParams = {};
    if (values.date) {
      values.date = values.date && values.date.format('YYYY-MM-DD');
    }
    if (values.time) {
      values.startDate = values.time && values.time[0].format('YYYY-MM-DD');
      values.endDate = values.time && values.time[1].format('YYYY-MM-DD');
      delete values.time;
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
    const globalVal =
      localStorage.getItem('globalValue') && JSON.parse(localStorage.getItem('globalValue'));
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
          code = `${globalVal && globalVal.codeUrl}${item.code}`;
          if (item.productType) {
            LODOP.ADD_PRINT_TEXT('2%', 0, '100%', '10%', globalVal && globalVal.codeTitle);
          } else {
            LODOP.ADD_PRINT_TEXT('10%', 0, '100%', '10%', globalVal && globalVal.codeTitle);
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
      codeVisible,
      codeImageVisible,
      detailData
    } = this.state;

    // 空码
    const emptyColumns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => {
          return <span>{(page - 1) * 10 + index + 1}</span>;
        }
      },
      {
        title: '追溯码编号',
        dataIndex: 'productType',
        key: 'productType'
      },
      {
        title: '用途',
        dataIndex: 'productType',
        key: 'productType'
      },
      {
        title: '药品类型',
        dataIndex: 'productType',
        key: 'productType'
      },
      {
        title: '药品通用名',
        dataIndex: 'productType',
        key: 'productType'
      },
      {
        title: '药品条码',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: '申请人',
        dataIndex: 'userName',
        key: 'userName'
      },
      {
        title: '生成时间',
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
              <a>打印</a>
            </Popconfirm>
            <a
              onClick={() => {
                codeManageApi
                  .emptyCodeDownload({
                    id: record.id
                  })
                  .then(() => {
                    this.fetchPage();
                  });
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
        {/* 申请溯源码 */}
        <CodeModal visible={codeVisible} onClose={this.handleCloseModal} />
        {/* 查看溯源码图片 */}
        {codeImageVisible ? (
          <CodeImage
            visible={codeImageVisible}
            record={detailData}
            onClose={() => this.setState({ codeImageVisible: false })}
          ></CodeImage>
        ) : null}
        <React.Fragment>
          <div style={{ display: 'flex' }}>
            <Form layout="inline" onFinish={this.onFinish}>
              <Form.Item name="userName">
                <Input allowClear style={{ width: 120 }} placeholder="追溯码用途" />
              </Form.Item>
              <Form.Item name="userName">
                <Input allowClear style={{ width: 120 }} placeholder="药品通用名" />
              </Form.Item>
              <Form.Item name="userName">
                <Input allowClear style={{ width: 120 }} placeholder="药品条码" />
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
          <div className="operate">
            <Button type="primary" onClick={this.hanleShowModal} style={{ marginRight: 10 }}>
              申请追溯码
            </Button>
          </div>
          <Table
            rowKey="id"
            loading={tableLoading}
            columns={emptyColumns}
            dataSource={dataSource}
            pagination={false}
          />
          <Pagination
            total={total}
            style={{ marginTop: '10px', float: 'right', paddingBottom: '20px' }}
            showTotal={(total) => `共${total}条`}
            showSizeChanger
            pageSizeOptions={['10', '20', '50', '100']}
            onChange={this.handleChangeTablePage}
            onShowSizeChange={this.handleChangeTablePage}
            current={page}
            pageSize={pageSize}
          />
        </React.Fragment>
      </div>
    );
  }
}

export default Relevance;
