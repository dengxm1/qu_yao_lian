import React from 'react';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import adminApi from 'api/admin';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

class RoleManagePreView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.isshowPreView,
      formdata: props.detail.value ? props.detail.value : ''
    };
    this.formRef = React.createRef();
  }

  handleOk = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        if (this.props.detail.isadd) {
          adminApi.roleInsert(values).then((res) => {
            if (res.data.code == '0') {
              message.success('新增成功');
              this.props.onchange(false);
              this.formRef.current.resetFields();
            } else {
              message.error(res.data.message);
            }
          });
        } else {
          let data = Object.assign({}, this.props.detail.value, values);
          adminApi.roleUpdate(data).then((res) => {
            if (res.data.code == '0') {
              message.success('修改成功');
              this.props.onchange(false);
              this.formRef.current.resetFields();
            } else {
              message.error(res.data.message);
            }
          });
        }
      })
      .catch((errorInfo) => {});
  };
  handleCancel = () => {
    this.props.onchange(false);
  };
  render() {
    const { visible, formdata } = this.state;
    return (
      <Modal
        title="角色添加"
        centered
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form {...layout} ref={this.formRef}>
          <Form.Item
            label="角色名称"
            name="name"
            initialValue={formdata.name ? formdata.name : ''}
            rules={[{ required: true, message: '请输入角色名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色别名"
            name="alias"
            initialValue={formdata.alias ? formdata.alias : ''}
            rules={[{ required: false, message: '请输入角色别名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            initialValue={formdata.description ? formdata.description : ''}
            rules={[{ required: false, message: '请输入描述!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default RoleManagePreView;
