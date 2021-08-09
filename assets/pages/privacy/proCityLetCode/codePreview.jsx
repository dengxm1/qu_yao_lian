import React from 'react';
import { Card, Table, Pagination, Button, message, Popconfirm } from 'antd';
import codeDemo from 'public/imgs/codeDemo.png';
import codeManageApi from 'api/codeManage';
import proCityLetCodeApi from 'api/proCityLetCode';
import { ArrowLeftOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { getLodop, loadCLodop, needCLodop } from 'utils/print/LodopFuncs';

const gridStyle = {
  width: '20%',
  textAlign: 'center'
};

class CodePreview extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      codeList: [],
      dataSource: [],
      page: 1,
      total: 10,
      tableLoading: false
    };
  }

  componentDidMount() {
    this.fetchPage();
  }

  fetchPage = () => {
    const { page } = this.state;
    const { codeId, type } = this.props;
    this.setState({
      tableLoading: true
    });
    codeManageApi
      .codePage({
        applyId: codeId,
        currentPage: page,
        pageSize: 10,
        type
      })
      .then((res) => {
        const { data } = res.data;
        if (data) {
          this.setState({
            dataSource: data.dataList,
            total: data.totalCount
          });
        }
        this.setState({
          tableLoading: false
        });
      });
  };

  handleDownloadExcel = () => {
    const { codeId } = this.props;
    // window.open(`${proCityLetCodeApi.downloadExcelUrl}?onlineApplyId=${codeId}`);
    proCityLetCodeApi.downloadExcel({
      onlineApplyId: codeId
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
    const { codeList, dataSource, page, total, tableLoading } = this.state;

    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => {
          return <span>{(page - 1) * 10 + index + 1}</span>;
        }
      },
      {
        title: '溯源码编号',
        dataIndex: 'code',
        key: 'code'
      }
    ];
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
          <ArrowLeftOutlined
            onClick={() => this.props.onBack()}
            style={{ marginRight: 10, fontSize: 18 }}
          />
          <h2>领码详情</h2>
        </div>
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
            // onClick={() => {
            //   this.printPageView();
            // }}
            style={{ marginBottom: 10, marginLeft: 15 }}
          >
            打印码
          </Button>
        </Popconfirm>
        <Card bordered={false} style={{ marginBottom: 15 }}>
          {dataSource &&
            dataSource.map((item, i) => {
              return (
                <Card.Grid id={`codeGrid${i}`} key={item.id} style={gridStyle}>
                  <img
                    key={item.id}
                    src={`/api/source/apply/record/downloadCode?id=${item.id}`}
                    style={{ width: '100%' }}
                  />
                </Card.Grid>
              );
            })}
        </Card>
        <Table
          rowKey="id"
          loading={tableLoading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
        <Pagination
          current={page}
          total={total}
          showSizeChanger={false}
          showTotal={(total) => `共${total}条`}
          onChange={this.handleChangeTablePage}
        />
      </div>
    );
  }
}

export default CodePreview;
