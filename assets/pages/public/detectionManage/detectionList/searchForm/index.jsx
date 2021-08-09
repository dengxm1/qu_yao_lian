import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import './index.less';

const FormItem = Form.Item;
const SearchForm = (props) => {
  const { getSearchData, getData } = props;
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };

  const handleSearch = () => {
    form.validateFields().then((values) => {
      values.inDateStart =
        values.inDate && values.inDate[0] ? moment(values.inDate[0]).format('YYYY-MM-DD') : null;
      values.inDateEnd =
        values.inDate && values.inDate[1] ? moment(values.inDate[1]).format('YYYY-MM-DD') : null;
      delete values.inDate;
      getSearchData(values);
      getData(1, 10, values);
    });
  };
  const handleReset = () => {
    getData(1);
    form.resetFields();
    getSearchData({});
  };
  return (
    <div className="searchForm">
      <Form className="formBorder" form={form}>
        <FormItem name="inOrderNo">
          <Input placeholder="入库单号" />
        </FormItem>
        <FormItem name="productName">
          <Input placeholder="药品通用名" />
        </FormItem>
        <FormItem name="barCode">
          <Input placeholder="药品条码" />
        </FormItem>
        <FormItem name="generateStatus">
          <Select placeholder="凭证状态">
            <Select.Option value={0}>未上传</Select.Option>
            <Select.Option value={1}>已上传</Select.Option>
          </Select>
        </FormItem>
        <FormItem name="inDate">
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
