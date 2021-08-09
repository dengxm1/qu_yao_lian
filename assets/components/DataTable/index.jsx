import React from 'react';
import { Table, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './index.less';
const DataTable = (props) => {
  const {
    type = 'add',
    addBtnText = '添加下游',
    dataSource,
    maxLength,
    columns,
    addRecord,
    isShowFooter
  } = props;

  const isMax = maxLength && dataSource.length === maxLength;

  const tableFooter = () => {
    if (type !== 'add') return null;
    return (
      <Row
        style={{ cursor: isMax ? 'not-allowed' : 'pointer' }}
        align="middle"
        justify="center"
        onClick={() => {
          !isMax && addRecord();
        }}
      >
        {isMax ? (
          <span style={{ opacity: 0.5 }}>{addBtnText}</span>
        ) : (
          <>
            <PlusOutlined />
            <span>{addBtnText}</span>
          </>
        )}
      </Row>
    );
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      footer={isShowFooter ? () => tableFooter() : null}
      style={{ margin: '20px 0' }}
    />
  );
};

export default DataTable;
