import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import './index.less';

const FormItem = Form.Item;
const SearchForm = (props) => {
  const { searchDatas, getDataSource } = props.OutRegister;
  const { saveSearchData } = props;
  const { getData } = props;
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

  useEffect(() => {
    if (JSON.stringify(searchDatas) !== '{}') {
      searchDatas.createDate = searchDatas.createDate ? moment(searchDatas.createDate) : '';
      searchDatas.outDateStart = searchDatas.outDateStart ? moment(searchDatas.outDateStart) : '';
      searchDatas.outDateEnd = searchDatas.outDateEnd ? moment(searchDatas.outDateEnd) : '';
      form.setFieldsValue({ ...searchDatas });
    }
  }, [searchDatas]);

  const handleSearch = () => {
    form.validateFields().then((values) => {
      values.createDate = values.createDate ? moment(values.createDate).format('YYYY-MM-DD') : null;
      values.outDateStart =
        values.outDate && values.outDate[0] ? moment(values.outDate[0]).format('YYYY-MM-DD') : null;
      values.outDateEnd =
        values.outDate && values.outDate[1] ? moment(values.outDate[1]).format('YYYY-MM-DD') : null;
      delete values.outDate;
      saveSearchData(values);
      getData(1, 10, values);
    });
  };

  const handleReset = () => {
    form.resetFields();
    getData(1, 10);
    saveSearchData({});
  };

  return (
    <div className="searchForm">
      <Form className="formBorder" form={form} {...formItemLayout}>
        <FormItem name="outOrderNo">
          <Input placeholder="出库单号" />
        </FormItem>
        <FormItem name="companyName">
          <Input placeholder="经销商" />
        </FormItem>
        <FormItem name="registerPerson">
          <Input placeholder="登记人" />
        </FormItem>
        <FormItem name="createDate">
          <DatePicker placeholder="登记日期" />
        </FormItem>
        <FormItem name="outDate">
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

export default inject('OutRegister')(observer(SearchForm));
