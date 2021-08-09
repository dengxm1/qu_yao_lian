import React from 'react';
import { Form, Button } from 'antd';
import { createTags } from 'utils/createAntTags';

const QueryDataCondition = (props) => {
  const { formArr } = props;
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
  };

  const onFinishFailed = (values) => {};

  const handleReset = () => {
    form.current.resetFields();
  };

  return (
    <div className="form-area">
      <Form
        name="basic"
        layout="inline"
        ref={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {formArr.map((item, index) => {
          return (
            <Form.Item {...item.props} key={index}>
              {createTags(item)}
            </Form.Item>
          );
        })}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button className="search-btn" onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QueryDataCondition;
