import React, { useState, useEffect } from 'react';
// import QinqingApi from 'api/qinqing';
import { Modal, Upload, message, Badge, Button, Spin } from 'antd';
import './index.less';

const { Dragger } = Upload;
const UploadModal = (props) => {
  const { visible, cancel, onSubmit, submitUpload, type } = props;
  const [upload, setUpload] = useState({
    filename: null,
    loading: false,
    fail: false
  });

  const [file, setFile] = useState();

  const fileUpload = (file) => {
    setUpload({
      loading: false,
      filename: file.name,
      fail: false
    });
  };
  const beforeUpload = (file, type) => {
    setUpload({
      loading: true,
      filename: file.name,
      fail: false
    });
    if (file.size > 20000000) {
      message.error('上传文件大小请勿大于20M');
    } else {
      const r = new FileReader();
      r.readAsDataURL(file);
      r.onload = (e) => {
        file.thumbUrl = e.target.result;
        setFile([file]);
      };
      onSubmit(file);
      fileUpload(file);
      return false; //* 禁用默认上传
    }
  };
  const renderUploadPart = () => {
    if (!upload.filename) {
      //* default
      return (
        <div className={'drag'}>
          <p>
            将文档拖拽至虚线框内或<a>点击上传</a>
          </p>
        </div>
      );
    }
    if (upload.filename && upload.fail) {
      //* fail
      return (
        <div className={'drags'}>
          <p className={'desc'}>
            <Badge status={'error'} text={'文件上传失败'} />
          </p>
          <Button className={'reupload'}>重新上传</Button>
        </div>
      );
    }
    if (upload.loading) {
      //* loading
      return (
        <div className={'drags'}>
          <Spin tip={'文件上传中……'} />
        </div>
      );
    }
    return (
      //* reupload
      <div className={'drags'}>
        <p className={'success'}>
          <Badge status={'success'} text={upload.filename} />
          <p>
            <Button className={'reupload'}>重新上传</Button>
          </p>
        </p>
      </div>
    );
  };
  const uploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: beforeUpload,
    action: '',
    fileList: file,
    showUploadList: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        //console.log(info.file, info.fileList);
      }
      if (status == 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status == 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };

  const handleUpload = () => {
    submitUpload();
  };

  const handleCancel = () => {
    fileUpload([]);
    cancel();
  };

  return (
    <div className="uploadModal">
      <Modal
        title={type ? `批量导入${type}` : '批量导入'}
        visible={visible}
        onOk={handleUpload}
        maskClosable={false}
        onCancel={handleCancel}
      >
        <Dragger {...uploadProps}>{renderUploadPart()}</Dragger>
        {/* <p className="warn">最多支持提交200个员工信息且文件大小不超过20MB</p> */}
      </Modal>
    </div>
  );
};
export default UploadModal;
