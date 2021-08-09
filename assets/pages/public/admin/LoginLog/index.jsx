import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Pagination, DatePicker, Table, Row, Space } from 'antd';
import moment from 'moment';
import AdminApi from 'api/admin.js';
import SearchForm from './searchForm';
const LoginLog = () => {
  const [state, setState] = useState({
    page: 1,
    pageSize: 10
  });
  const [dataSource, setDataSource] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  useEffect(() => {
    getData(1, 10);
  }, []);

  const getData = (pageNum, pageSize, searchData) => {
    const params = {
      currentPage: pageNum,
      pageSize,
      ...searchData
    };

    AdminApi.getLoginLog(params).then((res) => {
      if (res?.data?.data) {
        setDataSource(res.data.data.dataList);
        setPageNum(pageNum);
        setTotal(res.data.data.totalCount);
        if (res.data.data.dataList.length == 0 && pageNum != 1) {
          setData(pageNum - 1, pageSize);
        }
      }
    });
  };
  const setData = (e, size) => {
    setState({ page: e, pageSize: size });
    getData(e, size, searchData);
  };
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
      title: '登录时间',
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
      render: (text) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>;
      }
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
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
      title: '登录地',
      dataIndex: 'address',
      key: 'address',
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
      title: '登录系统',
      dataIndex: 'platform',
      key: 'platform',
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
      title: '登录方式',
      dataIndex: 'type',
      key: 'type',
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

  const handleSearchData = (data) => {
    setSearchData(data);
  };
  return (
    <div style={{ padding: 25 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <SearchForm getData={getData} getSearchData={handleSearchData} />
        <div>
          <Table columns={columns} dataSource={dataSource} pagination={false} />
          <Pagination
            total={total}
            style={{ marginTop: '10px', float: 'right', paddingBottom: '20px' }}
            showTotal={(total) => `共${total}条`}
            showSizeChanger
            pageSizeOptions={['10', '20', '50', '100']}
            onChange={(page, pageSize) => setData(page, pageSize)}
            onShowSizeChange={(page, pageSize) => setData(page, pageSize)}
            current={state.page}
            pageSize={state.pageSize}
          />
        </div>
      </Space>
    </div>
  );
};

export default LoginLog;
