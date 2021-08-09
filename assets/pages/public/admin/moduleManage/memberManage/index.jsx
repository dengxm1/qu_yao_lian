import React, { useEffect, useState, Fragment } from 'react';
import {
  Drawer,
  Table,
  Tooltip,
  message,
  Button,
  Form,
  Input,
  Popconfirm,
  Divider,
  Pagination
} from 'antd';
import moment from 'moment';
import SearchForm from './searchForm';
import adminApi from 'api/admin.js';
import './index.less';

const MemberManage = (props) => {
  const { visible, data, onCancel, handleData } = props;
  const [dataSource, setDataSource] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectDatasource, setSelectDatasource] = useState([]);

  const [form] = Form.useForm();
  const columns = [
    {
      title: '企业名称/组织名称',
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
      title: '法定代表人/姓名',
      dataIndex: 'uniformName',
      key: 'uniformName',
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
      title: '经营范围',
      dataIndex: 'businessScope',
      key: 'businessScope',
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
          <Tooltip placement="topLeft" text={text}>
            {text ? text.slice(0, 10) : ''}
          </Tooltip>
        );
      }
    },
    {
      title: '企业状态',
      dataIndex: 'companyState',
      key: 'companyState',
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
        return text == 1 ? '已激活' : '待激活';
      }
    }
  ];
  const handleCancel = () => {
    onCancel();
  };
  useEffect(() => {
    if (JSON.stringify(data) != '{}') {
      getData(1, 10);
    }
  }, [data]);
  const getData = (page, pageSize, searchData) => {
    const params = {
      currentPage: page,
      pageSize,
      companyTemplateId: data.id,
      ...searchData
    };

    adminApi.getAdminCompanyList(params).then((res) => {
      if (res?.data?.data) {
        const data = res.data.data.dataList;
        setDataSource(data);
        setPageNum(page);
        const checkList = [];
        data.map((ele, index) => {
          if (ele.hasSelect) {
            checkList.push(ele.companyId);
          }
        });
        setSelectedRowKeys(checkList);
        setTotal(res.data.data.totalCount);

        if (data.length == 0 && pageNum != 1) {
          setData(pageNum - 1, pageSize);
        }
      }
    });
  };
  const handleSearchData = (data) => {
    setSearchData(data);
  };

  const setData = (e, size) => {
    setPageNum(e);
    setPageSize(size);
    getData(e, size, searchData);
  };
  const onSelectChange = (record, selected, selectedRows) => {
    setSelectDatasource(selectedRows);
  };

  const onSelectAll = (selected, selectedRows, changeRows) => {
    setSelectDatasource(selectedRows);
  };
  const onSelectChangeKeys = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const onSave = () => {
    const params = {
      companyIds: selectedRowKeys,
      companyTemplateId: data.id
    };
    adminApi.addAdminCompany(params).then((res) => {
      if (res?.data?.success) {
        handleCancel();
        message.success('新增成功');
        handleData();
      } else {
        message.error(res.data.message);
      }
    });
  };

  return (
    <>
      <Drawer
        title="企业管理"
        width={1000}
        visible={visible}
        onClose={handleCancel}
        maskClosable={false}
        footer={
          <div
            style={{
              textAlign: 'right'
            }}
          >
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={onSave} type="primary">
              提交
            </Button>
          </div>
        }
      >
        <p style={{ marginBottom: '20px' }}>
          模板名称<span style={{ color: '#1990FF' }}>{data.templateName}</span>
        </p>
        <SearchForm getData={getData} getSearchData={handleSearchData} />
        <Table
          style={{ marginTop: '20px' }}
          className="table"
          columns={columns}
          dataSource={dataSource}
          rowKey={'companyId'}
          rowSelection={{
            onSelect: onSelectChange,
            onSelectAll: onSelectAll,
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChangeKeys
          }}
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
      </Drawer>
    </>
  );
};
export default MemberManage;
