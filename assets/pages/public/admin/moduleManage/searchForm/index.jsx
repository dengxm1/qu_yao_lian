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
      values.inDate = values.inDate ? moment(values.inDate).format('YYYY-MM-DD') : '';
      getSearchData(values);
      getData(1, 10, values);
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
        <FormItem name="templateName">
          <Input placeholder="企业类型" />
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
