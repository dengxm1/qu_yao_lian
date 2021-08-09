import React, { useState, useCallback, useRef, useEffect } from 'react';
import { message } from 'antd';

import HeaderSeachForm from 'components/Form/HeaderSeach';
import ByTables from 'components/AntdTable';
import AddAction from './components/addAction';
import AddModal from './components/addModal';
import { ByTabs } from 'utils/createAntTags';
import { useTableData } from 'utils/hooks';
import { buildTabsArr, buildHeaderSearchArr, columns } from './buildTagData';
import CompanyApi from 'api/company';

const AssistManage = () => {
  const childRef = useRef();
  const tableState = useTableData();
  const [type, setType] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);

  const getDataSource = (pageNum = 1, pageSize = 10, searchData = tableState.searchData) => {
    const action = ['getTrustDownCompany', 'getTrustUpCompany'][+type - 1];
    const params = {
      pageNum,
      pageSize,
      trustType: type,
      ...searchData
    };
    tableState.getDataSource(CompanyApi[action], params);
  };

  const handleTabsClick = (key) => {
    childRef.current.resetFields();
    setType(key);
  };

  const onSearch = (values) => {
    getDataSource(1, 10, values);
  };

  const handAddleClick = useCallback(() => {
    setModalVisible(true);
  }, [type]);

  const handleModalClick = () => {
    setModalVisible(false);
  };

  const onActions = async (type, { trustId }) => {
    let res = {};
    switch (type) {
      case 'again':
        res = await CompanyApi.reTrust({ trustId });
        break;
      case 'del':
        res = await CompanyApi.deleteTrust({ trustId });
        break;
      default:
        break;
    }
    let data = res?.data?.data;
    let msg = res?.data?.msg;
    if (data) {
      msg && message.success(msg);
      getDataSource(tableState.pageNum, 10, {});
    } else {
      msg && message.error(msg);
    }
  };

  useEffect(() => {
    getDataSource(1, 10, {});
  }, [type]);

  return (
    <div style={{ padding: 20 }}>
      <ByTabs data={buildTabsArr} onChange={handleTabsClick} />
      <HeaderSeachForm cRef={childRef} formArr={buildHeaderSearchArr} onSearch={onSearch} />
      <AddAction type={type} handleClick={handAddleClick} />
      <ByTables
        rowkey="trustId"
        state={tableState}
        columns={columns(type, onActions)}
        onChange={(pageNum, pageSize) => getDataSource(pageNum, pageSize)}
      />
      <AddModal
        type={type}
        visible={modalVisible}
        handleClose={handleModalClick}
        handleModalOK={() => getDataSource(1, 10, {})}
      />
    </div>
  );
};

export default AssistManage;
