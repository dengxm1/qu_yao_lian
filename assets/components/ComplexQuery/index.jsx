import React, { useState, useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import './index.less';
const { Option } = Select;
const a = 'popo';
const b = { a, b };

function foo(items) {
  return items.filter((item) => item.checked).map((item) => item.value);
}

const ComplexQuery = (props) => {
  const [localFields, setLocalFields] = useState([]);
  const [asyncfields, setAsyncfields] = useState([]);

  useEffect(() => {
    setLocalFields(getComplexFields());
  }, []);

  const { getFieldDecorator } = props.form;

  const { searchFields } = props;

  const getOptions = (data, dataType, callback) => {
    switch (dataType) {
      case 'api':
        callback().then((res) => {
          if (res && res.data.data) {
            console.info(res.data.data);
            setAsyncfields(res.data.data.map((d) => <Option key={d.value}>{d.text}</Option>));
          }
        });
        break;
      default:
        if (data) {
          return data.map((d) => <Option key={d.value}>{d.text}</Option>);
        }
        break;
    }
  };

  const getComplexFields = () => {
    const children = [];
    for (let i in searchFields) {
      let { name, title, showType, dataType, data, callback } = searchFields[i];
      let a = 'iname';
      switch (showType) {
        case 'multiSelect':
          children.push(
            <Form.Item label={title} key={name}>
              {getFieldDecorator(`${name}`)(
                <Select placeholder={title}>{getOptions(data, dataType, callback)}</Select>
              )}
            </Form.Item>
          );
          break;
        case 'select':
          children.push(
            <Form.Item label={title} key={name}>
              {getFieldDecorator(`${name}`)(
                <Select placeholder={title}>{getOptions(data, dataType, callback)}</Select>
              )}
            </Form.Item>
          );
          break;
        default:
          children.push(
            <Form.Item label={title} key={name}>
              {getFieldDecorator(`${name}`)(<Input placeholder={title} />)}
            </Form.Item>
          );
          break;
      }
    }
    return children;
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  return (
    <div className="complexQuery">
      <Form {...formItemLayout}>{localFields}</Form>
    </div>
  );
};

export default Form.create()(ComplexQuery);
