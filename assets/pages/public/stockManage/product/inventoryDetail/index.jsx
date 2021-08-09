import React, { useState, useEffect } from 'react';
import { Table, Divider, Badge, Descriptions, Tooltip, Pagination } from 'antd';
import moment from 'moment';
import inventoryApi from 'api/inventory.js';
import DealModal from './dealModal';
import DetailModal from './detailModal';
import './index.less';

const InventoryDetail = (props) => {
  const propsState = props.history.location.state;
  const [dataSource, setDataSource] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchData, setSearchData] = useState({});
  const [dealVisible, setDealVisible] = useState(false);
  const [dealData, setDealData] = useState({});
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [epOrderProductDo, setEpOrderProductDo] = useState({});
  const columns = [
    {
      title: '成品名称',
      dataIndex: 'productName',
      fixed: 'left',
      key: 'productName',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
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
      render: (text, record) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>;
      }
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
      title: '状态',
      dataIndex: 'statusLabel',
      key: 'statusLabel',
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
      }),
      render: (text, record) => {
        return <span>{text}</span>;
      }
    },
    {
      title: '库存量',
      dataIndex: 'stockNum',
      key: 'stockNum',
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
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      fixed: 'right',
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
          <div>
            <a onClick={() => handelDeal(record)}>库存处理</a>
            <Divider type="vertical" />
            <a onClick={() => handleDetail(record)}>库存明细</a>
          </div>
        );
      }
    }
  ];

  const getData = (pageNum, size, searchData) => {
    const params = {
      productId: propsState.productId,
      pageNum,
      pageSize: size,
      ...searchData
    };
    inventoryApi.zslStockRecord(params).then((res) => {
      if (res) {
        setDataSource(res.data.data.pageInfo.list);
        setEpOrderProductDo(res.data.data.epOrderProductDo);
        setTotal(res.data.data.pageInfo.total);
      }
    });
  };

  useEffect(() => {
    getData(1, pageSize, searchData);
  }, [propsState.id]);

  const handelDeal = (record) => {
    setDealVisible(true);
    setDealData(record);
  };
  const handleDealCancel = () => {
    setDealVisible(false);
  };

  const handleDetail = (record) => {
    setDetailData(record);
    setDetailVisible(true);
  };

  const handleDetailCancel = () => {
    setDetailVisible(false);
  };

  const handleBack = () => {
    props.history.goBack();
  };
  const handleSearchData = (data) => {
    setSearchData(data);
  };
  const handlePageChange = (e, size) => {
    setPageNum(e);
    setPageSize(size);
    getData(e, size, searchData);
  };
  return (
    <div className="inventoryDetail">
      <a className="inventoryDetail-return" onClick={handleBack}>
        {'< 返回列表'}
      </a>
      <Descriptions title="商品信息">
        <Descriptions.Item label="商品条码">{epOrderProductDo.barCode}</Descriptions.Item>
        <Descriptions.Item label="登记日期">
          {moment(epOrderProductDo.createdTime).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label="保质期">
          {epOrderProductDo.shelfLife} {epOrderProductDo.dateUnit}
        </Descriptions.Item>
        {/* <Descriptions.Item label="单位">{epOrderProductDo.unit}</Descriptions.Item> */}
        <Descriptions.Item label="成品名称">{epOrderProductDo.productName}</Descriptions.Item>
        {/* <Descriptions.Item label="生产企业">{epOrderProductDo.fromCompanyName}</Descriptions.Item> */}
        <Descriptions.Item label="规格单位">
          {epOrderProductDo.spec}
          {epOrderProductDo.specUnit}/{epOrderProductDo.unit}
        </Descriptions.Item>
      </Descriptions>
      <Table
        className="table"
        dataSource={dataSource}
        scroll={{ x: true }}
        columns={columns}
        pagination={false}
      />
      <Pagination
        total={total}
        style={{ marginTop: '10px', float: 'right', paddingBottom: '20px' }}
        showTotal={(total) => `共${total}条`}
        showSizeChanger
        pageSizeOptions={['10', '20', '50', '100']}
        onChange={(page, pageSize) => handlePageChange(page, pageSize)}
        onShowSizeChange={(page, pageSize) => handlePageChange(page, pageSize)}
        current={pageNum}
        pageSize={pageSize}
      />
      <DealModal
        getData={getData}
        visible={dealVisible}
        data={epOrderProductDo}
        dealData={dealData}
        cancel={handleDealCancel}
      />
      <DetailModal visible={detailVisible} data={detailData} cancel={handleDetailCancel} />
    </div>
  );
};

export default InventoryDetail;
