import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Drawer, Checkbox, Radio, Input, Modal, Upload } from 'antd';
import NameLabel from 'components/NameLabel';
import inRegisterApi from 'api/inRegister.js';

import _ from 'lodash';
import moment from 'moment';
import './index.less';

const DetailModal = (props) => {
  const { detailData, visible, handleCancel } = props;
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState('');
  const [rmlList, setRmlList] = useState([]);
  const [certType, setCertType] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [saveCheck, setSaveCheck] = useState(false);

  const [form] = Form.useForm();
  const imageFormItemLayout = {
    labelCol: {
      xs: { span: 10 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };
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

  useEffect(() => {
    if (JSON.stringify(detailData) != '{}') {
      const fileParams = {
        entityId: detailData.circulationCertificateId
      };
      inRegisterApi.fileList(fileParams).then((res) => {
        if (res?.data?.data) {
          const data = res.data.data.files;
          data.map((ele, index) => {
            ele.uid = ele.id;
            ele.type = null;
          });
          setFileList(data);

          setCertType(detailData.circulationCertificateType);
          setSaveCheck(detailData.facePublic == '是' ? true : false);
          form.setFieldsValue({ ...detailData });
        }
      });
    }
  }, [detailData]);
  const handleClose = () => {
    handleCancel();
    setCertType(null);
    setSaveCheck(null);
    form.resetFields();
  };
  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };
  const handleClosePreview = () => {
    setPreviewVisible(false);
    setPreviewImage('');
  };
  return (
    <div className="modal">
      <Drawer
        className="addDrawer"
        title="产品详情"
        placement="right"
        closable={true}
        width={1000}
        maskClosable={false}
        onClose={handleClose}
        visible={visible}
        footer={
          <div>
            <Button onClick={handleClose}>关闭</Button>
          </div>
        }
      >
        <NameLabel name={'基本信息'} />
        <Form {...formItemLayout}>
          <Row gutter={24}>
            <Col span={11}>
              <Form.Item label={'产品名称'}>{detailData.productName}</Form.Item>
              <Form.Item label={'生产批次号'}>{detailData.batchNumber}</Form.Item>
              <Form.Item label={'生产单位'}>{detailData.fromCompanyName}</Form.Item>

              <Form.Item label={'产品条码'}>{detailData.barCode}</Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label={'生产日期'}>
                {detailData.productionDate
                  ? moment(detailData.productionDate).format('YYYY-MM-DD')
                  : ''}
              </Form.Item>
              <Form.Item label={'保质期'}>
                {detailData.shelfLife}/{detailData.dateUnit}
              </Form.Item>
              <Form.Item label={'规格单位'}>
                {detailData.spec}
                {detailData.specUnit}/{detailData.unit}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <NameLabel name="凭证信息" />
        <Form form={form} {...imageFormItemLayout}>
          <Form.Item
            label={'凭证类型'}
            name="circulationCertificateType"
            rules={[{ required: true }]}
          >
            <Radio.Group disabled>
              <Radio value={'3'}>入境货物检验检疫证明</Radio>
              <Radio value={'1'}>检测合格证明</Radio>
              <Radio value={'2'}>销售凭证</Radio>
              <Radio value={'0'}>报关单</Radio>
            </Radio.Group>
          </Form.Item>
          {certType == 3 ? (
            <Form.Item
              label="凭证编号"
              name="circulationCertificateNo"
              rules={[{ required: true }]}
            >
              <Input disabled style={{ width: '200px' }} />
            </Form.Item>
          ) : (
            ''
          )}

          <Form.Item label="上传凭证" className="productImage">
            <Upload
              listType="picture-card"
              className="upload"
              fileList={fileList}
              onPreview={handlePreview}
            >
              {/* {uploadButton} */}
            </Upload>
          </Form.Item>
          <Checkbox disabled style={{ marginLeft: '100px' }} checked={saveCheck}>
            是否面向公众
          </Checkbox>
        </Form>
      </Drawer>
      <Modal
        visible={previewVisible}
        title="质量检测报告预览"
        maskClosable={false}
        className="previewModal"
        width={600}
        onCancel={() => setPreviewVisible(false)}
        footer={
          <div>
            <Button onClick={handleClosePreview}>确认</Button>
          </div>
        }
      >
        <img width={350} src={previewImage} />
      </Modal>
    </div>
  );
};
export default DetailModal;
