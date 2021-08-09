import React from 'react';
import { Card, Table, Modal, Divider, Pagination, Button, message, Popconfirm } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { getLodop, loadCLodop, needCLodop } from 'utils/print/LodopFuncs';
import printLogo from 'public/imgs/print.png';
import CodeImage from '../compontent/codeImage';
import codeManageApi from 'api/codeManage';

import './index.less';
// 查看详情---追溯码中心

const gridStyle = {
  width: '20%',
  textAlign: 'center'
};

const baseURL =
  globalConfig && globalConfig.apiPrefix
    ? process.env.PLACE === 'wuhan'
      ? globalConfig.apiPrefix.ellApi
      : globalConfig.apiPrefix.default
    : '/api'; //请求前缀，根据实际情况修改

class CodePreview extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      codeList: [],
      dataSource: [],
      page: 1,
      total: 10,
      imgs: [],
      codeVisible: false,
      tableLoading: false,
      detailData: {}
    };
    this.canvas = null;
  }

  componentDidMount() {
    this.fetchPage();
  }

  fetchPage = () => {
    const { page } = this.state;
    const { codeId, type, name } = this.props;
    this.setState({
      tableLoading: true
    });
    codeManageApi
      .getBatchNumberList({
        productId: codeId,
        currentPage: page,
        pageSize: 10,
        type
      })
      .then((res) => {
        const { data } = res.data;
        if (data) {
          data.dataList.map((ele, index) => {
            this.setState({
              dataSource: data.dataList,
              total: data.totalCount
            });
          });
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
  //下载码
  handleDownloadExcel = () => {
    const { codeId, name } = this.props;

    codeManageApi
      .downLoadExcel({
        productId: codeId
      })
      .then(() => {
        console.log('下载上链码成功');
      });
  };
  //700*500的码
  confirm = (e) => {
    this.printPageView(700, 500);
  };
  //500*300的码
  cancel = (e) => {
    this.printPageView(500, 300);
  };
  //打印
  printPageView = (W, H) => {
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

        for (let item of this.state.dataSource) {
          LODOP.NewPage();
          // code = `${globalVal && globalVal.codeUrl}${item.code}`;
          code = `${globalVal && globalVal.zslCodeUrl}/gtin/${item.combinationBarCode}/bat/${
            item.batchNumber
          }`;
          const imgLeft = W === 700 ? '33%' : '33.5%';
          LODOP.ADD_PRINT_IMAGE('78%', imgLeft, 120, 60, `<img src=${printLogo}/>`);
          LODOP.SET_PRINT_STYLEA(0, 'HtmWaitMilSecs', 100); //延迟100毫秒
          LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); //图片显示原大小
          // LODOP.ADD_PRINT_TEXT('82%', 0, '100%', '10%', '浙食链');
          W == 700
            ? LODOP.SET_PRINT_STYLEA(0, 'FontSize', 15)
            : LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11);
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2);
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2);
          LODOP.SET_PRINT_STYLEA(0, 'TextNeatRow', true); //允许标点溢出，且英文单词拆开
          W == 700
            ? LODOP.ADD_PRINT_BARCODE('20%', '28%', 140, 140, 'QRCode', code)
            : LODOP.ADD_PRINT_BARCODE('10%', '28%', 100, 100, 'QRCode', code);
          //LODOP.ADD_PRINT_BARCODE('27%', '28%', width, height, 'QRCode', code);
          //LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 7); //设置二维码版本为7
          // LODOP.ADD_PRINT_TEXT('28%', '75%', '30%', '', '溯源码');
          LODOP.SET_PRINT_STYLEA(0, 'TextNeatRow', true); //允许标点溢出，且英文单词拆开
        }
        LODOP.PREVIEW(); //最后一个打印(预览)语句
      }
    } catch (err) {
      message.error(err);
    }
  };
  //查看溯源码图片
  handleCodeImg = (record) => {
    this.setState({
      codeVisible: true,
      detailData: record
    });
  };
  handleDownLoad = (record) => {
    const params = {
      barCode: record.combinationBarCode,
      batchNumber: record.batchNumber
    };
    codeManageApi.downloadQrCode(params).then((res) => {
      if (res?.data?.success) {
        message.success('下载成功');
      }
    });
  };
  render() {
    const { detailData, codeVisible, dataSource, page, total } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => {
          return <span>{(page - 1) * 10 + index + 1}</span>;
        }
      },
      {
        title: '生产批次号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
        render: (text, record) => {
          return <span>{text}</span>;
        }
      },
      {
        title: '操作',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
        render: (text, record) => {
          return (
            <div>
              <a onClick={() => this.handleCodeImg(record, detailData)}>查看</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDownLoad(record)}>下载追溯码</a>
            </div>
          );
        }
      }
    ];

    return (
      <div>
        {/* 查看溯源码图片 */}
        {codeVisible ? (
          <CodeImage
            visible={codeVisible}
            record={detailData}
            onClose={() => this.setState({ codeVisible: false })}
          ></CodeImage>
        ) : null}

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
          <ArrowLeftOutlined
            onClick={() => this.props.onBack()}
            style={{ marginRight: 10, fontSize: 16 }}
          />
          <h3>追溯码详情</h3>
        </div>
        <div
          className="detail_div"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '20px 0'
          }}
        >
          <div className="detail_p">
            <p>药品通用名：黄芪</p>
            <p>药品条码：2423847273487244</p>
            <p>生产企业：束带结发沙发上胜多负少胜多负少</p>
          </div>
          <div className="operate">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={this.handleDownloadExcel}
              style={{ marginBottom: 10 }}
            >
              下载码
            </Button>
            <Popconfirm
              title="请选择打印以下哪种类型尺寸的码！"
              onConfirm={this.confirm}
              onCancel={this.cancel}
              okText="70*50"
              cancelText="50*30"
            >
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                style={{ marginBottom: 10, marginLeft: 15 }}
              >
                打印码
              </Button>
            </Popconfirm>
          </div>
        </div>
        <Table
          rowKey="id"
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
      </div>
    );
  }
}

export default CodePreview;
