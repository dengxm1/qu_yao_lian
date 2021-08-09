import React, { useState, Fragment, memo } from 'react';
import { Form, Input, Modal, Table, Row, Button, Space } from 'antd';
import createColumns, { placeholders } from './columns';

const FormInputSearch = memo((props) => {
  const {
    ModalTitle = '选择',
    visible,
    dataSource = null,
    onFocus,
    searchKey,
    handleSeleted
  } = props;

  const [input, setInput] = useState('');
  const [paging, setPaging] = useState({ pageNum: 1, pageSize: 10 });

  const resetPaging = () => {
    setPaging({ pageNum: 1, pageSize: 10 });
    setInput('');
  };

  const handleSearch = () => {
    onFocus({ [searchKey]: input, pageNum: 1, pageSize: 10 }, searchKey);
  };

  const columns = dataSource
    ? createColumns(searchKey, handleSeleted, ModalTitle, resetPaging)
    : [];
  const placeholder = placeholders(searchKey);

  const ByTable = React.useMemo(
    () =>
      dataSource && dataSource.list ? (
        <Table
          columns={columns}
          dataSource={dataSource.list}
          scroll={{ y: 545 }}
          pagination={{
            current: paging.pageNum,
            pageSize: paging.pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total: dataSource.total,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              const obj = { pageNum: page, pageSize };
              setPaging(obj);
              onFocus({ [searchKey]: input, ...obj });
            }
          }}
        />
      ) : null,
    [dataSource]
  );
  console.log('dataSource--', dataSource);
  return (
    <>
      <Fragment>
        {props.children && (
          <span
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => onFocus && onFocus()}
          >
            {props.children}
          </span>
        )}
      </Fragment>
      <Modal
        width="50%"
        visible={visible}
        title={ModalTitle}
        footer={null}
        destroyOnClose
        zIndex={1002}
        onCancel={() => {
          setInput(undefined);
          setPaging({ pageNum: 1, pageSize: 10 });
          handleSeleted();
        }}
      >
        {searchKey !== 'batchNumber' && (
          <Row justify="end" style={{ marginBottom: 10 }}>
            <Space>
              <Input
                allowClear
                style={{ width: 280 }}
                placeholder={placeholder}
                onChange={(e) => setInput(e.target.value.trim())}
              />
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
            </Space>
          </Row>
        )}
        {ByTable}
      </Modal>
    </>
  );
});

export default FormInputSearch;
