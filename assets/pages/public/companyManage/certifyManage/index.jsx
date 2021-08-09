import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import CompanyApi from 'api/company.js';
import DetailModal from './detailModal';
import './index.less';
const CertifyManage = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [detailVisible, setDetailVisible] = useState(false);
  const columns = [
    {
      title: '证照类型',
      dataIndex: 'licenseType',
      key: 'licenseType',
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
      title: '许可证编号',
      dataIndex: 'licenseNo',
      key: 'licenseNo',
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
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
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
      title: '住所(经营地址)',
      dataIndex: 'businessPlace',
      key: 'businessPlace',
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
      title: '发证机关',
      dataIndex: 'issuingAuthority',
      key: 'issuingAuthority',
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
      title: '有效日期',
      dataIndex: 'expireDate',
      key: 'expireDate',
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
        return <a onClick={() => handleWatch(record)}>查看详情</a>;
      }
    }
  ];
  useEffect(() => {
    CompanyApi.getLicenseInfo({ pageNum: 1, pageSize: 1000 }).then((res) => {
      if (res?.data?.success) {
        setDataSource(res.data.data.dataList);
      }
    });
  }, []);
  const handleWatch = (record) => {
    CompanyApi.getLicenseDetail(record.id).then((res) => {
      if (res?.data?.success) {
        setDetailData(res.data.data);
        setDetailVisible(true);
      }
    });
  };
  const handleCancel = () => {
    setDetailVisible(false);
    setDetailData({});
  };
  return (
    <div style={{ padding: '25px' }}>
      <Table columns={columns} dataSource={dataSource} scroll={{ x: true }} />
      <DetailModal visible={detailVisible} data={detailData} handleCancel={handleCancel} />
    </div>
  );
};
export default CertifyManage;
