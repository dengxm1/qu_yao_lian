import React, { useImperativeHandle, memo } from 'react';
import { Form } from 'antd';
import { createTags } from 'utils/createAntTags';

const HeaderSeachForm = ({ onSearch, formArr = [], actionBtns = [], cRef }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    let temp = {};
    if (Object.keys(values).length > 0) {
      for (const key in values) {
        if (Object.hasOwnProperty.call(values, key)) {
          const element = values[key];
          if (element) {
            temp[key] = element;
          }
        }
      }
    }
    onSearch(temp);
  };

  useImperativeHandle(cRef, () => ({
    resetFields: () => {
      form.resetFields();
    }
  }));

  const defaultActionBtns = [
    {
      tagType: 'Button',
      tagText: '搜索',
      tagProps: {
        type: 'primary',
        htmlType: 'submit'
      }
    },
    {
      tagType: 'Button',
      tagText: '重置',
      tagProps: {
        type: 'default',
        onClick: () => {
          form.resetFields();
          onSearch({});
        }
      }
    }
  ].concat(actionBtns);

  return (
    <Form layout="inline" form={form} onFinish={onFinish}>
      {formArr.map((item, index) => (
        <Form.Item {...item.props} key={index}>
          {createTags(item)}
        </Form.Item>
      ))}
      {defaultActionBtns.map((btn) => (
        <Form.Item {...btn.props} key={btn.tagText}>
          {createTags(btn)}
        </Form.Item>
      ))}
    </Form>
  );
};

export default memo(HeaderSeachForm);
