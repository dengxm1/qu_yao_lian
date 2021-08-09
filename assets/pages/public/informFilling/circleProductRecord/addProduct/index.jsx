import React, { useEffect, useState } from 'react';
import {
  Button,
  Drawer,
  Input,
  Select,
  Row,
  Col,
  Form,
  message,
  Cascader,
  Radio,
  InputNumber
} from 'antd';
import NameLabel from 'components/NameLabel';
import FormBagType from 'components/FormBagType';
import FormInputSearch from 'components/FormInputSearch';
import utils from 'utils/index';
import changeCityLabel from 'utils/changeCityLabel.js';
import informFillingApi from 'api/informFilling.js';
import otherApi from 'api/other';
import './index.less';

const AddProduct = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const { visible, handleCancel, type, editData } = props;

  const [cityList, setCityList] = useState([]); //产地
  const [drugCategoryList, setDrugCategoryList] = useState([]); //药品类别
  const [drugSegmentList, setDrugSegmentList] = useState([]); //药品细分
  const [drugDosageFormsList, setDrugDosageFormsList] = useState([]); //药品剂型
  const [prescriptionCategoryList, setprescriptionCategoryList] = useState([]); //处方类别
  const [hasCode, setHasCode] = useState(null); //是否有药品本位码
  const [isBag, setIsbag] = useState(null); //是否有内包装
  const [city, setCity] = useState(null); //药品来源
  const [inputModalVisible, setInputModalVisible] = useState(false); //上市许可持有人--查看全部--显示
  const [allCompany, setAllCompany] = useState([]); //上市许可持有人--查看全部--列表数据
  const [searchData, setSearchData] = useState([]); //上市许可持有人--查看全部--选中数据

  const [form] = Form.useForm();

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
  const formItemLayoutOne = {
    labelCol: {
      xs: { span: 22 },
      sm: { span: 12 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 }
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
      } else {
        values.address = values.address ? values.address.join(',') : '';
        const params = {
          ...values,
          id: editData.id,
          enterCompanyType: '1',
          liscenceNumber: 'default'
        };
      }
    });
  };

  useEffect(() => {
    if (type) {
      console.log('type--', type);
    }
  }, [type]);

  const handleClose = () => {
    form.resetFields();
    handleCancel();
  };
  //药品条码搜获获取详情数据
  const handleSearchBar = (e) => {
    otherApi.getProductByBarCode(e).then((res) => {
      if (res?.data?.success) {
        form.setFieldsValue({
          ...res.data.data,
          uint: '',
          fromCompanyName: companyInfo.companyName,
          fromCompanyId: companyInfo.companyId,
          address: res?.data?.data?.address?.split(',')
        });
      } else {
        message.error(res.data.msg || res.data.message);
      }
    });
  };
  //字典值获取
  const getValue = (remark) => {
    otherApi.getValue({ type: remark }).then((res) => {
      if (res?.data?.success) {
        if (remark == 'drug_category') {
          //药剂类型
          setDrugCategoryList(res.data.data.dataList);
        } else if (remark == 'drug_segment') {
          //药剂细分
          setDrugSegmentList(res.data.data.dataList);
        } else if (remark == 'drug_dosage_forms') {
          //药品剂型
          setDrugDosageFormsList(res.data.data.dataList);
        } else if (remark == 'prescription_category') {
          //处方类别
          setprescriptionCategoryList(res.data.data.dataList);
        } else if (remark == 'country') {
          //进口产地
          setCityList(res.data.data.dataList);
        }
      }
    });
  };
  const handleChangeHascode = (e) => {
    setHasCode(e.target.value);
  };
  const handleChangeIsbag = (e) => {
    setIsbag(e.target.value);
  };
  const handleChangeCity = (e) => {
    setCity(e.target.value);
    setCityList([]);
    form.setFieldsValue({
      address: null
    });
    if (e.target.value == 1) {
      //国产
      otherApi.getRegionNew().then((res) => {
        if (res?.data?.data) {
          const data = res.data.data;
          changeCityLabel(data); //递归获取树结构
          setCityList(data);
        }
      });
    } else {
      //进口
      getValue('country');
    }
  };
  const getSupplierList = async (name, pageNum = 1, pageSize = 20) => {
    return informFillingApi
      .manufacturerList({ pageNum, pageSize, companyName: name })
      .then((res) => {
        if (res?.data?.data) {
          setAllCompany(res.data.data);
          return true;
        } else {
          return false;
        }
      });
  };
  const handleSeleted = (v) => {
    if (v && v.companyName) {
      setSearchData(v.companyName);
    }
    setInputModalVisible(false);
  };
  const handleFindAll = async (params, key) => {
    let flag = false;
    console.log('params--', params);
    if (key === 'saleName') {
      const { saleName = '', pageNum = 1, pageSize = 10 } = params;
      flag = await getSupplierList(saleName, pageNum, pageSize);
    }
    flag && setInputModalVisible(true);
  };
  const findAll = (key) => {
    return type !== 'edit' ? (
      <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => handleFindAll({}, key)}>
        查看全部
      </span>
    ) : null;
  };
  return (
    <Drawer
      title={type === 'add' ? '新增' : '编辑'}
      visible={visible}
      closable={true}
      width={1100}
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
        <NameLabel name={'流通药品基本信息'} />
        <div className="NameLabel_content">
          <Row gutter={24}>
            <Col span={24}>
              <div className="Radio_span_row">
                <Form.Item
                  {...formItemLayoutOne}
                  name="hasCode"
                  label="是否有药品本位码"
                  rules={[{ required: true, message: '请选择是否有药品本位码' }]}
                >
                  <Radio.Group value={hasCode} onChange={handleChangeHascode}>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                {hasCode == 2 ? <p>请在120天内填写药品本位码，否则将影响您的后续操作。</p> : null}
              </div>
            </Col>
            <Col span={12}>
              <Form.Item
                name="barCode1"
                label="药品本位码"
                rules={[
                  { required: hasCode == 1 ? true : false },
                  { validator: utils.handleCheckStandardCode }
                ]}
              >
                <Input placeholder={'请输入药品本位码'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="barCode2" label="药品条码">
                <Input.Search
                  suffix
                  onSearch={handleSearchBar}
                  placeholder={'请输入药品条码进行搜索'}
                  rules={[{ validator: utils.handleCheckBarcode }]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label={'药品通用名'} rules={[{ required: true }]}>
                <Input placeholder="请输入药品通用名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName2" label={'药品商品名'}>
                <Input placeholder="请输入药品商品名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName3" label={'批准文号'}>
                <Input placeholder="请输入批准文号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName4" label={'批准文号有效日期'}>
                <Input placeholder="请输入批准文号有效日期" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productClass" label="药品类别" rules={[{ required: true }]}>
                <Select
                  placeholder="请选择药品类别"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onFocus={() => getValue('drug_category')}
                >
                  {drugCategoryList.length
                    ? drugCategoryList.map((ele, index) => {
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
            <Col span={12}>
              <Form.Item name="productClass2" label="药品细分" rules={[{ required: true }]}>
                <Select
                  placeholder="请选择药品细分"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onFocus={() => getValue('drug_segment')}
                >
                  {drugSegmentList.length > 0
                    ? drugSegmentList.map((ele, index) => {
                        return (
                          <Select.Option key={ele.value} value={ele.value}>
                            {ele.name + ' ' + ele.value}
                          </Select.Option>
                        );
                      })
                    : ''}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productClass3" label="药品剂型">
                <Select
                  placeholder="请选择药品剂型"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onFocus={() => getValue('drug_dosage_forms')}
                >
                  {drugDosageFormsList.length > 0
                    ? drugDosageFormsList.map((ele, index) => {
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
            <Col span={12}>
              <Form.Item name="productClass4" label="处方类别">
                <Select
                  placeholder="请选择处方类别"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onFocus={() => getValue('prescription_category')}
                >
                  {prescriptionCategoryList.length > 0
                    ? prescriptionCategoryList.map((ele, index) => {
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
            <Col span={24}>
              <Form.Item name="productName5" label={'制剂规格'} {...formItemLayoutBlock}>
                <Input placeholder="请输入制剂规格" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <div className="Radio_span_row">
                <Form.Item
                  {...formItemLayoutOne}
                  name="isBag"
                  label="是否有内包装"
                  rules={[{ required: true, message: '请选择药品是否有内包装' }]}
                >
                  <Radio.Group value={isBag} onChange={handleChangeIsbag}>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Col>
            {isBag ? (
              <Col span={24}>
                <Form.Item
                  {...formItemLayoutBlock}
                  name="barCode"
                  label="包装规格"
                  rules={[{ required: true }]}
                >
                  <FormBagType isBag={isBag} from={form}></FormBagType>
                </Form.Item>
              </Col>
            ) : null}
            <Col span={12}>
              <Form.Item
                name="city"
                label="药品来源"
                rules={[{ required: true, message: '请选择药品来源' }]}
              >
                <Radio.Group value={city} onChange={handleChangeCity}>
                  <Radio value={1}>国产</Radio>
                  <Radio value={2}>进口</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="address" label={'产地'} rules={[{ required: true }]}>
                {city == 1 ? (
                  <Cascader options={cityList} />
                ) : city == 2 ? (
                  <Select
                    placeholder="请选择进口场地"
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {cityList.length > 0
                      ? cityList.map((ele, index) => {
                          return (
                            <Select.Option key={ele.value} value={ele.value}>
                              {ele.name}
                            </Select.Option>
                          );
                        })
                      : ''}
                  </Select>
                ) : (
                  <Input disabled placeholder="请先选择药品来源" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="shelfLife" label="有效期" rules={[{ required: true }]}>
                <Row gutter={24}>
                  <Col span={16}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="dateUnit"
                      className="dateUnit"
                      style={{ marginBottom: '0' }}
                      rules={[{ required: true, message: '有效期单位不能为空' }]}
                    >
                      <Select>
                        <Select.Option value="小时">小时</Select.Option>
                        <Select.Option value="天">天</Select.Option>
                        <Select.Option value="月">月</Select.Option>
                        <Select.Option value="年">年</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="备注" name={'remark'} {...formItemLayoutBlock}>
                <Input.TextArea maxLength="500" row={4} />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <NameLabel name={'厂商信息'} />
        <div className="NameLabel_content">
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="productName" {...formItemLayoutBlock} label={'上市许可持有人'}>
                <Select
                  style={{
                    width: '80%',
                    marginRight: 5
                  }}
                  placeholder="请输入选择上市许可持有人"
                  showSearch
                  allowClear
                  value={searchData}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {allCompany.length > 0
                    ? allCompany.map((ele, index) => {
                        return (
                          <Select.Option key={ele.value} value={ele.value}>
                            {ele.name}
                          </Select.Option>
                        );
                      })
                    : ''}
                </Select>
                {findAll('saleName')}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="productName" {...formItemLayoutBlock} label={'生产企业'}>
                <Select
                  style={{
                    width: '80%',
                    marginRight: 5
                  }}
                  placeholder="请输入选择生产企业"
                  showSearch
                  allowClear
                  value={searchData}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {allCompany.length > 0
                    ? allCompany.map((ele, index) => {
                        return (
                          <Select.Option key={ele.value} value={ele.value}>
                            {ele.name}
                          </Select.Option>
                        );
                      })
                    : ''}
                </Select>
                {findAll('saleName')}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="productName" {...formItemLayoutBlock} label={'生产企业地址'}>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <NameLabel name={'其他信息'} />
        <div className="NameLabel_content">
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item {...formItemLayoutBlock} label="主治功能" name={'remark'}>
                <Input.TextArea maxLength="500" row={4} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item {...formItemLayoutBlock} label="不良反应" name={'remark'}>
                <Input.TextArea maxLength="500" row={4} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item {...formItemLayoutBlock} label="禁忌" name={'remark'}>
                <Input.TextArea maxLength="500" row={4} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item {...formItemLayoutBlock} label="注意事项" name={'remark'}>
                <Input.TextArea maxLength="500" row={4} />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <FormInputSearch
          visible={inputModalVisible}
          ModalTitle={'选择上市许可持有人'}
          searchKey={'saleName'}
          dataSource={allCompany}
          onFocus={(v) => handleFindAll(v, 'saleName')}
          handleSeleted={(v) => handleSeleted(v)}
        />
      </Form>
    </Drawer>
  );
};

export default AddProduct;
