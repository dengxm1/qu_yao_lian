import React from 'react';
import moment from 'moment';
import { Modal, Form, Input, InputNumber, Radio, message } from 'antd';
const { TextArea } = Input;

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

class LogModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleOk = () => {
    this.props.onClose();
  };

  handleCancel = () => {
    this.props.onClose();
  };

  render() {
    const { visible, detailedRecord } = this.props;

    return (
      <Modal
        title="查看日志"
        visible={visible}
        centered
        footer={null}
        width={600}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form {...layout} ref={this.formRef} shouldUpdate>
          <Form.Item
            label="请求接口路径"
            name="url"
            initialValue={detailedRecord && detailedRecord.url}
          >
            <span>{detailedRecord && detailedRecord.url}</span>
          </Form.Item>
          <Form.Item
            label="操作人"
            name="operatorName"
            initialValue={detailedRecord && detailedRecord.operatorName}
          >
            <span>{detailedRecord && detailedRecord.operatorName}</span>
          </Form.Item>
          <Form.Item
            label="操作人IP"
            name="operatorIp"
            initialValue={detailedRecord && detailedRecord.operatorIp}
          >
            <span>{detailedRecord && detailedRecord.operatorIp}</span>
          </Form.Item>
          <Form.Item
            label="操作时间"
            name="createdTime"
            initialValue={
              detailedRecord && moment(detailedRecord.createdTime).format('YYYY-MM-DD HH:mm:ss')
            }
          >
            <span>
              {detailedRecord && moment(detailedRecord.createdTime).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          </Form.Item>
          <Form.Item
            label="日志信息"
            name="logMessage"
            initialValue={detailedRecord && detailedRecord.logMessage}
          >
            <TextArea rows={5} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default LogModal;
