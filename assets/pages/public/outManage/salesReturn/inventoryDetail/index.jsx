import React, { useState, useEffect } from 'react';
import { Button, Table, Badge, Row, Tooltip, Col, Descriptions, Drawer, message } from 'antd';
import moment from 'moment';
import NameLabel from 'components/NameLabel';
import outRegisterApi from 'api/outRegister';
import './index.less';

const InventoryDetail = (props) => {
  const { cancel, visible, data } = props;
  const [selectedRowKeys, setselectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [baseData, setBaseData] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [searchData, setSearchData] = useState({});
  const [total, setTotal] = useState(0);
  const columns = [
    {
      title: '产品名称',
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
      title: '是否过期',
      dataIndex: 'changeColor',
      key: 'changeColor',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        if (record.changeColor == 'default')
          return (
            <Tooltip title={`过期时间:${moment(record.shelfDate).format('YYYY-MM-DD')}`}>
              <div>
                <Badge status="success"></Badge>
                <span>正常</span>
              </div>
            </Tooltip>
          );
        if (record.changeColor == 'orange')
          return (
            <Tooltip title={`过期时间:${moment(record.shelfDate).format('YYYY-MM-DD')}`}>
              <div>
                <Badge status="warning"></Badge>
                <span>即将过期</span>
              </div>
            </Tooltip>
          );
        if (record.changeColor == 'red')
          return (
            <Tooltip title={`过期时间:${moment(record.shelfDate).format('YYYY-MM-DD')}`}>
              <div>
                <Badge status="error"></Badge>
                <span>已过期</span>
              </div>
            </Tooltip>
          );
      }
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
            {record.specUnit}/{record.uint}
          </span>
        );
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
    }
  ];

  const getData = () => {
    const params = {
      id: data.id,
      pageNum: pageNum,
      pageSize: 10,
      ...searchData
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

  useEffect(() => {
    if (JSON.stringify(data) != '{}') {
      getData();
    }
  }, [data]);
  const setData = (page) => {
    setPageNum(page);
    getData();
  };

  const {
    buyName,
    buyUniformCode,
    buyContact,
    buyContactTel,
    buyCompanyType,
    stockOutTime,
    managerPerson,
    outOrderNo,
    managerPhone,
    remark
  } = baseData;
  return (
    <Drawer title="出库明细" maskClosable={false} visible={visible} onClose={cancel} width={1000}>
      <div className="inventoryDetail">
        <NameLabel name="基本信息" />
        <Descriptions
          style={{ marginTop: '20px', marginLeft: '20px' }}
          column={{ xs: 1, sm: 1, md: 2 }}
        >
          {/* <Descriptions.Item label="登记人">{managerPhone}</Descriptions.Item> */}
          <Descriptions.Item label="经办人">{managerPerson}</Descriptions.Item>
          <Descriptions.Item label="经办人联系方式">{managerPhone}</Descriptions.Item>
          <Descriptions.Item label="出库日期">
            {stockOutTime ? moment(stockOutTime).format('YYYY-MM-DD HH:mm:ss') : ''}
          </Descriptions.Item>
          <Descriptions.Item label="出库单号">{outOrderNo}</Descriptions.Item>
        </Descriptions>
        <NameLabel name="下游信息" />
        <Descriptions
          style={{ marginTop: '20px', marginLeft: '20px' }}
          column={{ xs: 1, sm: 1, md: 2 }}
        >
          {buyName ? (
            <>
              <Descriptions.Item label="下游企业名称">{buyName}</Descriptions.Item>
              <Descriptions.Item label="统一社会信用代码">{buyUniformCode}</Descriptions.Item>
              <Descriptions.Item label="企业类型">
                {buyCompanyType == '1' ? '生产企业' : buyCompanyType == '2' ? '流通企业' : ''}
              </Descriptions.Item>
              <Descriptions.Item label="企业联系人">{buyContact}</Descriptions.Item>
              <Descriptions.Item label="联系手机号">{buyContactTel}</Descriptions.Item>
            </>
          ) : (
            <>
              <Descriptions.Item label="企业类型">个人</Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="备注">{remark}</Descriptions.Item>
        </Descriptions>
        <NameLabel name="产品明细" />
        <Table
          className="table"
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: true }}
          pagination={{
            defaultCurrent: 1,
            pageSize: 10,
            total: total,
            onChange: (page, pageSize) => {
              setData(page);
            }
          }}
        />
      </div>
    </Drawer>
  );
};

export default InventoryDetail;
