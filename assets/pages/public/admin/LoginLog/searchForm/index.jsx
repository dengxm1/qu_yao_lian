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
        ...values,
        startDate: values.time ? moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: values.time ? moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss') : ''
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
        <Form.Item name="userName" style={{ marginRight: '20px' }}>
          <Input allowClear style={{ width: 120 }} placeholder="用户名" />
        </Form.Item>
        <Form.Item name="time">
          <DatePicker.RangePicker />
        </Form.Item>
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
