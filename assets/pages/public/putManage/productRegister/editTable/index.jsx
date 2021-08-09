import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Modal,
  message,
  Button,
  Select,
  Popconfirm,
  Form,
  Typography,
  InputNumber,
  Divider
} from 'antd';
import informFillingApi from 'api/informFilling.js';
import FormulaBatchModal from '../formulaBatchModal';
import './index.less';
const originData = [];

for (let i = 0; i < 5; i++) {
  originData.push({
    id: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`
  });
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === 'number' ? (
      <Input type="number" />
    ) : inputType === 'type' ? (
      <Select>
        <Select.Option value={'原料'}>原料</Select.Option>
        <Select.Option value={'配料'}>配料</Select.Option>
        <Select.Option value={'添加剂'}>添加剂</Select.Option>
      </Select>
    ) : inputType === 'useNumber' ? (
      <InputNumber precision={3} min={0} />
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,

              message: `${title}不能为空!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = (props) => {
  const [form] = Form.useForm();
  const { handleGetTableData, dataSource, type } = props;
  const [data, setData] = useState(dataSource);
  const [batchVisible, setBatchVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectDatasource, setSelectDatasource] = useState([]);
  const [materDataSource, setMaterDataSource] = useState([]);
  const [formulaBatchVisible, setFormulaBatchVisible] = useState(false);
  const [searchForm] = Form.useForm();
  const typeList = JSON.parse(sessionStorage.getItem('typeList'));

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };
  useEffect(() => {
    if (type == 'edit') {
      setData(dataSource);
      handleGetTableData(dataSource);
    } else {
      setData([]);
    }
  }, [dataSource]);

  const isEditing = (record) => {
    if (record) {
      return record.id === editingKey;
    } else {
      return false;
    }
  };

  const batchColumns = [
    {
      title: '原料编号',
      dataIndex: 'materialNo',
      key: 'materialNo'
    },
    {
      title: '物料名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '原料类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        return <span>{text ? typeList.filter((v) => v.value == text)[0].name : ''}</span>;
      }
    },
    {
      title: '生产单位',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: '产品来源',
      dataIndex: 'address',
      key: 'address',
      render: (text) => {
        return <span>{text ? text.split(',') : ''}</span>;
      }
    }
  ];
  const columns = [
    {
      title: '物料名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '原料类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        return <span>{text ? typeList.filter((v) => v.value == text)[0].name : ''}</span>;
      }
    },
    {
      title: '生产单位',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: '产品来源',
      dataIndex: 'address',
      key: 'address',
      render: (text) => {
        return <span>{text ? text.split(',') : ''}</span>;
      }
    },
    {
      title: '使用数量',
      dataIndex: 'useNumber',
      key: 'useNumber',
      inputType: 'useNumber',
      editable: true
    },
    {
      title: '单位',
      dataIndex: 'uint',
      key: 'uint',
      editable: true
    },
    {
      title: '操作',
      dataIndex: 'operate',
      id: 'operate',
      width: '100',
      fixed: 'right',
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            {type == 'add' ? (
              <a
                href="javascript:;"
                onClick={() => save(record.id)}
                style={{
                  marginRight: 8
                }}
              >
                保存
              </a>
            ) : (
              <Popconfirm
                title="如需保存使用数量，请勾选保存为配方。"
                onConfirm={() => save(record.id)}
              >
                <a
                  href="javascript:;"
                  style={{
                    marginRight: 8
                  }}
                >
                  保存
                </a>
              </Popconfirm>
            )}

            <Popconfirm title="确定取消吗?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              编辑
            </Typography.Link>
            <Divider type="vertical" />

            <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      }
    }
  ];

  const handleDelete = (id) => {
    let dataSource = [...data];
    dataSource = dataSource.filter((item) => item.id !== id);
    setData(dataSource);
    setSelectDatasource(dataSource);
    handleGetTableData(dataSource);
  };
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === 'age'
            ? 'number'
            : col.dataIndex === 'type'
            ? 'type'
            : col.dataIndex === 'useNumber'
            ? 'useNumber'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        form.resetFields();
        setEditingKey('');
        handleGetTableData(newData);
      } else {
        newData.push(row);
        form.resetFields();
        setData(newData);
        setEditingKey('');
        handleGetTableData(newData);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const cancel = () => {
    setEditingKey('');
    form.resetFields();
  };
  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };
  const getMaterData = (e) => {
    const params = {
      pageNum: 1,
      pageSize: 100,
      ...e
    };
    informFillingApi.rawMaterialList(params).then((res) => {
      if (res?.data?.data) {
        setMaterDataSource(res.data.data.list);
      }
    });
  };
  const handleBatchAdd = () => {
    setBatchVisible(true);
    getMaterData('');
  };

  const handleBatchClose = () => {
    setBatchVisible(false);
    searchForm.resetFields();
    setSelectDatasource([]);
    setSelectedRowKeys([]);
  };

  const handleBatchSubmit = () => {
    const indexArray = [];
    let keyValue = null;
    let dataKeyArr = [];
    selectDatasource.map((ele, i) => {
      const index = data.findIndex((v) => v.id == ele.id);
      let dataKey = materDataSource.findIndex((v) => v.id == ele.id);
      dataKeyArr.push(dataKey);
      indexArray.push(index);
      keyValue = indexArray.findIndex((v) => v != -1);
    });
    if (keyValue > -1) {
      message.error(`${materDataSource[dataKeyArr[keyValue]].name}已存在，请检查`);
    } else {
      const dataList = data.concat(selectDatasource);
      setData(dataList);
      setBatchVisible(false);
      handleGetTableData(dataList);
      setSelectDatasource([]);
      setSelectedRowKeys([]);
    }
  };

  const onSelectChange = (record, selected, selectedRows) => {
    setSelectDatasource(selectedRows);
  };

  const onSelectAll = (selected, selectedRows, changeRows) => {
    setSelectDatasource(selectedRows);
  };
  const onSelectChangeKeys = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleSearch = () => {
    searchForm.validateFields().then((values) => {
      getMaterData(values);
    });
  };
  const handleReset = () => {
    getMaterData('');
    searchForm.resetFields();
  };
  const handleSelectFormula = () => {
    setFormulaBatchVisible(true);
  };

  const handleGetFormulaData = (data) => {
    setData(data);
  };

  return (
    <div>
      <div>
        <Button
          onClick={handleBatchAdd}
          type="primary"
          style={{ marginBottom: '10px', marginRight: '15px' }}
        >
          批量添加
        </Button>
        <Button onClick={handleSelectFormula} type="primary" style={{ marginBottom: '10px' }}>
          选择配方
        </Button>
      </div>

      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          className="editTable"
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
      <FormulaBatchModal
        visible={formulaBatchVisible}
        onCancel={() => {
          setFormulaBatchVisible(false);
        }}
        handleGetTableData={handleGetTableData}
        type={type}
        dataList={data}
        handleGetFormulaData={handleGetFormulaData}
      />
      <Modal
        width={800}
        visible={batchVisible}
        onOk={handleBatchSubmit}
        className={'searchModal'}
        onCancel={handleBatchClose}
      >
        <div className="searchForm search">
          <Form className="formBorder" form={searchForm} {...formItemLayout}>
            <Form.Item name="name">
              <Input placeholder="请输入物料名称" />
            </Form.Item>
            <Form.Item name="materialNo">
              <Input placeholder="请输入原料编号" />
            </Form.Item>
          </Form>
          <Button onClick={handleSearch} type="primary" style={{ marginRight: '10px' }}>
            查询
          </Button>
          <Button onClick={handleReset} type="primary">
            重置
          </Button>
        </div>
        <Table
          columns={batchColumns}
          dataSource={materDataSource}
          rowKey={'id'}
          rowSelection={{
            onSelect: onSelectChange,
            onSelectAll: onSelectAll,
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChangeKeys
          }}
        />
      </Modal>
    </div>
  );
};

export default EditableTable;
