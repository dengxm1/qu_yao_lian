import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table, Badge, Divider, Pagination, message, Popconfirm, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import CertyDetail from './certyDetail';
import SearchForm from './searchForm';
import AddAndUpdate from './addAndUpdate';
import OutRegisterApi from 'api/outRegister';
import downLoad from 'utils/download.js';
import UploadModal from 'components/UploadModal';
import moment from 'moment';
import OutDetail from './inventoryDetail';
import './index.less';

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const OutRegister = (props) => {
  const { searchDatas, handleSearchPage, searchPage } = props.OutRegister;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [detailData, setDetailData] = useState({});
  const [pageNum, setPageNum] = useState(0);
  const [file, setFile] = useState(null);
  const [certyVisible, setCertyVisible] = useState(false);
  const [editData, setEditData] = useState({});
  const [uploadVisible, setUploadVisible] = useState(false);
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const [pageSize, setPageSize] = useState(10);
  const [certyData, setCertyData] = useState({});
  const [outputType, setOutputType] = useState('single'); // => single: 单品  double: 多品
  const [searchData, setSearchData] = useState({});
  const getDataSource = (pageNum, pageSize, searchData) => {
    const params = {
      pageNum,
      pageSize: pageSize,
      companyId: companyInfo.companyId,
      type: 3,
      ...searchData
    };
    OutRegisterApi.getOrderList(params).then((res) => {
      const { list, total } = res.data?.data || {};
      setTotal(total);
      setPageNum(pageNum);
      setDataSource(list);
      if (list.length == 0 && pageNum != 1) {
        setData(pageNum - 1);
      }
    });
  };

  useEffect(() => {
    getDataSource(searchPage, pageSize, {});
  }, []);
  const columns = [
    {
      title: '出库单号',
      dataIndex: 'outOrderNo',
      key: 'outOrderNo',
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
      title: '经销商',
      dataIndex: 'companyName',
      key: 'companyName',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text) => text || '个人'
    },
    {
      title: '出库日期',
      dataIndex: 'stockOutTime',
      key: 'stockOutTime',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '登记人',
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
      title: (
        <Tooltip title={'待入库:下游企业未入库  已入库:下游企业已入库'}>
          <span style={{ cursor: 'pointer' }}>
            状态 <QuestionCircleOutlined />
          </span>
        </Tooltip>
      ),
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
      title: '登记日期',
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
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
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
            {record.statusLabel !== '已入库' ? (
              <span>
                <a onClick={() => handleEdit(record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record)}>
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
              </span>
            ) : (
              ''
            )}
            <a onClick={() => handleCertyData(record)}>查看销售凭证</a>
            <Divider type="vertical" />

            <a onClick={() => handleDetail(record)}>查看明细</a>
          </div>
        );
      }
    }
  ];
  const handleCertyData = (data) => {
    setCertyData(data);
    setCertyVisible(true);
  };
  const handleAdd = (type) => {
    setModalVisible(true);
    setModalType('add');
    setOutputType(type);
  };
  const handleCancel = () => {
    setModalVisible(false);
    setModalType('');
  };

  const handleDetail = (data) => {
    setDetailVisible(true);
    setDetailData(data);
  };
  const setData = (e, size) => {
    handleSearchPage(e);
    setPageSize(size);
    getDataSource(e, size, searchData);
  };
  const handleDetailCancel = () => {
    setDetailVisible(false);
  };
  const handleRevoke = (record) => {
    const params = {
      orderId: record.id,
      orderNo: record.outOrderNo,
      uniformCode: companyInfo.uniformCode
    };
    OutRegisterApi.revokeOutOrder(params).then((res) => {
      if (res?.data?.success) {
        message.success('撤销成功');
        getDataSource(pageNum, pageSize, searchData);
      } else {
        message.error(res.data.message);
      }
    });
  };

  const handleDelete = (record) => {
    OutRegisterApi.deleteOutOrder({ id: record.id }).then((res) => {
      if (res?.data?.data) {
        message.success('删除成功');
        getDataSource(pageNum, pageSize);
      }
    });
  };
  const handleEdit = (record) => {
    setEditData(record);
    setModalVisible(true);
    setModalType('edit');
    setOutputType('double');
  };

  const handleSecondIn = (record) => {
    OutRegisterApi.getOutRegisterDetail({ id: record.id }).then((res) => {
      if (res?.data?.success) {
        const data = res.data.data;
        const params = {
          companyId: companyInfo.companyId,
          regulatoryCode: companyInfo.regulatoryCode,
          uniformCode: companyInfo.uniformCode,
          sellCode: data.sellCode,
          buyType: data.buyCompanyType,
          outCompanyName: data.buyName,
          contactPerson: data.buyContact,
          contactPersonTel: data.buyContactTel,
          orderCreateTime: moment(data.orderTime),

          outOrderInfo: {
            buyerUniformCode: data.buyUniformCode,
            contactPerson: data.buyContact,
            contactPersonTel: data.buyContactTel
          },
          baseInfo: {
            orderCreateTime: data.orderTime.valueOf(),
            registerName: data.registerPerson,
            manageName: data.managerPerson
          },
          productInfo: data.page.list,
          outOrderId: record.id
        };
        OutRegisterApi.repairOutOrder(params).then((res) => {
          if (res?.data?.success) {
            message.success('重新出库成功');
            getDataSource(1, pageSize, searchData);
          } else {
            message.error(res.data.msg || res.data.message);
          }
        });
      }
    });
  };
  const handleUploadSubmit = (e) => {
    setFile(e);
  };
  const submitUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    if (file) {
      OutRegisterApi.uploadOutOrderModel(formData).then((res) => {
        if (res?.data?.success) {
          message.success('批量导入成功');
          setUploadVisible(false);
          setFile([]);
          getDataSource(1, pageSize);
        } else {
          message.error(res.data.msg);
        }
      });
    } else {
      message.error('上传文件不能为空');
    }
  };
  const handleDownLoad = () => {
    OutRegisterApi.downloadOutOrderModel().then((res) => {
      downLoad(res, '产品出库导入模板(带星号项必填).xls');
    });
  };
  const handleBatch = () => {
    setUploadVisible(true);
  };
  const handleUploadCancel = () => {
    setUploadVisible(false);
  };
  const handleCertyCancel = () => {
    setCertyVisible(false);
  };
  const getSearchData = (data) => {
    setSearchData(data);
  };
  return (
    <div className="seller">
      <SearchForm getData={getDataSource} pageNum={pageNum} saveSearchData={getSearchData} />
      <div className="operate">
        <Button type="primary" onClick={() => handleAdd('single')}>
          单产品出库
        </Button>
        <Button type="primary" onClick={() => handleAdd('double')}>
          多产品出库
        </Button>
      </div>
      <Table
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
      <AddAndUpdate
        visible={modalVisible}
        handleCancel={handleCancel}
        getData={getDataSource}
        data={editData}
        type={modalType}
        outputType={outputType}
      />
      <UploadModal
        onSubmit={handleUploadSubmit}
        visible={uploadVisible}
        cancel={handleUploadCancel}
        submitUpload={submitUpload}
      />
      <OutDetail visible={detailVisible} cancel={handleDetailCancel} data={detailData} />
      <CertyDetail visible={certyVisible} onCancel={handleCertyCancel} data={certyData} />
    </div>
  );
};

export default inject('OutRegister')(observer(OutRegister));
