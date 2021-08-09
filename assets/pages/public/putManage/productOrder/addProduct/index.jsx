import React, { useState, useEffect } from 'react';
import { Button, Table, Row, Badge, Tooltip, Col, Descriptions, Drawer, message } from 'antd';
import moment from 'moment';
import NameLabel from 'components/NameLabel';
import outRegisterApi from 'api/outRegister';
import './index.less';

const AddProduct = (props) => {
  const { handleCancel, visible, editData } = props;
  const [dataSource, setDataSource] = useState([]);
  const [baseData, setBaseData] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [searchData, setSearchData] = useState({});
  const [total, setTotal] = useState(0);
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
      })
    },
    {
      title: '药品条吗',
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
      title: '生产批次号',
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
      title: '药品类别',
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
      title: '批准文号',
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
      title: '药品剂型',
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
      title: '处方类别',
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
      title: '药品规格',
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
      title: '是否在有效期内',
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
      id: editData.id,
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
    if (JSON.stringify(editData) != '{}') {
      getData();
    }
  }, [editData]);
  const setData = (page) => {
    setPageNum(page);
    getData();
  };
  //确认入库
  const handleSubmit = () => {
    console.log('确认入库成功');
    handleCancel();
  };

  const { stockOutTime, managerPerson, outOrderNo, registerPerson, outCompany } = baseData;
  return (
    <Drawer
      title="查看并确认入库"
      maskClosable={false}
      visible={visible}
      onClose={handleCancel}
      className="addDrawer"
      width={1000}
      footer={
        <div>
          <Button type="primary" onClick={handleSubmit}>
            确认入库
          </Button>
          <Button onClick={handleCancel}>取消</Button>
        </div>
      }
    >
      <div className="inventoryDetail">
        <NameLabel name="出库信息" />
        <Descriptions
          style={{ marginTop: '20px', marginLeft: '20px' }}
          column={{ xs: 1, sm: 1, md: 2 }}
        >
          <Descriptions.Item label="出库单号">{outOrderNo}</Descriptions.Item>
          <Descriptions.Item label="出库日期">
            {stockOutTime ? moment(stockOutTime).format('YYYY-MM-DD HH:mm:ss') : ''}
          </Descriptions.Item>
          <Descriptions.Item label="出库登记人">{managerPerson}</Descriptions.Item>
          <Descriptions.Item label="登记人联系方式">{registerPerson}</Descriptions.Item>
        </Descriptions>
        <NameLabel name="上游信息" />
        <Descriptions
          style={{ marginTop: '20px', marginLeft: '20px' }}
          column={{ xs: 1, sm: 1, md: 2 }}
        >
          <Descriptions.Item label="主体名称">
            {outCompany ? outCompany.companyName : ''}
          </Descriptions.Item>
          <Descriptions.Item label="统一社会信用代码">
            {outCompany ? outCompany.uniformCode : ''}
          </Descriptions.Item>
          <Descriptions.Item label="企业联系人">
            {outCompany ? outCompany.contactPerson : ''}
          </Descriptions.Item>
          <Descriptions.Item label="联系手机号">
            {outCompany ? outCompany.contactPersonTel : ''}
          </Descriptions.Item>
        </Descriptions>
        <NameLabel name="产品待入库明细" />
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

export default AddProduct;
