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
        start: values.time ? moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        end: values.time ? moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss') : ''
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
        <FormItem name="productName">
          <Input placeholder="入库单号" />
        </FormItem>
        <FormItem name="productName">
          <Input placeholder="药品条码" />
        </FormItem>
        <FormItem name="productName">
          <Input placeholder="生产批次号" />
        </FormItem>
        <FormItem name="productName">
          <Input placeholder="入库状态" />
        </FormItem>
        <FormItem name="time" style="">
          <DatePicker.RangePicker />
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
