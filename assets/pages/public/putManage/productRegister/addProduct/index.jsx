import React, { useEffect, useState, useRef } from 'react';
import { Button, Drawer, Input, Select, Row, Col, Form, message, DatePicker, Table } from 'antd';
import NameLabel from 'components/NameLabel';
import FormInputSearch from 'components/FormInputSearch';
import SelectedBatch from '../seletedBatch/index';
import informFillingApi from 'api/informFilling.js';
import otherApi from 'api/other';
import './index.less';

const AddProduct = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));

  const { visible, handleCancel, type, editData, getData } = props;
  const [form] = Form.useForm();
  const [searchData, setSearchData] = useState([]);
  const [allCompany, setAllCompany] = useState(null);
  const [InputModalVisible, setInputModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [saveCheck, setSaveCheck] = useState(false);
  const [addFormulaForm] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 22 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (type === 'add') {
        const params = {
          ...values,
          enterCompanyType: '1',
          liscenceNumber: 'default'
        };
        if (saveCheck) {
          addFormulaForm.validateFields().then((formulaValues) => {
            params.formula = { ...formulaValues };
            informFillingApi.productAdd(params).then((res) => {
              if (res?.data?.data) {
                message.success('新增成功');
                handleClose();
                getData(1, 10);
              } else {
                message.error(res.data.msg || res.data.message);
              }
            });
          });
        } else {
          params.formula = {};
          informFillingApi.productAdd(params).then((res) => {
            if (res?.data?.data) {
              message.success('新增成功');
              handleClose();
              getData(1, 10);
            } else {
              message.error(res.data.msg || res.data.message);
            }
          });
        }
      } else {
        values.address = values.address ? values.address.join(',') : '';

        const params = {
          ...values,
          id: editData.id,
          rml: tableData,
          enterCompanyType: '1',
          liscenceNumber: 'default'
        };
        if (saveCheck) {
          addFormulaForm.validateFields().then((formulaValues) => {
            params.formula = { ...formulaValues };
            informFillingApi.productUpdate(params).then((res) => {
              if (res?.data?.data) {
                message.success('编辑成功');
                handleClose();
                getData(1, 10);
              } else {
                message.error(res.data.msg || res.data.message);
              }
            });
          });
        } else {
          params.formula = {};
          informFillingApi.productUpdate(params).then((res) => {
            if (res?.data?.data) {
              message.success('编辑成功');
              handleClose();
              getData(1, 10);
            } else {
              message.error(res.data.msg || res.data.message);
            }
          });
        }
      }
    });
  };
  useEffect(() => {
    if (type) {
      setTableData([]);
      setSaveCheck(false);
      form.setFieldsValue({
        fromCompanyName: companyInfo.companyName,
        fromCompanyId: companyInfo.companyId
      });

      if (type === 'edit') {
        const editDatas = Object.assign({}, editData);
        form.setFieldsValue({ ...editDatas });
      } else {
        form.setFieldsValue({
          fromCompanyAddress: companyInfo.fromCompanyAddress
        });
      }
    }
  }, [type]);

  const handleClose = () => {
    handleCancel();
    form.resetFields();
    addFormulaForm.resetFields();
  };
  const getBuyerList = async (companyName = '', pageNum = 1, pageSize = 20) => {
    return informFillingApi.supplierList({ pageNum, pageSize, companyName }).then((res) => {
      if (res?.data?.data) {
        setAllCompany(res.data.data);
        return true;
      } else {
        return false;
      }
    });
  };
  const onSearchCompany = (companyName) => {
    setSearchData(companyName);
    getBuyerList(companyName);
  };
  const handleSelectCompany = (e) => {
    let compayMessage = {};
    compayMessage = allCompany.list.filter((v) => v.companyName == e)[0];
    setSearchData(e);
    otherApi
      .getCompanyByUniformcode({ uniformCode: compayMessage.uniformCode.replace(/\s/g, '') })
      .then((res) => {
        const data = res.data.data;
        form.setFieldsValue({
          ...compayMessage,
          saleUniformCode: data.uniformCode.replace(/\s/g, ''),
          saleId: data.companyId,
          saleName: e
        });
      });
  };
  const handleFindAll = async (params, key) => {
    let flag = false;
    if (key === 'saleName') {
      const { saleName = '', pageNum = 1, pageSize = 10 } = params;
      flag = await getBuyerList(saleName, pageNum, pageSize);
    }
    flag && setInputModalVisible(true);
  };
  const handleSeleted = (v) => {
    if (v && v.companyName) {
      handleSelectCompany(v.companyName);
      form.setFieldsValue({ saleName: v.companyName });
    }
    setInputModalVisible(false);
  };
  const handleGetTableData = (data) => {
    console.log('data--', data);
    setTableData(data);
  };
  const findAll = (key) => {
    return type !== 'edit' ? (
      <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => handleFindAll({}, key)}>
        查看全部
      </span>
    ) : null;
  };
  const columns = [
    {
      title: '批次编号',
      dataIndex: 'batchNumber',
      key: 'batchNumber'
    },

    {
      title: '供应商',
      dataIndex: 'fromCompanyName',
      key: 'fromCompanyName',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '剩余数量',
      dataIndex: 'stockNum',
      key: 'stockNum'
    }
  ];
  return (
    <Drawer
      title={type === 'add' ? '新增' : '编辑'}
      visible={visible}
      closable={true}
      width={1000}
      maskClosable={false}
      className="addDrawer"
      onClose={handleClose}
      footer={
        <div>
          <Button type="primary" onClick={handleSubmit}>
            确认并提交
          </Button>
          <Button onClick={handleClose}>关闭</Button>
        </div>
      }
    >
      <Form form={form} {...formItemLayout}>
        <NameLabel name={'入库信息'} />
        <div className="NameLabel_content">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="productionDate" label={'入库时间'} rules={[{ required: true }]}>
                <DatePicker style={{ width: '180px' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="productName" label={'登记人'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'登记人联系电话'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <NameLabel name={'上游信息'} />
        <div className="NameLabel_content">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="saleName"
                label="单位名称"
                rules={[{ required: true, message: '单位名称不能为空' }]}
              >
                <Select
                  style={{
                    width: type == 'add' ? 195 : '100%',
                    marginRight: 5
                  }}
                  placeholder="请选择单位名称"
                  showSearch
                  value={searchData}
                  disabled={type == 'add' ? false : true}
                  onSearch={onSearchCompany}
                  onFocus={() => getBuyerList('')}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  filterOption={false}
                  onChange={handleSelectCompany}
                >
                  {allCompany &&
                    allCompany.list.map((ele, index) => {
                      return (
                        <Select.Option key={index} value={ele.companyName}>
                          {ele.companyName}
                        </Select.Option>
                      );
                    })}
                </Select>
                {findAll('saleName')}
              </Form.Item>
              <Form.Item name="saleId" style={{ display: 'none' }}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="saleUniformCode"
                label="统一社会信用代码"
                rules={[{ required: true, message: '社会统一信用代码不能为空' }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="联系人"
                rules={[{ required: true, message: '联系人不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPersonTel"
                label="联系电话"
                rules={[{ required: true, message: '联系电话不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <NameLabel name={'流通药品明细'} />
        <div className="NameLabel_content">
          <Row gutter={24}>
            <Col span={24}>
              {React.useMemo(() => (
                <SelectedBatch
                  type={type}
                  dataSource={tableData}
                  handleGetTableData={handleGetTableData}
                />
              ))}
            </Col>
          </Row>
        </div>
      </Form>
      {type != 'edit' && (
        <FormInputSearch
          visible={InputModalVisible}
          ModalTitle={'选择企业'}
          searchKey={'saleName'}
          dataSource={allCompany}
          onFocus={(v = {}) => handleFindAll(v, 'saleName')}
          handleSeleted={(v) => handleSeleted(v)}
        />
      )}
    </Drawer>
  );
};

export default AddProduct;
