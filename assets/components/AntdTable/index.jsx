import React from 'react';
import { Table } from 'antd';

const Index = ({ rowKey, state, columns, rowSelection = null, style = {}, onChange }) => {
  return (
    <Table
      rowKey={rowKey}
      dataSource={state.dataSource}
      columns={columns}
      style={style}
      rowSelection={rowSelection}
      pagination={{
        total: state.total,
        current: state.pageNum,
        pageSize: state.pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条数据`,
        onChange: onChange
      }}
    />
  );
};

export default Index;
