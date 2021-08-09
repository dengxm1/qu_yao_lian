import React, { useEffect, useState, Fragment } from 'react';
import { Drawer, Table, Button, message, Pagination } from 'antd';
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
  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
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
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
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
      title: '身份证号',
      dataIndex: 'idcardNo',
      key: 'idcardNo',
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
      title: '账号状态',
      dataIndex: 'status',
      key: 'status',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return text == 1 ? '已注册' : '';
      }
    }
  ];
  const handleCancel = () => {
    onCancel();
    setSelectDatasource([]);
    setSelectedRowKeys([]);
  };
  useEffect(() => {
    if (JSON.stringify(data) != '{}') {
      getData(1, 10);
    }
  }, [data]);
  const getData = (page, pageSize, searchData) => {
    const params = {
      currentPage: page,
      pageSize: 1000,
      roleId: data.id,
      ...searchData
    };

    adminApi.getRoleUserList(params).then((res) => {
      if (res?.data?.data) {
        const data = res.data.data.dataList;
        setDataSource(data);
        setPageNum(page);
        const checkList = [];
        data.map((ele, index) => {
          if (ele.hasSelect) {
            checkList.push(ele.id);
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
      roleId: data.id,
      userIds: selectedRowKeys
    };
    adminApi.addUser(params).then((res) => {
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
        title="成员管理"
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
          角色名称：<span style={{ color: '#1990FF' }}>{data.name}</span>
        </p>
        <SearchForm getData={getData} getSearchData={handleSearchData} />
        <Table
          style={{ marginTop: '20px' }}
          className="table"
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
          rowSelection={{
            onSelect: onSelectChange,
            onSelectAll: onSelectAll,
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChangeKeys
          }}
          scroll={{ x: true }}
          // pagination={false}
        />
        {/* <Pagination
          total={total}
          style={{ marginTop: '10px', float: 'right', paddingBottom: '20px' }}
          showTotal={(total) => `共${total}条`}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          onChange={(page, pageSize) => setData(page, pageSize)}
          onShowSizeChange={(page, pageSize) => setData(page, pageSize)}
          current={pageNum}
          pageSize={pageSize}
        /> */}
      </Drawer>
    </>
  );
};
export default MemberManage;
