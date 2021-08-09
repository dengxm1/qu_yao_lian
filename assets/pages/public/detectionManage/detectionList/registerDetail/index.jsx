import React, { useEffect, useState } from 'react';
import { Drawer, Table, Button, Descriptions } from 'antd';
import inRegisterApi from 'api/inRegister.js';
import moment from 'moment';
import NameLabel from 'components/NameLabel';
import './index.less';

const RegisterDetail = (props) => {
  const { visible, data, cancel } = props;
  const [detailData, setDetailData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      fixed: 'left',
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
      title: '商品条码',
      dataIndex: 'barCode',
      key: 'barCode',
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
      title: '采购数量',
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
      title: '规格单位',
      dataIndex: 'spec',
      key: 'spec',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
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
            {record.specUnit}/{record.unit}
          </span>
        );
      }
    },
    // {
    //   title: '生产企业',
    //   dataIndex: 'fromCompanyName',
    //   key: 'fromCompanyName',
    //   onHeaderCell: () => ({
    //     style: { minWidth: 120 }
    //   }),
    //   onCell: () => ({
    //     style: {
    //       whiteSpace: 'nowrap'
    //     }
    //   })
    // },
    {
      title: '生产日期',
      dataIndex: 'productionDate',
      key: 'productionDate',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>;
      }
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
    }
  ];
  useEffect(() => {
    if (JSON.stringify(data) != '{}') {
      const params = {
        pageNum: 1,
        pageSize: 1,
        type: 2,
        productDetailId: data.productDetailId
      };
      inRegisterApi.getOrderList(params).then((res) => {
        if (res?.data?.data) {
          setDetailData(res.data.data.list[0]);
          setDataSource(res.data.data.list);
        }
      });
    }
  }, [data]);
  const handleClose = () => {
    cancel();
  };
  const {
    inOrderNo,
    orderTime,
    managerPerson,
    registerPerson,
    stockInType,
    stockInTime,
    saleName,
    saleUniformCode
  } = detailData;
  return (
    <Drawer
      title="入库明细"
      maskClosable={false}
      onClose={handleClose}
      width={1000}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right'
          }}
        >
          <Button type="primary" onClick={() => handleClose()}>
            确认
          </Button>
        </div>
      }
    >
      <NameLabel name="商品基本信息" />
      <Descriptions
        style={{ marginTop: '20px', marginLeft: '20px' }}
        column={{ xs: 1, sm: 1, md: 2 }}
      >
        <Descriptions.Item label="入库单号">{inOrderNo}</Descriptions.Item>
        <Descriptions.Item label="登记人">{registerPerson}</Descriptions.Item>
        <Descriptions.Item label="入库类型">{stockInType}</Descriptions.Item>
        <Descriptions.Item label="经办人">{managerPerson}</Descriptions.Item>
        <Descriptions.Item label="入库日期">
          {moment(stockInTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
      <NameLabel name="上游企业信息" />
      <Descriptions
        style={{ marginTop: '20px', marginLeft: '20px' }}
        column={{ xs: 1, sm: 1, md: 2 }}
      >
        <Descriptions.Item label="企业名称">{saleName}</Descriptions.Item>
        <Descriptions.Item label="统一社会信用代码">{saleUniformCode}</Descriptions.Item>
      </Descriptions>
      <NameLabel name="商品详情" />
      <Table
        style={{ marginTop: '20px' }}
        scroll={{ x: true }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </Drawer>
  );
};
export default RegisterDetail;
