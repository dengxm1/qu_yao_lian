import React from 'react';
import { Modal, Form, Input, InputNumber, Radio, message } from 'antd';
import adminApi from 'api/admin';

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 12
  }
};

class MenuModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { isEdit, record } = this.props;
    if (isEdit) {
      this.fetchDetailed(record.id);
    }
  }

  fetchDetailed = (id) => {
    adminApi
      .moduleLoad({
        id
      })
      .then((res) => {
        if (res.data.code === '0') {
          this.setState({
            data: res.data.data
          });
          this.formRef.current.setFieldsValue({
            ...res.data.data
          });
        } else {
          message.error(res.data.message);
        }
      });
  };

  handleOk = () => {
    const { isEdit, record } = this.props;
    this.formRef.current
      .validateFields()
      .then((values) => {
        if (isEdit) {
          let payload = record;
          for (let key in values) {
            payload[key] = values[key];
          }
          adminApi.moduleUpdate(payload).then((res) => {
            if (res.data.code == '0') {
              message.success('修改成功');
              this.formRef.current.resetFields();
              this.props.onClose(true);
            } else {
              message.error(res.data.message);
            }
          });
        } else {
          adminApi.moduleInsert(values).then((res) => {
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
    const { data } = this.state;
    const { visible, pid, record, isEdit } = this.props;

    return (
      <Modal
        title={isEdit ? '编辑菜单' : '新增菜单'}
        visible={visible}
        centered
        width={600}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form {...layout} ref={this.formRef}>
          <Form.Item
            name="id"
            initialValue={isEdit ? data && data.id : null}
            style={{ display: 'none' }}
          >
            <span></span>
          </Form.Item>
          <Form.Item name="pid" initialValue={pid} style={{ display: 'none' }}>
            <span></span>
          </Form.Item>

          <Form.Item
            label="菜单标题"
            name="title"
            initialValue={isEdit ? data && data.title : ''}
            rules={[{ required: true, message: '请输入模块标题!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="子路径名"
            name="name"
            initialValue={isEdit ? data && data.alias : ''}
            rules={[{ required: true, message: '请输入模块别名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="访问地址"
            name="path"
            initialValue={isEdit ? data && data.path : ''}
            rules={[{ required: true, message: '请输入访问地址!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="模块图标" name="icon" initialValue={isEdit ? data && data.icon : ''}>
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="模块类型"
            name="type"
            initialValue={isEdit ? data && data.type : ''}
            rules={[{ required: true, message: '请输入模块类型!' }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="模块排序"
            name="sequence"
            initialValue={isEdit ? data && data.sequence : ''}
            rules={[{ required: true, message: '请输入模块排序!' }]}
          >
            <InputNumber precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="是否可见"
            name="enable"
            initialValue={isEdit ? data && data.enable : true}
            rules={[{ required: true, message: '请选择!' }]}
          >
            <Radio.Group>
              <Radio key="1" value={true}>
                是
              </Radio>
              <Radio key="0" value={false}>
                否
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="普通用户是否可见"
            name="visible"
            initialValue={isEdit ? data && data.visible : true}
            rules={[{ required: true, message: '请选择!' }]}
          >
            <Radio.Group>
              <Radio key="1" value={true}>
                是
              </Radio>
              <Radio key="0" value={false}>
                否
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default MenuModal;
