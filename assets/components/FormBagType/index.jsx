import React, { useEffect, useState } from 'react';
import { Input, Select, Row, Col, Divider, Form, message, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dictionaryApi from 'api/dictionary.js';
import otherApi from 'api/other';
import './index.less';

const FormBagType = (props) => {
  //isBag 1有内包装 2无内包装
  const { isBag, form } = props;

  const [specUnitInput, setSpecUnitInput] = useState(''); //规格值
  const [specUnitValue, setSpecUnitValue] = useState(''); //规格单位
  const [specNum, setSpecNum] = useState(''); //内包装数量
  const [uintOut, setUintOut] = useState(''); //外包装单位
  const [unitList, setUnitList] = useState([]); //规格单位列表
  const [specUnitOpen, setSpecUnitOpen] = useState(false); //规格单位下拉框显示
  const [unitOpen, setUnitOpen] = useState(false); //外包装单位下拉框显示
  const [specUnit, setSpecUnit] = useState(''); //规格单位--新增
  const [unitInput, setUnitInput] = useState(''); //外包装单位--新增

  useEffect(() => {
    if (unitList.length == 0) {
      getUnitList();
    }
  }, [unitList]);
  //获取规格单位
  const getUnitList = () => {
    otherApi.getUnitList().then((res) => {
      if (res?.data?.success) {
        setUnitList(res.data.data.dataList);
      }
    });
  };
  const addItem = () => {
    if (specUnit != '' || unitInput != '') {
      otherApi
        .addUnit({
          value: specUnit || unitInput
        })
        .then((res) => {
          if (res?.data?.success) {
            getUnitList();
            setUnitInput('');
            setUnitOpen('');
          } else {
            message.error(res.data.message || res.data.msg);
          }
        });
    } else {
      message.error('新增单位不能为空');
    }
  };
  const onUnitChange = (e) => {
    setUnitInput(e.target.value);
  };

  const handleDelete = (e, ele, type) => {
    e.preventDefault();
    dictionaryApi.deleteUnit({ id: ele.id }).then((res) => {
      if (res?.data?.success) {
        getUnitList();
        if (type == 'specUnit') {
          form.setFieldsValue({ specUnit: '' });
        } else {
          form.setFieldsValue({ uint: '' });
        }
        message.success('删除成功，误删可新增');
      }
    });
  };
  return (
    <div className="bagComponent">
      <Row gutter={24}>
        <Col span={4}>
          <Form.Item
            name="specUnitInput"
            style={{ marginBottom: '0' }}
            rules={[{ required: true, message: '规格不能为空' }]}
          >
            <InputNumber
              precision={3}
              onBlur={(e) => setSpecUnitInput(e.target.value)}
            ></InputNumber>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            name="specUnit"
            style={{ marginBottom: '0' }}
            rules={[{ required: true, message: '规格单位不能为空' }]}
          >
            <Select
              className="unit"
              style={{ width: '100%' }}
              onChange={(e) => setSpecUnitValue(e)}
              dropdownClassName="dropClassname"
              onDropdownVisibleChange={(open) => setSpecUnitOpen(open)}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                    <Input
                      style={{ flex: 'auto' }}
                      value={specUnit}
                      onChange={(e) => setSpecUnit(e.target.value)}
                    />
                    <a
                      style={{
                        flex: 'none',
                        padding: '8px',
                        display: 'block',
                        cursor: 'pointer'
                      }}
                      onClick={addItem}
                    >
                      <PlusOutlined />
                      新增
                    </a>
                  </div>
                </div>
              )}
            >
              {unitList.length > 0
                ? unitList.map((ele, index) => {
                    return (
                      <Select.Option key={ele.name} value={ele.value}>
                        <div style={{ display: ' flex', justifyContent: 'space-between' }}>
                          <span>{ele.value}</span>
                          <span
                            onClick={(e) => handleDelete(e, ele, 'specUnit')}
                            style={{
                              zIndex: '111',
                              display: specUnitOpen ? 'block' : 'none'
                            }}
                          >
                            x
                          </span>
                        </div>
                      </Select.Option>
                    );
                  })
                : ''}
            </Select>
          </Form.Item>
        </Col>
        {isBag == 1 ? (
          <>
            <span>*</span>
            <Col span={4}>
              <Form.Item
                name="specNum"
                style={{ marginBottom: '0' }}
                rules={[{ required: true, message: '内包装数量不能为空' }]}
              >
                <InputNumber precision={0} onBlur={(e) => setSpecNum(e.target.value)}></InputNumber>
              </Form.Item>
            </Col>
          </>
        ) : null}
        <span>/</span>
        <Col span={4}>
          <Form.Item
            style={{ marginBottom: '0' }}
            name="uintOut"
            rules={[{ required: true, message: '外包装单位不能为空' }]}
          >
            <Select
              className="unit"
              style={{ width: '100%' }}
              onChange={(e) => setUintOut(e)}
              dropdownClassName="dropClassname"
              onDropdownVisibleChange={(open) => setUnitOpen(open)}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                    <Input style={{ flex: 'auto' }} value={unitInput} onChange={onUnitChange} />
                    <a
                      style={{
                        flex: 'none',
                        padding: '8px',
                        display: 'block',
                        cursor: 'pointer'
                      }}
                      onClick={addItem}
                    >
                      <PlusOutlined />
                      新增
                    </a>
                  </div>
                </div>
              )}
            >
              {unitList.length > 0
                ? unitList.map((ele, index) => {
                    return (
                      <Select.Option key={ele.name} value={ele.value}>
                        <div style={{ display: ' flex', justifyContent: 'space-between' }}>
                          <span>{ele.value}</span>
                          <span
                            onClick={(e) => handleDelete(e, ele, 'unit')}
                            style={{
                              zIndex: '111',
                              display: unitOpen ? 'block' : 'none'
                            }}
                          >
                            x
                          </span>
                        </div>
                      </Select.Option>
                    );
                  })
                : ''}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <p className="des">
        包装规格说明：
        {isBag == 1
          ? '填入最小销售包装规格，如50g*10/盒，表示每盒10剂，每剂50g'
          : '填入最小销售包装规格，如50g/盒，表示每盒50g'}
      </p>
      <p>
        您填入的包装规格为:
        <span style={{ color: '#2D96FF' }}>
          {isBag == 2
            ? specUnitInput && specUnitValue && uintOut
              ? `${specUnitInput}${specUnitValue}/${uintOut}`
              : ''
            : specUnitInput && specUnitValue && specNum && uintOut
            ? `${specUnitInput}${specUnitValue}*${specNum}/${uintOut}`
            : ''}
        </span>
      </p>
    </div>
  );
};
export default FormBagType;
