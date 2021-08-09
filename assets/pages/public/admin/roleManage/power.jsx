import React from 'react';
import { Modal, Form, Select, message } from 'antd';
const { Option } = Select;
import adminApi from 'api/admin';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

class RoleManagePower extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.isshowPower,
      options: []
    };
    this.formRef = React.createRef();
  }
  componentDidMount = () => {
    adminApi.accessPage({}).then((res) => {
      if (res.data.code == '0') {
        this.setState({
          options: res.data.data.dataList
        });
      } else {
        message.error(res.data.message);
      }
    });
  };

  handleOk = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        this.props.onchange(values);
      })
      .catch((errorInfo) => {});
  };
  handleCancel = () => {
    this.props.onchange();
  };
  render() {
    const { visible, formdata, options } = this.state;

    return (
      <Modal
        title="配置权限"
        centered
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form {...layout} ref={this.formRef}>
          <Form.Item name="access" label="权限" rules={[{ required: true }]}>
            <Select placeholder="请选择权限" allowClear>
              {options.length > 0 &&
                options.map((item, index) => {
                  return (
                    <Option key={index} value={JSON.stringify(item)}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default RoleManagePower;
