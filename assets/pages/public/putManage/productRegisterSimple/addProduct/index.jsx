import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Drawer,
  Input,
  Select,
  Row,
  Col,
  Divider,
  Form,
  message,
  Upload,
  Cascader,
  Icon,
  DatePicker,
  InputNumber
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';
import changeCityLabel from 'utils/changeCityLabel.js';
import NameLabel from 'components/NameLabel';
import systemApi from 'api/system.js';
import inRegisterApi from 'api/inRegister.js';
import dictionaryApi from 'api/dictionary.js';
import informFillingApi from 'api/informFilling.js';
import otherApi from 'api/other';
import codeManageApi from 'api/codeManage.js';
import './index.less';

const AddProduct = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const typeList = JSON.parse(sessionStorage.getItem('typeList'));

  const { visible, handleCancel, type, editData, getData } = props;
  const [form] = Form.useForm();
  const [specValue, setSpecValue] = useState('');
  const [unitValue, setUnitValue] = useState('');
  const [unitList, setUnitList] = useState([]);

  const [specUnitValue, setSpecUnitValue] = useState('');
  const [cityList, setCityList] = useState([]);
  const [executionStandardlist, setExecutionStandardlist] = useState([]); //执行标准
  const [foodTypeList, setFoodTypeList] = useState([]);

  const [fileList, setFile] = useState([]);
  const [hasCode, setHasCode] = useState(null);
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
  const formItemLayoutBlock = {
    labelCol: {
      xs: { span: 22 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (type === 'add') {
        values.address = values.address.join(',');
        const params = {
          ...values,
          enterCompanyType: '1',
          liscenceNumber: 'default'
        };
        informFillingApi.productAdd(params).then((res) => {
          if (res?.data?.data) {
            message.success('新增成功');
            handleClose();
            getData(1, 10);
          } else {
            message.error(res.data.msg || res.data.message);
          }
        });
      } else {
        values.address = values.address ? values.address.join(',') : '';
        const params = {
          ...values,
          id: editData.id,
          enterCompanyType: '1',
          liscenceNumber: 'default'
        };
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
    });
  };
  useEffect(() => {
    if (type) {
      form.setFieldsValue({
        fromCompanyName: companyInfo.companyName,
        fromCompanyId: companyInfo.companyId
      });
      setHasCode(null);
      if (type === 'edit') {
        const editDatas = Object.assign({}, editData);
        editDatas.address = editDatas.address ? editDatas.address.split(',') : '';
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
  };
  //字典值获取
  const getValue = (remark) => {
    otherApi.getValue({ type: remark }).then((res) => {
      if (res?.data?.success) {
        if (remark == 'execution_standard') {
          //执行标准
          setExecutionStandardlist(res.data.data.dataList);
        }
      }
    });
  };
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
        <NameLabel name={'基本信息'} />
        <div className="NameLabel_content">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="productName" label={'药品通用名'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'药品本位码'} rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'药品商品名'}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'产地'} rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'药品类别'} rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'药品细分'} rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'药品剂型'}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'处方类别'}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'制剂规格'}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'包装规格'}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'有效期'}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'批准文号'}>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <NameLabel name={'厂商信息'} />
        <div className="NameLabel_content">
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="productName"
                {...formItemLayoutBlock}
                label={'上市许可持有人'}
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <NameLabel name={'其他信息'} />
        <div className="NameLabel_content">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="productionDate" label={'生产日期'} rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productioncode" label={'生产批次'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="num" label={'入库数量'} rules={[{ required: true }]}>
                <InputNumber precision={0} placeholder="请输入入库数量"></InputNumber>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="weight" label={'入库重量'}>
                <InputNumber precision={3} placeholder="请输入入库重量"></InputNumber>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="executionStandard" label={'执行标准'} rules={[{ required: true }]}>
                <Select
                  placeholder="请输入选择执行标准"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onFocus={() => getValue('execution_standard')}
                >
                  {executionStandardlist.length
                    ? executionStandardlist.map((ele, index) => {
                        return (
                          <Select.Option key={ele.value} value={ele.value}>
                            {ele.name}
                          </Select.Option>
                        );
                      })
                    : ''}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </Drawer>
  );
};

export default AddProduct;
