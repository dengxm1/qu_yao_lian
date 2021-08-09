import React from 'react';
import { Modal, Form, Input, InputNumber, message, Select } from 'antd';
import proCityLetCodeApi from 'api/proCityLetCode';
const { Option } = Select;

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 10
  }
};
const productList = [
  '猪肉及其副产品',
  '牛羊肉及其副产品',
  '鸡鸭及其副产品',
  '三文鱼及其产品',
  '金枪鱼及其产品',
  '银鳕鱼及其产品',
  '甲壳动物及其产品',
  '其他水产品'
];

class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productType: ''
    };
    this.formRef = React.createRef();
  }

  handleOk = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        console.log(values);
        proCityLetCodeApi
          .insertCheck({
            num: values.num
          })
          .then((res) => {
            if (res.data.code === '0') {
              proCityLetCodeApi.insert(values).then((res) => {
                if (!res) {
                  message.success('领码成功');
                  this.setState({
                    productType: ''
                  });
                  this.props.onClose(true);
                  this.formRef.current.resetFields();
                }
              });
            } else {
              message.error(res.data.message);
            }
          });
      })
      .catch((errorInfo) => {
        /*
              errorInfo:
                {
                  values: {
                    username: 'username',
                    password: 'password',
                  },
                  errorFields: [
                    { password: ['username'], errors: ['Please input your Password!'] },
                  ],
                  outOfDate: false,
                }
              */
      });
  };
  handleCancel = () => {
    this.setState({
      productType: ''
    });
    this.props.onClose();
    this.formRef.current.resetFields();
  };
  handleSelectChange = (value) => {
    console.log(value);
    this.setState({
      productType: value
    });
  };

  render() {
    const { visible, organId, organName, userId, userName } = this.props;
    return (
      <Modal
        title="省市领码"
        visible={visible}
        centered
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form {...layout} ref={this.formRef}>
          <Form.Item name="organId" initialValue={organId} style={{ display: 'none' }}>
            <span></span>
          </Form.Item>
          <Form.Item name="organName" initialValue={organName} style={{ display: 'none' }}>
            <span></span>
          </Form.Item>
          <Form.Item name="userId" initialValue={userId} style={{ display: 'none' }}>
            <span></span>
          </Form.Item>
          <Form.Item name="userName" initialValue={userName} style={{ display: 'none' }}>
            <span></span>
          </Form.Item>
          <Form.Item
            label="领码数量"
            name="num"
            rules={[
              { required: true, message: '请输入领码数量!' },
              { type: 'number', min: 0, max: 200000 }
            ]}
          >
            <InputNumber precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="产品类别"
            name="productType"
            rules={[{ required: false, message: '请选择产品类别!' }]}
          >
            <Select onChange={this.handleSelectChange}>
              {productList.map((item, i) => {
                return (
                  <Option key={i} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {this.state.productType === '其他水产品' ? (
            <Form.Item
              label="其他水产品类别"
              name="inputType"
              rules={[
                { required: true, message: '请输入其他水产品类别!' },
                { type: 'string', max: 10 }
              ]}
            >
              <Input />
            </Form.Item>
          ) : (
            ''
          )}
        </Form>
      </Modal>
    );
  }
}

export default Code;
