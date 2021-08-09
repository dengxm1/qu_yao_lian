import React, { useState, useEffect } from 'react';
import { Table, Tooltip, Pagination } from 'antd';
import { inject, observer } from 'mobx-react';
import SearchForm from './searchForm';
import { Link } from 'react-router-dom/es/index';
import AddAndUpdate from './addAndUpdate';
import inventoryApi from 'api/inventory.js';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import LossModal from '../lossModal';
import './index.less';
let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const Manage = (props) => {
  const { searchPage, handleSearchPage } = props.InventoryManage;
  const { searchDatas, saveSearchData } = props.InventoryManage;

  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRowKeys, setselectedRowKeys] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [lossVisible, setLossVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const columns = [
    {
      title: '成品名称',
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
        return text && text.length > 25 ? (
          <Tooltip title={text}>{text ? `${text.slice(0, 25)}...` : ''}</Tooltip>
        ) : (
          text
        );
      }
    },
    {
      title: '成品条码',
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
    //   title: '单位',
    //   dataIndex: 'unit',
    //   key: 'unit',
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
      title: '库存类型',
      dataIndex: 'stockInType',
      key: 'stockInType',
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
          <div style={{ display: 'flex' }}>
            <Link
              to={{
                pathname: routerPrefix + '/public/inventoryManage/product/productDetail',
                state: record
              }}
              className="seeMore"
            >
              <div>查看</div>
            </Link>
          </div>
        );
      }
    }
  ];
  const handleLossModalCancel = () => {
    setLossVisible(false);
  };
  const getData = (pageNum, size, searchData) => {
    const params = {
      pageNum: pageNum,
      pageSize: size,
      stockInType: '0',
      uniformCode: companyInfo.uniformCode,
      ...searchData
    };

    inventoryApi.queryStockList(params).then((res) => {
      if (res) {
        setDataSource(res.data.data.list);
        setPageNum(pageNum);
        setTotal(res.data.data.total);
        if (res.data.data.list.length == 0 && pageNum != 1) {
          setData(pageNum - 1, pageSize);
        }
      }
    });
  };
  useEffect(() => {
    setSearchData({});
    saveSearchData({});
    getData(1, pageSize, {});
  }, []);
  const handleCancel = () => {
    setModalVisible(false);
  };

  const onSelectChange = (selectedRowKeys) => {
    setselectedRowKeys(selectedRowKeys);
  };

  const setData = (page, size) => {
    setPageNum(page);
    setPageSize(size);
    getData(page, size, searchData);
    handleSearchPage(page);
  };
  const handleSearchData = (data) => {
    setSearchData(data);
  };

  return (
    <div className="seller">
      <SearchForm getData={getData} searchData={handleSearchData} />
      <div className="operate"></div>
      <Table
        className="table"
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: true }}
        locale={locale}
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
      <AddAndUpdate visible={modalVisible} handleCancel={handleCancel} />
      <LossModal visible={lossVisible} handleClose={handleLossModalCancel} />
    </div>
  );
};

export default inject('InventoryManage')(observer(Manage));
