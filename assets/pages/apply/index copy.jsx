import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

import { ByTabs } from 'utils/createAntTags';
import { useTableData } from 'utils/hooks';
import { buildTabsArr, columns } from './buildTagData';
import Header from 'components/Header';
import PopupModal from './popupModal';

import SignatureApi from 'api/signature.js';

const Applay = () => {
  const [type, setType] = useState('0');

  const tableData = useTableData(SignatureApi.getApproveList);
  const [state, setState] = useState({
    total: 0,
    pageNum: 1,
    pageSize: 10,
    dataSource: []
  });
  console.log(tableData);
  const [popState, setPopState] = useState({
    popType: 'dosth',
    personType: 1,
    popVisible: false,
    popRecord: {}
  });

  const getDataSource = async (pageNum = 1, pageSize = 10) => {
    const params = {
      pageNum,
      pageSize,
      approveType: type === '0' ? null : type
    };
    const res = await SignatureApi.getApproveList(params);
    if (res?.data?.data) {
      const data = res.data.data;
      setState({
        ...state,
        pageNum,
        pageSize,
        dataSource: data.list,
        total: data.total
      });
    }
  };

  const handleTabsClick = useCallback(
    (key) => {
      setType(key);
    },
    [type]
  );

  const onAction = async (type, record) => {
    if (record.approveType == 2) {
      let res = await SignatureApi.getApproveList({ approveId: record.approveId });
      if (res?.data?.data) {
        record = { ...record, ...res.data.data.epCompany };
      } else {
        return message.error('获取企业信息失败，请重试！');
      }
    }
    setPopState({
      ...popState,
      popVisible: true,
      personType: record.approveType,
      popType: type,
      popRecord: record
    });
  };

  const handlePopupClose = (isRequest = false) => {
    setPopState({ ...popState, popVisible: false });
    isRequest && getDataSource(state.pageNum, state.pageSize);
  };

  const operations = useMemo(
    () => (
      <Button
        type="primary"
        icon={<HomeOutlined />}
        onClick={() => {
          window.location.href = '/public';
        }}
      >
        返回首页
      </Button>
    ),
    []
  );

  useEffect(() => {
    getDataSource(1, 10);
    tableData.getDataSource();
  }, [type]);

  return (
    <div>
      <Header />
      <div style={{ padding: '10px 20px 0px' }}>
        <ByTabs data={buildTabsArr} onChange={handleTabsClick} operations={operations} />
        <PopupModal {...popState} handlePopupClose={handlePopupClose} />
        <Table
          dataSource={state.dataSource}
          columns={columns(onAction)}
          pagination={{
            total: state.total,
            current: state.pageNum,
            pageSize: state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`,
            onChange: (pageNum, pageSize) => getDataSource(pageNum, pageSize)
          }}
        />
      </div>
    </div>
  );
};

export default Applay;
