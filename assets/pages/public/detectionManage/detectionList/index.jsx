import React, { useState, useEffect } from 'react';
import { Table, Tooltip, Divider } from 'antd';
import SearchForm from './searchForm';
import inRegisterApi from 'api/inRegister.js';
import RegisterDetail from './registerDetail';
import DetailModal from './detailModal';
import AddAndUpdate from './addAndUpdate';
import moment from 'moment';

import './index.less';

const DetectionList = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState({});

  const [modalType, setModalType] = useState(null);
  const [pageSize, setPageSize] = useState('10');
  const [pageNum, setPageNum] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [detailData, setDetailData] = useState({});
  const [detailVisible, setDetailVisible] = useState(false);
  const [recordData, setRecordData] = useState({});
  const [recordVisible, setRecordlVisible] = useState(false);
  const [total, setTotal] = useState(0);

  const columns = [
    {
      title: '入库单号',
      dataIndex: 'inOrderNo',
      key: 'inOrderNo',
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
        return <a onClick={() => handleWatch(record)}>{text}</a>;
      }
    },
    {
      title: '药品通用名',
      dataIndex: 'productName',
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
          <Tooltip title={text}>{text ? `${text.slice(0, 25)}...` : ''}</Tooltip>
        ) : (
          text
        );
      }
    },
    {
      title: '药品条码',
      dataIndex: 'barCode',
      key: 'barCode',
      width: '11.1%'
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
      title: '药品来源',
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
      title: '凭证状态',
      dataIndex: 'certificateGenarateStatus',
      key: 'certificateGenarateStatus',
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
      title: '是否面向公众',
      dataIndex: 'registerPerson',
      key: 'registerPerson',
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
      title: '更新时间',
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
      title: '操作',
      dataIndex: 'enterpriseName',
      fixed: 'right',
      key: 'enterpriseName',
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
          <div>
            {record.certificateGenarateStatus == '未上传' ? (
              <a onClick={() => handleCreate(record)}>上传</a>
            ) : (
              <span>
                <a onClick={() => handleEdit(record)}>编辑</a>
                <Divider type="vertical" />
                <a onClick={() => handleDetail(record)}>查看</a>
              </span>
            )}
          </div>
        );
      }
    }
  ];
  useEffect(() => {
    getData(1, 10);
  }, []);
  const handleEdit = (record) => {
    setModalType('edit');
    setModalVisible(true);
    setEditData(record);
  };
  const handleWatch = (record) => {
    setRecordData(record);
    setDetailVisible(true);
    setDetailData(record);
  };
  const handleDetail = (record) => {
    setRecordData(record);
    setRecordlVisible(true);
    setDetailData(record);
  };
  const handleRecordCancel = () => {
    setRecordlVisible(false);
  };
  const handleDetailCancel = () => {
    setDetailVisible(false);
  };
  const handleCreate = (record) => {
    setModalType('add');
    setModalVisible(true);
    setEditData(record);
  };

  const getData = (pageNum, pageSize, searchData) => {
    const params = {
      pageNum,
      pageSize,
      stockInType: '-1',
      companyId: companyInfo.companyId,
      type: 4,
      ...searchData
    };
    inRegisterApi.getOrderList(params).then((res) => {
      if (res.data.data) {
        setTotal(res.data.data.total);
        setPageNum(pageNum);
        setDataSource(res.data.data.list);
        if (res.data.data.list.length == 0 && pageNum != 1) {
          handleChangePage(pageNum - 1);
        }
      }
    });
  };
  const handleChangePage = (e) => {
    setPageNum(e);
    getData(e, 10, searchData);
  };
  const handleSearchData = (data) => {
    setSearchData(data);
  };
  const handleCancel = () => {
    setModalType('');
    setModalVisible(false);
  };
  return (
    <div className="circleImage">
      <SearchForm getData={getData} pageNum={pageNum} getSearchData={handleSearchData} />
      <Table
        columns={columns}
        scroll={{ x: true }}
        dataSource={dataSource}
        pagination={{
          defaultCurrent: 1,
          showSizeChanger: false,
          pageSize,
          current: pageNum,
          total: total,
          onChange: handleChangePage
        }}
      />
      <RegisterDetail visible={detailVisible} data={detailData} cancel={handleDetailCancel} />
      <AddAndUpdate
        getData={getData}
        editData={editData}
        type={modalType}
        visible={modalVisible}
        handleCancel={handleCancel}
      />
      <DetailModal
        visible={recordVisible}
        detailData={recordData}
        handleCancel={handleRecordCancel}
      />
    </div>
  );
};
export default DetectionList;
