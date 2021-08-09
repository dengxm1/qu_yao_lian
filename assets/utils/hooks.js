import { useState } from 'react';

const useTableData = () => {
  const [tableState, setTableState] = useState({
    total: 0,
    pageNum: 1,
    pageSize: 10,
    searchData: {},
    dataSource: []
  });

  const getDataSource = async (request, params) => {
    const res = await request(params);
    if (res?.data?.data) {
      const data = res.data.data;
      setTableState({
        ...tableState,
        ...params,
        dataSource: data.list,
        total: data.total
      });
    }
  };

  return {
    ...tableState,
    setTableState,
    getDataSource
  };
};

export { useTableData };
