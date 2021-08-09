import React, { useState, useEffect } from 'react';
import { Button, Table, Divider, Pagination, message, Tooltip, Popconfirm } from 'antd';
import moment from 'moment';
import SearchForm from './searchForm';
import AddProduct from './addProduct';
import PutManageApi from 'api/putManage';
import './index.less';
const ProductOrder = (props) => {
  const [pageNum, setPageNum] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [total, setTotal] = useState(0);
  const [editProductData, setEditProductData] = useState({});
  const [productType, setProductType] = useState('');
  const [productVisible, setProductVisible] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const columns = [
    {
      title: '出库单号',
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
      }),
      render: (text, record) => {
        return text;
      }
    },
    {
      title: '供应商',
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
      }),
      render: (text, record) => {
        return text;
      }
    },
    {
      title: '出库类型',
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
      title: '出库日期',
      dataIndex: 'createdTime',
      key: 'createdTime',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      }
    },
    {
      title: '出库登记人',
      dataIndex: 'createdUserName',
      key: 'createdUserName',
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
      title: '状态',
      dataIndex: 'createdUserName',
      key: 'createdUserName',
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
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
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
            <a onClick={() => handleEdit(record)}>确认入库</a>
          </div>
        );
      }
    }
  ];

  const getData = (page, pageSize, searchData) => {
    const params = {
      pageNum,
      pageSize: pageSize,
      companyId: companyInfo.companyId,
      type: 3,
      ...searchData
    };
    PutManageApi.pendingOrderList(params).then((res) => {
      const { list, total } = res.data?.data || {};
      setTotal(total);
      setPageNum(pageNum);
      setDataSource(list);
      if (list.length == 0 && pageNum != 1) {
        setData(pageNum - 1);
      }
    });
  };
  useState(() => {
    getData(1, pageSize, {});
  }, []);
  const handleEdit = (e) => {
    setProductVisible(true);
    setProductType('edit');
    setEditProductData(e);
  };

  const setData = (e, size) => {
    setPageNum(e);
    setPageSize(size);
    getData(e, size, searchData);
  };
  const handleSearchData = (data) => {
    setSearchData(data);
  };
  const handleProductCancel = () => {
    setProductVisible(false);
    setProductType('');
  };

  return (
    <div className="prePackaged">
      <SearchForm getData={getData} getSearchData={handleSearchData} />
      <Table
        rowKey="id"
        className="table"
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
        onChange={(page, pageSize) => setData(page, pageSize)}
        onShowSizeChange={(page, pageSize) => setData(page, pageSize)}
        current={pageNum}
        pageSize={pageSize}
      />
      {/* 确认入库 */}
      <AddProduct
        editData={editProductData}
        handleCancel={handleProductCancel}
        visible={productVisible}
        type={productType}
        getData={getData}
      />
    </div>
  );
};
export default ProductOrder;
