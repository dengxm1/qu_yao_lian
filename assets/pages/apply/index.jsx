import React, { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';

import Header from 'components/Header';
import ByTables from 'components/AntdTable';
import { ByTabs } from 'utils/createAntTags';
import { useTableData } from 'utils/hooks';
import PopupModal from './popupModal';

import { buildTabsArr, columns, operations } from './buildTagData';
import SignatureApi from 'api/signature.js';

const Applay = () => {
  const tableState = useTableData();
  const [type, setType] = useState('0');
  const [popState, setPopState] = useState({
    popType: 'dosth',
    personType: 1,
    popVisible: false,
    popRecord: {}
  });

  const getDataSource = (pageNum, pageSize) => {
    const params = {
      pageNum,
      pageSize,
      approveType: type === '0' ? null : type
    };
    tableState.getDataSource(SignatureApi.getApproveList, params);
  };

  const handleTabsClick = useCallback(
    (key) => {
      setType(key);
    },
    [type]
  );

  const onAction = async (type, record) => {
    let res = await SignatureApi.getApproveList({ approveId: record.approveId });
    if (res?.data?.data) {
      record = {
        ...record,
        approveStatus: res.data.data.approveStatus,
        ...(record.approveType == 2 ? res.data.data.epCompany : {})
      };
    } else {
      return message.error('获取企业信息失败，请重试！');
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
    if (isRequest) {
      getDataSource(tableState.pageNum, tableState.pageSize);
    }
  };

  useEffect(() => {
    getDataSource(1, 10);
  }, [type]);

  return (
    <div>
      <Header />
      <div style={{ padding: '10px 20px 0px' }}>
        <ByTabs data={buildTabsArr} onChange={handleTabsClick} operations={operations} />
        <PopupModal {...popState} handlePopupClose={handlePopupClose} />
        <ByTables
          rowKey="approveId"
          state={tableState}
          columns={columns(onAction)}
          onChange={(pageNum, pageSize) => getDataSource(pageNum, pageSize)}
        />
      </div>
    </div>
  );
};

export default Applay;
