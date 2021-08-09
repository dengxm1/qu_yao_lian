import React, { memo, useState, useEffect } from 'react';
import { Modal, message } from 'antd';

import HeaderSeachForm from 'components/Form/HeaderSeach';
import ByTables from 'components/AntdTable';
import { useTableData } from 'utils/hooks';
import { buildHeaderSearchArr, modalColums } from '../buildTagData';

import CompanyApi from 'api/company';

const AddModal = (props) => {
  const { type, visible, handleClose, handleModalOK } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const tableState = useTableData();

  const getDataSource = (pageNum = 1, pageSize = 10, searchData = tableState.searchData) => {
    const params = {
      pageNum,
      pageSize,
      trustType: [2, 1][+type - 1],
      ...searchData
    };
    tableState.getDataSource(CompanyApi.getCanTrustCompany, params);
  };

  const handleOk = async () => {
    if (!selectedRowKeys.length) {
      return message.error('请选择企业');
    }
    const key = ['downCompanyId', 'upCompanyId'][+type - 1];
    const res = await CompanyApi.addTrustCompany({ [key]: selectedRowKeys.join(',') });
    if (res?.data?.data) {
      res?.data?.msg && message.success(res?.data?.msg);
      handleModalOK();
      handleClose();
    } else {
      res?.data?.msg && message.error(res?.data?.msg);
    }
  };

  const onSearch = (values) => {
    getDataSource(1, 10, values);
  };

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  useEffect(() => {
    if (visible) {
      getDataSource(1, 10, {});
    } else {
      tableState.setTableState({ ...tableState, dataSource: [] });
    }
  }, [type, visible]);

  return (
    <Modal
      visible={visible}
      title={['申请信任经销商', '新增信任企业'][+type - 1]}
      width={1200}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleClose}
    >
      <HeaderSeachForm formArr={buildHeaderSearchArr} onSearch={onSearch} />
      <ByTables
        rowKey="companyId"
        rowSelection={rowSelection}
        state={tableState}
        columns={modalColums}
        style={{ marginTop: 10 }}
        onChange={(pageNum, pageSize) => getDataSource(pageNum, pageSize)}
      />
    </Modal>
  );
};

export default memo(AddModal);
