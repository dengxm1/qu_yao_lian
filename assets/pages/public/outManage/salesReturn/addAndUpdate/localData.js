import React, { memo } from 'react';
import { Typography, Radio, Input, InputNumber, Tooltip, Modal } from 'antd';
import { FormOutlined } from '@ant-design/icons';
const { Text } = Typography;

export const DrawerHeaderTips = memo(({ type = 'single' }) => {
  const obj = {
    single: (
      <>
        <p>
          此处进行<Text type="danger">单个产品</Text>的销售出库操作：
        </p>
        <p>1、只能选择一个产品一个批次；</p>
        <p>2、下游可以选择一个或多个，下游类型可选择个人或企业，分别填写出库数量。</p>
      </>
    ),
    double: (
      <>
        <p>
          此处进行<Text type="danger">多个产品</Text>的销售出库操作：
        </p>
        <p>1、只能选择一个下游；</p>
        <p>2、产品可以选择一个或多个，下游类型可选择个人或企业，分别填写出库数量。</p>
      </>
    )
  };
  return <div className="DrawerHeaderTips">{obj[type]}</div>;
});

export const companyColumns = ({
  companyList: data,
  setCompanyList: setData,
  handleFindAll,
  type,
  outputType
}) => {
  console.log(data);
  const isEdit = type === 'add';
  const handleChange = (record, k, v) => {
    const arr = [...data];
    const i = arr.findIndex((item) => item.id === record.id);
    arr[i] = { ...record, [k]: v };
    setData(arr);
  };
  let arr = [
    {
      title: '下游类型',
      dataIndex: 'buyClass',
      key: 'buyClass',
      width: 90,
      render: (text, record) => {
        return (
          <Radio.Group
            disabled={!isEdit}
            defaultValue={text}
            onChange={(e) => {
              handleChange({ id: record.id, buyClass: e.target.value }, 'buyClass', e.target.value);
            }}
          >
            <Radio value={0}>个人</Radio>
            <Radio value={1}>企业</Radio>
          </Radio.Group>
        );
      }
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 150,
      render: (text, record) => {
        const showLenght = isEdit ? 5 : 6;
        if (record.buyClass === null) return '';
        if (text === 0 || record.buyClass === 0) return '-';
        if (record.buyClass === 1 && !text) {
          return <a onClick={() => handleFindAll({}, 'outCompanyName', record.id)}>查看全部</a>;
        }
        return (
          <>
            <Tooltip title={text}>
              <span>{text.length > showLenght ? text.substring(0, showLenght) + '...' : text}</span>
            </Tooltip>
            {isEdit && (
              <a
                onClick={() => handleFindAll({}, 'outCompanyName', record.id)}
                style={{ marginLeft: 5 }}
              >
                修改
              </a>
            )}
          </>
        );
      }
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'buyUniformCode',
      key: 'buyUniformCode',
      width: 210,
      render: (text, record) => {
        if (record.buyClass === null) return '';
        if (text === 0 || record.buyClass === 0) return '-';
        return <Input value={text} disabled={true} />;
      }
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
      render: (text, record) => {
        if (record.buyClass === null) return '';
        if (text === 0 || record.buyClass === 0) return '-';
        return (
          <Input
            value={text}
            disabled={!isEdit}
            onChange={(e) => {
              handleChange(record, 'contactPerson', e.target.value);
            }}
          />
        );
      }
    },
    {
      title: '联系人电话号码',
      dataIndex: 'contactPersonTel',
      key: 'contactPersonTel',
      width: 150,
      render: (text, record) => {
        if (record.buyClass === null) return '';
        if (text === 0 || record.buyClass === 0) return '-';
        return (
          <Input
            value={text}
            disabled={!isEdit}
            onChange={(e) => {
              handleChange(record, 'contactPersonTel', e.target.value);
            }}
          />
        );
      }
    },
    {
      title: '出库数量',
      dataIndex: 'productNum',
      key: 'productNum',
      onCell: () => ({
        style: {
          width: 60
        }
      }),
      onHeaderCell: () => ({
        style: { width: 90 }
      }),
      render: (text, record) => {
        return (
          <InputNumber
            min={0}
            value={text}
            style={{ width: 60 }}
            onChange={(e) => {
              handleChange(record, 'productNum', e);
            }}
          />
        );
      }
    },
    {
      title: '备注',
      dataIndex: 'outStockRemark ',
      key: 'outStockRemark ',
      render: (text, record) => {
        let str = '';
        return (
          <Tooltip title={record.outStockRemark || '暂无备注'}>
            <FormOutlined
              onClick={() => {
                isEdit &&
                  Modal.confirm({
                    title: '添加备注',
                    icon: null,
                    content: (
                      <Input.TextArea
                        allowClear
                        rows={4}
                        onChange={(e) => {
                          str = e.target.value;
                        }}
                      />
                    ),
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                      handleChange(record, 'outStockRemark', str);
                    }
                  });
              }}
            />
          </Tooltip>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 80,
      render: (_, record) => (
        <a
          onClick={() => {
            const arr = data.filter((item) => item.id !== record.id);
            setData(arr);
          }}
        >
          删除
        </a>
      )
    }
  ];

  if (outputType === 'double') {
    arr = arr.filter((item) => item.key !== 'productNum');
  }
  if (type === 'edit') {
    arr = arr.filter((item) => item.key !== 'operation');
  }

  return arr;
};

export const productColumns = ({
  productDataList: data,
  setProductDataList: setData,
  handleFindAll,
  type,
  outputType
}) => {
  const isEdit = type === 'add';
  const handleChange = (record, k, v) => {
    const idKey = isEdit ? 'tempId' : 'id';
    const arr = [...data];
    const i = arr.findIndex((item) => item[idKey] === record[idKey]);
    arr[i] = { ...record, [k]: v };
    setData(arr);
  };
  let arr = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: '商品条码',
      dataIndex: 'barCode',
      key: 'barCode'
    },
    {
      title: '产地',
      dataIndex: 'fromCompanyAddress',
      key: 'fromCompanyAddress',
      render: (text) => text || '-'
    },
    // {
    //   title: '供应商',
    //   dataIndex: 'fromCompanyName',
    //   key: 'fromCompanyName',
    //   render: (text) => text || '-'
    // },
    {
      title: '规格单位',
      dataIndex: 'spec',
      key: 'spec',
      render: (text, record) => {
        return (
          <span>
            {text}
            {record.specUnit}/{type == 'add' ? record.unit : record.uint}
          </span>
        );
      }
    },
    {
      title: '生产批次号',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      render: (text, record) => {
        if (!text) {
          return (
            <a onClick={() => handleFindAll({}, 'batchNumber', record.id, record.tempId)}>
              选择批次
            </a>
          );
        }
        return (
          <>
            <span>{text}</span>
            {isEdit && (
              <a
                onClick={() => handleFindAll({}, 'batchNumber', record.id, record.tempId)}
                style={{ marginLeft: 5 }}
              >
                修改
              </a>
            )}
          </>
        );
      }
    },
    {
      title: '库存量',
      dataIndex: 'stockNum',
      key: 'stockNum',
      render: (text) => (text === undefined ? '-' : text || 0)
    },
    {
      title: '出库数量',
      dataIndex: 'productNum',
      key: 'productNum',
      onCell: () => ({
        style: {
          width: 60
        }
      }),
      onHeaderCell: () => ({
        style: { width: 90 }
      }),
      render: (text, record) => {
        return record.batchNumber ? (
          <InputNumber
            min={0}
            max={record.stockNum}
            value={text}
            style={{ width: 60 }}
            onChange={(e) => {
              handleChange(record, 'productNum', e);
            }}
          />
        ) : (
          '-'
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 70,
      render: (_, record) => (
        <a
          onClick={() => {
            const arr = data.filter((item) => item.tempId !== record.tempId);
            setData(arr);
          }}
        >
          删除
        </a>
      )
    }
  ];

  if (outputType === 'single') {
    arr = arr.filter((item) => item.key !== 'productNum');
  }
  if (type === 'edit') {
    arr = arr.filter((item) => item.key !== 'operation');
  }

  return arr;
};
