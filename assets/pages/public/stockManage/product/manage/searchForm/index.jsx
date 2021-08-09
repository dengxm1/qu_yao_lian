import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import { inject, observer } from 'mobx-react';
import './index.less';

const FormItem = Form.Item;
const SearchForm = (props) => {
  const { getData, searchData } = props;
  const { searchDatas, saveSearchData } = props.InventoryManage;
  const [form] = Form.useForm();

  const addFormItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 12
    }
  };

  useEffect(() => {
    // if (JSON.stringify(searchDatas) !== '{}') {
    //   form.setFieldsValue({ ...searchDatas });
    // } else {
    //   form.setFieldsValue({});
    // }
  }, [searchDatas]);

  const handleSearch = () => {
    form.validateFields().then((values) => {
      searchData({ ...values });
      saveSearchData({ ...values });
      getData(1, 10, { ...values });
    });
  };

  const handleReset = () => {
    form.resetFields();
    saveSearchData({});
    getData(1, 10);
  };

  return (
    <div className="searchForm">
      <Form className="formBorder" form={form} {...addFormItemLayout}>
        <FormItem name="productName">
          <Input placeholder="成品名称" />
        </FormItem>
        <FormItem name="barCode">
          <Input placeholder="商品条码" />
        </FormItem>
        {/* <FormItem name="stockInType">
          <Select placeholder="库存类型">
            <Select.Option value="0">生产入库</Select.Option>
            <Select.Option value="1">物料入库</Select.Option>
            <Select.Option value="-1">流通入库</Select.Option>
          </Select>
        </FormItem> */}
      </Form>
      <div className="search-btns">
        <Button className="search-btn" type="primary" onClick={handleSearch}>
          查询
        </Button>
        <Button className="search-btn" onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
};

export default inject('InventoryManage')(observer(SearchForm));
