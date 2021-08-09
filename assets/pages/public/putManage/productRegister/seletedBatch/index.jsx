import React, { useEffect, useState, useImperativeHandle, memo } from 'react';
import { Table, Tooltip, Row, Badge, Col, Modal, InputNumber, message, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import otherApi from 'api/other';

const SelectedBatch = memo((props) => {
  const { type, dataSource, handleGetTableData } = props;

  const [visible, setVisible] = useState(false);
  const [proRegisterList, setProRegisterList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const isAddMode = type === 'add';
  useEffect(() => {
    if (isAddMode && proRegisterList.length == 0) {
      otherApi.getTypeOfFood('').then((res) => {
        if (res?.data?.success) {
          setProRegisterList(res.data.data);
        }
      });
    }
  });
  const columns = [
    {
      title: '药品通用名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '药品条码',
      dataIndex: 'batchNumber',
      key: 'batchNumber'
    },
    {
      title: '生产批次号',
      dataIndex: 'batchNumber',
      key: 'batchNumber'
    },
    {
      title: '药品类别',
      dataIndex: 'batchNumber',
      key: 'batchNumber'
    },
    {
      title: '药品批准文号或代码',
      dataIndex: 'batchNumber',
      key: 'batchNumber'
    },
    {
      title: '药品剂型',
      dataIndex: 'stockNum',
      key: 'stockNum'
    },
    {
      title: '处方类别',
      dataIndex: 'stockNum',
      key: 'stockNum'
    },
    {
      title: '药品规格',
      dataIndex: 'stockNum',
      key: 'stockNum'
    },
    {
      title: '是否在有效期内',
      dataIndex: 'stockNum',
      key: 'stockNum'
    },
    {
      title: '入库数量',
      dataIndex: 'stockNum',
      key: 'stockNum'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <div>
          <a>删除</a>
        </div>
      )
    }
  ];
  const columns2 = [
    {
      title: '药品通用名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '药品条码',
      dataIndex: 'batchNumber',
      key: 'batchNumber'
    },
    {
      title: '生产批次号',
      dataIndex: 'batchNumber',
      key: 'batchNumber'
    },
    {
      title: '药品类别',
      dataIndex: 'batchNumber',
      key: 'batchNumber'
    },
    {
      title: '药品批准文号或代码',
      dataIndex: 'batchNumber',
      key: 'batchNumber'
    },
    {
      title: '药品剂型',
      dataIndex: 'stockNum',
      key: 'stockNum'
    },
    {
      title: '处方类别',
      dataIndex: 'stockNum',
      key: 'stockNum'
    },
    {
      title: '药品规格',
      dataIndex: 'stockNum',
      key: 'stockNum'
    },
    {
      title: '是否在有效期内',
      dataIndex: 'stockNum',
      key: 'stockNum'
    },
    {
      title: '入库数量',
      dataIndex: 'stockNum',
      key: 'stockNum'
    }
  ];

  const TableFooter = () => {
    return (
      <Row
        style={{ cursor: 'pointer' }}
        align="middle"
        justify="center"
        onClick={() => {
          setVisible(true);
        }}
      >
        <div>
          <PlusOutlined />
          <span>添加流通药品</span>
        </div>
      </Row>
    );
  };

  const onCancel = () => {
    setVisible(false);
  };
  //选中流通药品
  const handleOnOk = () => {
    handleGetTableData(selectedRowKeys);
    setVisible(false);
    setSelectedRowKeys([]);
  };
  const onSelectChange = (selectedRows, selectedRowKeys) => {
    setSelectedRowKeys(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: 50
  };
  const ByTable = React.useMemo(() => (
    <Table
      rowKey={(record) => record.value}
      columns={columns2}
      dataSource={proRegisterList}
      scroll={{ x: true, y: 545 }}
      rowSelection={{
        type: 'checkbox',
        ...rowSelection
      }}
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: () => `共 ${proRegisterList.length} 条`
      }}
    />
  ));
  return (
    <div>
      <Table
        style={{ marginBottom: 15 }}
        columns={columns}
        scroll={{ y: 545 }}
        dataSource={dataSource}
        pagination={false}
        bordered
        footer={isAddMode ? () => TableFooter() : null}
      />
      <Modal
        width="50%"
        visible={visible}
        title={'选择流通药品'}
        destroyOnClose
        onCancel={onCancel}
        onOk={handleOnOk}
      >
        {ByTable}
      </Modal>
    </div>
  );
});

export default SelectedBatch;
