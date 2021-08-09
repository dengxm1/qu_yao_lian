import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Form, Row, Col } from 'antd';
import './index.less';

const MoreModal = (props) => {
  const { visible, handleCancel } = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 22 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };
  const [form] = Form.useForm();

  return (
    <div className="moreModal">
      <Modal
        width={750}
        title="更多设置"
        visible={visible}
        onCancel={handleCancel}
        onOk={handleCancel}
        className="moreModal"
      >
        <Form {...formItemLayout} form={form}>
          <Row>
            <Col span={14}>
              <Form.Item name="uintMax" label="计量单位" rules={[{ required: true }]}>
                <Select placeholder="请选择计量单位">
                  <Select.Option value="瓶">瓶</Select.Option>
                  <Select.Option value="袋">袋</Select.Option>
                  <Select.Option value="箱">箱</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginLeft: '48px' }}>
              <Form.Item name="specMax" label="对应规格" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14} style={{ marginLeft: '48px' }}>
              <Row>
                <Col span={15}>
                  <Form.Item name="uint" label="副单位" rules={[{ required: true }]}>
                    <Select placeholder="请选择计量单位">
                      <Select.Option value="瓶">瓶</Select.Option>
                      <Select.Option value="袋">袋</Select.Option>
                      <Select.Option value="箱">箱</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2} style={{ paddingLeft: '12px' }}>
                  =
                </Col>

                <Col span={5}>
                  <Form.Item name="spec" rules={[{ required: true }]}>
                    <Input suffix={<span>瓶</span>} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Form.Item name="sizeType" label="对应规格" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
export default MoreModal;
