import React, { useState, useEffect } from 'react';
import { Button, Table, Divider, Pagination, message, Tooltip, Popconfirm } from 'antd';
import SearchForm from './searchForm';
import AddProduct from './addProduct';
import UploadModal from 'components/UploadModal';
import informFillingApi from 'api/informFilling.js';

import './index.less';
const Supplier = (props) => {
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
      title: '主体名称',
      dataIndex: 'companyName',
      key: 'companyName',
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
      title: '统一社会信用代码',
      dataIndex: 'uniformCode',
      key: 'uniformCode',
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
      title: '主体地址',
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
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
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
      title: '联系电话',
      dataIndex: 'contactPersonTel',
      key: 'contactPersonTel',
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
  //获取列表数据
  const getData = (page, pageSize, searchData) => {
    const params = {
      pageNum: page,
      pageSize,
      ...searchData
    };
    informFillingApi.buyerList(params).then((res) => {
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
  const handleBatch = () => {
    setUploadVisible(true);
  };
  const handleUploadSubmit = (e) => {
    setFile(e);
  };
  const handleUploadCancel = () => {
    setUploadVisible(false);
  };
  //批量导入
  const submitUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    if (file) {
      informFillingApi.uploadBuyerModel(formData).then((res) => {
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
  //删除
  const handleDelete = (record) => {
    informFillingApi.buyerDelete({ companyId: record.companyId }).then((res) => {
      if (res?.data?.data) {
        message.success('删除成功');
        getData(pageNum, pageSize, searchData);
      } else {
        message.error(res.data.message);
      }
    });
  };
  //批量删除
  const handleDeleteAll = () => {
    console.log('selectedRowKeys__', selectedRowKeys);
    if (selectedRowKeys.length) {
      let ids = selectedRowKeys.join(',');
      informFillingApi.buyerDeleteList(ids).then((res) => {
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
        <Button type="primary" onClick={handleBatch}>
          批量导入
        </Button>
      </div>
      <Table
        rowKey="companyId"
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
export default Supplier;
