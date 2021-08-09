import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Upload,
  Button,
  Radio,
  Icon,
  Modal,
  Input,
  Checkbox,
  message,
  Row,
  Col
} from 'antd';
import NameLabel from 'components/NameLabel';
import inRegisterApi from 'api/inRegister.js';

import moment from 'moment';
import './index.less';

const AddAndUpdate = (props) => {
  const { visible, type, handleCancel, editData, getData } = props;
  const [fileIds, setFileIds] = useState([]);
  const [fileList, setFile] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [saveCheck, setSaveCheck] = useState(false);
  const [previewVisible, setPreviewVisible] = useState('');
  const [certType, setCertType] = useState(null);
  const [form] = Form.useForm();
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

  useEffect(() => {
    if (type) {
      if (type == 'edit') {
        const editDatas = Object.assign({}, editData);
        const fileParams = {
          entityId: editDatas.circulationCertificateId
        };
        inRegisterApi.fileList(fileParams).then((res) => {
          if (res?.data?.data) {
            const data = res.data.data.files;
            data.map((ele, index) => {
              ele.uid = ele.id;
              ele.type = null;
            });
            data.map((ele, index) => {
              fileIds.push(ele.id);
            });
            setFile(data);
          }
        });
        setCertType(editDatas.circulationCertificateType);
        setSaveCheck(editDatas.facePublic == '是' ? true : false);
        form.setFieldsValue({ ...editDatas });
      }
    }
  }, [type]);
  const onChange = ({ fileList }) => {
    setFile(fileList);
  };
  const onRemove = (file) => {
    if (type == 'edit' && fileIds.length > 0) {
      const ids = fileIds.slice();
      const idArray = ids.filter((v) => v != file.id);
      // ids.splice(index, 1);
      setFileIds(idArray);
      setFile(fileList);
    } else {
      setFile(fileList);
    }
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };
  const uploadButton = (
    <div>
      <Icon type={'plus'} />
      <div className="ant-upload-text">上传产品图片</div>
    </div>
  );
  const beforeUpload = (file) => {
    try {
      if (file.size > 200000000) {
        message.error('上传文件大小请勿大于30M');
        file.status = 'error';
      } else if (
        file.type != 'image/jpeg' &&
        file.type != 'image/png' &&
        file.type != 'image/jpg'
      ) {
        message.error('请上传图片格式的质量检测报告');
        file.status = 'error';
      } else {
        file.status = 'done';
        const r = new FileReader();
        r.readAsDataURL(file);
        r.onload = (e) => {
          file.thumbUrl = e.target.result;
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 8);
          inRegisterApi.upload(formData).then((res) => {
            if (res?.data?.success) {
              const data = res.data.data;
              fileIds.push(data.id);
              setFileIds(fileIds);
            }
          });
        };
      }
      return false;
    } catch (error) {
      console.log('error');
    }
  };
  const handleClosePreview = () => {
    setPreviewVisible(false);
    setPreviewImage('');
  };
  const handleChangeType = (e) => {
    setCertType(e.target.value);
  };
  const handleChangeSave = (e) => {
    setSaveCheck(e.target.checked);
  };
  const handleClose = () => {
    handleCancel();
    setCertType(null);
    setSaveCheck(null);
    setFileIds([]);
    setFile([]);
    form.resetFields();
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const params = {
        inOrderDetailId: editData.inOrderDetailId,
        circulationCertificateType: values.circulationCertificateType,
        circulationCertificateNo: values.circulationCertificateNo,
        image: fileIds.join(','),
        facePublic: saveCheck
      };
      inRegisterApi.updateCirculationCertificate(params).then((res) => {
        if (res?.data?.success) {
          if (type == 'add') {
            message.success('上传成功');
          } else {
            message.success('编辑成功');
          }
          handleClose();
          getData(1, 19);
        }
      });
    });
  };
  return (
    <Drawer
      placement="right"
      width={1000}
      visible={visible}
      closable={true}
      maskClosable={false}
      title={type == 'add' ? '上传凭证' : '编辑凭证'}
      onClose={handleClose}
      footer={
        <div
          style={{
            textAlign: 'right'
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={handleSubmit} type="primary">
            提交
          </Button>
        </div>
      }
    >
      <NameLabel name={'基本信息'} />
      <Form {...formItemLayout}>
        <Row gutter={24}>
          <Col span={11}>
            <Form.Item label={'产品名称'}>{editData.productName}</Form.Item>
            <Form.Item label={'生产批次号'}>{editData.batchNumber}</Form.Item>
            <Form.Item label={'生产单位'}>{editData.fromCompanyName}</Form.Item>

            <Form.Item label={'产品条码'}>{editData.barCode}</Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label={'生产日期'}>
              {editData.productionDate ? moment(editData.productionDate).format('YYYY-MM-DD') : ''}
            </Form.Item>
            <Form.Item label={'保质期'}>
              {editData.shelfLife}/{editData.dateUnit}
            </Form.Item>
            <Form.Item label={'规格单位'}>
              {editData.spec}
              {editData.specUnit}/{editData.unit}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <NameLabel name="凭证信息" />
      <p style={{ margin: '10px 0 10px 20px' }}>
        境外货物入境需要填写报关单或入境货物检验检疫证明，出库前需要上传入境货物检验检疫证明；省外货物需要上传检测合格证明或销售凭证
      </p>
      <Form form={form} {...imageFormItemLayout}>
        <Form.Item
          label={'凭证类型'}
          name="circulationCertificateType"
          rules={[{ required: true }]}
        >
          <Radio.Group onChange={(e) => handleChangeType(e)}>
            <Radio value={'3'}>入境货物检验检疫证明</Radio>
            <Radio value={'1'}>检测合格证明</Radio>
            <Radio value={'2'}>销售凭证</Radio>
            <Radio value={'0'}>报关单</Radio>
          </Radio.Group>
        </Form.Item>
        {certType == 3 ? (
          <Form.Item label="凭证编号" name="circulationCertificateNo" rules={[{ required: true }]}>
            <Input style={{ width: '200px' }} />
          </Form.Item>
        ) : (
          ''
        )}

        <Form.Item label="上传凭证" className="productImage">
          <Upload
            listType="picture-card"
            className="upload"
            beforeUpload={beforeUpload}
            onChange={onChange}
            onRemove={onRemove}
            fileList={fileList}
            multiple={true}
            onPreview={handlePreview}
          >
            {uploadButton}
          </Upload>
        </Form.Item>
        <Checkbox style={{ marginLeft: '100px' }} onChange={handleChangeSave} checked={saveCheck}>
          是否面向公众
        </Checkbox>
      </Form>
      <Modal
        visible={previewVisible}
        title="产品图片预览"
        maskClosable={false}
        className="previewModal"
        width={600}
        onCancel={() => handleClosePreview()}
        footer={null}
      >
        <img width={350} src={previewImage} />
      </Modal>
    </Drawer>
  );
};
export default AddAndUpdate;
