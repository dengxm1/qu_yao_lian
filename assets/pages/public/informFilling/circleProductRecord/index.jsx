import React, { useState, useEffect } from 'react';
import { Button, Table, Divider, Pagination, message, Tooltip, Popconfirm } from 'antd';
import moment from 'moment';
import { urlDownload } from 'utils/download.js';
import UploadModal from 'components/UploadModal';
import BatchImportBtn from 'components/batchImportBtn';
import SearchForm from './searchForm';
import AddProduct from './addProduct';
import informFillingApi from 'api/informFilling.js';
import './index.less';

const CircleProductRecord = (props) => {
  const [pageNum, setPageNum] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [total, setTotal] = useState(0);
  const [editProductData, setEditProductData] = useState({});
  const [productType, setProductType] = useState('');
  const [productVisible, setProductVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    {
      title: '药品通用名',
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
        return text.length > 25 ? (
          <Tooltip title={text}>{`${text.slice(0, 25)}...`}</Tooltip>
        ) : (
          text
        );
      }
    },
    {
      title: '药品商品名',
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
        return text.length > 25 ? (
          <Tooltip title={text}>{`${text.slice(0, 25)}...`}</Tooltip>
        ) : (
          text
        );
      }
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
      title: '产地',
      dataIndex: 'address',
      key: 'address',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return <span>{(text && typeof text == 'string' && text.split(',').join('')) || '-'}</span>;
      }
    },
    {
      title: '生产企业',
      dataIndex: 'address',
      key: 'address',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return <span>{(text && typeof text == 'string' && text.split(',').join('')) || '-'}</span>;
      }
    },
    {
      title: '登记时间',
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
      title: '登记人',
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
      title: '是否草稿',
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
            <a onClick={() => handleEdit(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record)}>
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  const getData = (page, pageSize, searchData) => {
    const params = {
      pageNum: page,
      pageSize,
      ...searchData
    };

    informFillingApi.productList(params).then((res) => {
      if (res?.data?.data) {
        setDataSource(res.data.data.list);
        setPageNum(page);
        setTotal(res.data.data.total);
        if (res.data.data.list.length == 0 && pageNum != 1) {
          setData(pageNum - 1, pageSize);
        }
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

  const handleDelete = (record) => {
    informFillingApi.productDelete({ id: record.id }).then((res) => {
      if (res?.data?.data) {
        message.success('删除成功');
        getData(pageNum, pageSize, searchData);
      } else {
        message.error(res.data.message);
      }
    });
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
  const handleAddProduct = () => {
    setProductVisible(true);
    setProductType('add');
  };
  const handleDownLoad = () => {
    // informFillingApi.downloadProductModel().then((res) => {
    //   downLoad(res, '生产产品备案导入模板(带星号项必填).xls');
    // });
    urlDownload(
      '/api/source/excel/downloadProductRecordModel',
      '成品管理导入模板(带星号项必填).xls'
    );
  };
  const handleBatch = () => {
    setUploadVisible(true);
  };
  const handleUploadSubmit = (e) => {
    setFile(e);
  };
  const handleUploadCancel = () => {
    setUploadVisible(false);
  };
  const submitUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    if (file) {
      informFillingApi.uploadProductModel(formData).then((res) => {
        if (res?.data?.success) {
          message.success('批量导入成功');
          setUploadVisible(false);
          setFile([]);
          getData(1, pageSize);
        } else {
          message.error(res.data.msg);
        }
      });
    } else {
      message.error('上传文件不能为空');
    }
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };
  //批量删除
  const handleDeleteAll = () => {
    console.log('selectedRowKeys__', selectedRowKeys);
    if (selectedRowKeys.length) {
      let ids = selectedRowKeys.join(',');
      informFillingApi.productDeleteList(ids).then((res) => {
        if (res?.data?.data) {
          message.success('批量删除成功');
          getData(pageNum, pageSize, searchData);
        } else {
          message.error(res.data.message);
        }
      });
    } else {
      message.warning('请至少选中一条数据进行批量删除操作');
    }
  };
  return (
    <div className="prePackaged">
      <SearchForm getData={getData} getSearchData={handleSearchData} />
      <div className="operate">
        <Popconfirm title="确定删除吗?" onConfirm={() => handleDeleteAll()}>
          <Button>批量删除</Button>
        </Popconfirm>
        <Button type="primary" onClick={handleAddProduct}>
          新增
        </Button>
        <BatchImportBtn handleBatch={handleBatch} handleDownLoad={handleDownLoad} />
      </div>
      <Table
        rowKey="id"
        className="table"
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: true }}
        rowSelection={rowSelection}
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
      {/* 批量导入 */}
      <UploadModal
        onSubmit={handleUploadSubmit}
        visible={uploadVisible}
        cancel={handleUploadCancel}
        submitUpload={submitUpload}
      />
      {/* 新增--编辑 */}
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
export default CircleProductRecord;
