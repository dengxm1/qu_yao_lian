import React, { useEffect, useState } from 'react';
import { Drawer, Table, message, Button } from 'antd';
import moment from 'moment';
import outRegisterApi from 'api/outRegister';
import SignatureApi from 'api/signature.js';
import './index.less';

const CertyModal = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  const { visible, onCancel, data } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [baseData, setBaseData] = useState({});

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: '商品条码',
      dataIndex: 'barCode',
      key: 'barCode'
    },
    {
      title: '生产企业',
      dataIndex: 'fromCompanyName',
      key: 'fromCompanyName',
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
      title: '规格单位',
      dataIndex: 'spec',
      key: 'spec',
      render: (text, record) => {
        return (
          <span>
            {text}
            {record.specUnit}/{record.uint}
          </span>
        );
      }
    },
    {
      title: '出库数量',
      dataIndex: 'num',
      key: 'num',
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
      title: '生产批次号',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
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
      title: '保质期',
      dataIndex: 'shelfLife',
      key: 'shelfLife',
      onHeaderCell: () => ({
        style: { minWidth: 100 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return (
          <span>
            {text}
            {record.dateUnit}
          </span>
        );
      }
    }
  ];

  useEffect(() => {
    if (JSON.stringify(data) != '{}') {
      getData();
    }
  }, [data]);

  const getData = () => {
    const params = {
      id: data.id,
      pageNum: pageNum,
      pageSize: 1000
    };
    outRegisterApi.getOutRegisterDetail(params).then((res) => {
      if (res?.data?.data) {
        setDataSource(res.data.data.page.list);
        setBaseData(res.data.data);
        setTotal(res.data.data.total);
      } else {
        message.error(res.data.msg || res.data.message);
      }
    });
  };

  const onClose = () => {
    onCancel();
  };
  const setData = (page) => {
    setPageNum(page);
    getData();
  };
  const handleCreateSignal = () => {
    const params = {
      orderid: data.id
    };
    SignatureApi.invoice(params).then((res) => {
      if (res?.data?.success) {
        onClose();
        message.success('销售凭证签章生成成功');
      }
    });
  };

  return (
    <Drawer
      title="销售凭证"
      width={1000}
      onClose={onClose}
      visible={visible}
      className="certy"
      maskClosable={false}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* <Button onClick={handleCreateSignal} type="primary" style={{ marginRight: '15px' }}>
            申请签章
          </Button> */}
          <Button onClick={onClose}>取消</Button>
        </div>
      }
      bodyStyle={{ paddingBottom: 80 }}
    >
      <div className="certyTitle">浙江省食品统一销售凭证</div>
      <p style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '600px' }}>
        销售日期:{baseData.stockOutTime ? moment(baseData.stockOutTime).format('YYYY-MM-DD') : ''}
      </p>
      <div className="sellerDiv">
        <div className="supplierDiv-company">
          <p className="supplierDiv-title">购货单位</p>
          <p className="supplierDiv-content ">{baseData.buyName}</p>
        </div>
        <div className="supplierDiv-people">
          <p className="supplierDiv-title">联系人</p>
          <p className="supplierDiv-content">{baseData.buyContact}</p>
        </div>
        <div className="supplierDiv-mobile">
          <p className="supplierDiv-title">联系方式</p>
          <p className="supplierDiv-content last">{baseData.buyContactTel}</p>
        </div>
      </div>
      <Table bordered columns={columns} dataSource={dataSource} pagination={false} />
      <div className="supplierDiv" style={{ borderBottom: '1px solid #000' }}>
        <div className="supplierDiv-company">
          <p className="supplierDiv-title">供货单位</p>
          <p className="supplierDiv-content ">{companyInfo.companyName}</p>
        </div>
        <div className="supplierDiv-people">
          <p className="supplierDiv-title">联系人</p>
          <p className="supplierDiv-content">{userInfo.userName}</p>
        </div>
        <div className="supplierDiv-mobile">
          <p className="supplierDiv-title">联系方式</p>
          <p className="supplierDiv-content last">{userInfo.mobile}</p>
        </div>
      </div>
      <div style={{ fontWeight: '500', paddingTop: 15 }}>
        备注:本证由浙江省市场监督管理局监制；仅限于浙江省范围内使用，与纸质凭证同效。
      </div>
    </Drawer>
  );
};

export default CertyModal;
