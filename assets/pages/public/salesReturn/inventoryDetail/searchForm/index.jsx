import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import './index.less';

const FormItem = Form.Item;
const SearchForm = (props) => {
  const { getData, searchData } = props;
  const [form] = Form.useForm();
  const addFormItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 12
    }
  };
  const handleSearch = () => {
    form.validateFields().then((values) => {
      searchData(values);
    });
  };

  return (
    <div className="searchForm">
      <Form className="formBorder" form={form} {...addFormItemLayout}>
        <FormItem name="productNo">
          <Input placeholder="单号" />
        </FormItem>
        <FormItem name="contact">
          <Input placeholder="原料条码" />
        </FormItem>
        <FormItem name="productName">
          <Select placeholder="供货商名称">
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
          </Select>
        </FormItem>
        <FormItem name="credit">
          <Select placeholder="出入库状态">
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
          </Select>
        </FormItem>
        <FormItem name="id">
          <DatePicker placeholder="出入库日期" />
        </FormItem>
      </Form>
      <div className="search-btns">
        <Button className="search-btn" type="primary" onClick={handleSearch}>
          查询
        </Button>
        <Button className="search-btn" type="primary">
          重置
        </Button>
        <Button className="search-btn">导出</Button>
      </div>
    </div>
  );
};

export default SearchForm;
