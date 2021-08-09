import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import './index.less';

const FormItem = Form.Item;
const SearchForm = (props) => {
  const { getData, getSearchData } = props;

  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 12
    }
  };

  const handleSearch = () => {
    form.validateFields().then((values) => {
      const params = {
        ...values
      };
      delete params.time;
      getData(1, 10, params);
      getSearchData(values);
    });
  };
  const handleReset = () => {
    getData(1, 10);
    form.resetFields();
    getSearchData({});
  };

  return (
    <div className="searchForm">
      <Form className="formBorder" form={form} {...formItemLayout}>
        <FormItem name="companyName">
          <Input placeholder="企业名称" />
        </FormItem>
        <FormItem name="uniformCode">
          <Input placeholder="社会信用代码" />
        </FormItem>
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

export default SearchForm;
