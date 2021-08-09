import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import adminApi from 'api/admin';

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 12
  }
};
const { TextArea } = Input;
const { Option } = Select;

class SetRoleModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.formRef = React.createRef();
  }

  handleOk = () => {
    const { isEdit, record } = this.props;
    this.formRef.current
      .validateFields()
      .then((values) => {
        values.access = values.access.join(',');
        if (isEdit) {
          let payload = record;
          for (let key in values) {
            payload[key] = values[key];
          }
          adminApi.accessUpdate(payload).then((res) => {
            if (res.data.code == '0') {
              message.success('修改成功');
              this.formRef.current.resetFields();
              this.props.onClose(true);
            } else {
              message.error(res.data.message);
            }
          });
        } else {
          adminApi.accessInsert(values).then((res) => {
            if (res.data.code == '0') {
              message.success('添加成功');
              this.formRef.current.resetFields();
              this.props.onClose(true);
            } else {
              message.error(res.data.message);
            }
          });
        }
      })
      .catch((errorInfo) => {});
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.onClose();
  };

  render() {
    const { visible, record, isEdit } = this.props;

    return (
      <Modal
        title={isEdit ? '编辑权限' : '新增权限'}
        visible={visible}
        centered
        maskClosable={true}
        destroyOnClose={true}
        width={600}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form {...layout} ref={this.formRef}>
          <Form.Item name="id" initialValue={isEdit ? record.id : null} style={{ display: 'none' }}>
            <span></span>
          </Form.Item>
          <Form.Item
            label="权限可操作方法"
            name="access"
            initialValue={isEdit ? record.access && record.access.split(',') : []}
            rules={[{ required: true, message: '请选择权限可操作方法!' }]}
          >
            <Select mode="multiple">
              <Option key="1" value="add">
                添加(add)
              </Option>
              <Option key="2" value="update">
                更新(update)
              </Option>
              <Option key="3" value="delete">
                删除(delete)
              </Option>
              <Option key="4" value="list">
                列表(list)
              </Option>
              <Option key="5" value="download">
                下载(download)
              </Option>
              <Option key="6" value="export">
                导出(export)
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default SetRoleModal;
