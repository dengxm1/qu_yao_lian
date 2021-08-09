import React, { useEffect, useState } from 'react';
import { Modal, Input, Form, message, Menu, Checkbox } from 'antd';
import utils from 'utils/index';
import informFillingApi from 'api/informFilling.js';
import otherApi from 'api/other';

import './index.less';
const formItemLayout = {
  labelCol: {
    xs: { span: 22 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 }
  }
};
const AddProduct = (props) => {
  const { visible, handleCancel, type, editData, getData } = props;
  const [form] = Form.useForm();
  const [menuListByReceiver, setMenuListByReceiver] = useState([]);
  useEffect(() => {
    if (type) {
      if (type === 'edit') {
        const editDatas = Object.assign({}, editData);
        form.setFieldsValue({ ...editDatas });
      }
    }
  }, [type]);
  //提交按钮事件
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const params = {
        ...values
      };
      if (type === 'add') {
        informFillingApi.buyerAdd(params).then((res) => {
          if (res?.data?.data) {
            message.success('新增成功');
            handleClose();
            getData(1, 10);
          } else {
            message.error(res.data.msg || res.data.message);
          }
        });
      } else {
        params.id = editData.id;
        informFillingApi.buyerUpdate(params).then((res) => {
          if (res?.data?.data) {
            message.success('编辑成功');
            handleClose();
            getData(1, 10);
          } else {
            message.error(res.data.msg || res.data.message);
          }
        });
      }
    });
  };

  //关闭模态框
  const handleClose = () => {
    handleCancel();
    form.resetFields();
  };

  //输入企业名称--获取企业列表
  const handleChangeName = (value) => {
    const e = value.target.value;
    if (e) {
      otherApi.getJoinCompanyList(e, '').then((res) => {
        if (res?.data?.data) {
          const dataList = res.data.data;
          setMenuListByReceiver(dataList.dataList);
        }
      });
    } else {
      setMenuListByReceiver([]);
    }
  };
  //选中企业
  const handleSelectReceiverMenu = (data) => {
    console.log('data__', data);
    form.setFieldsValue({ ...data });
    setMenuListByReceiver([]);
  };
  return (
    <Modal
      width={600}
      title={type === 'add' ? '新增' : '编辑'}
      visible={visible}
      onCancel={handleClose}
      onOk={handleSubmit}
      className="addModal"
    >
      <div className="modal-first">
        <Form form={form} {...formItemLayout}>
          <Form.Item name="companyId" label={'主体id'} style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item name="enterpriseType" label={'主体类型'} style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item name="companyName" label={'主体名称'} rules={[{ required: true }]}>
            <Input
              disabled={type === 'edit' ? true : false}
              autoComplete="off"
              onChange={handleChangeName}
            />
          </Form.Item>
          <Form.Item name="companyNameList" label={'列表'} className="dataList-search">
            {menuListByReceiver && menuListByReceiver.length ? (
              <Menu mode="vertical" className="receiver-list menu_ul">
                {menuListByReceiver.map((item, i) => {
                  return (
                    <Menu.Item
                      key={i}
                      title={item.companyName}
                      value={item}
                      onClick={() => handleSelectReceiverMenu(item)}
                      style={{ height: 'auto', margin: '5px 0', lineHeight: '20px' }}
                    >
                      <div style={{ display: 'inline' }}>
                        <span>
                          {i + 1}、{item.companyName}
                        </span>
                        <br />
                        <span>{item.uniformCode}</span>
                      </div>
                    </Menu.Item>
                  );
                })}
              </Menu>
            ) : null}
          </Form.Item>
          <Form.Item
            name="uniformCode"
            label="统一社会信用代码或组织机构代码"
            rules={[{ required: true }, { validator: utils.handleCheckTpl }]}
          >
            <Input disabled={type === 'edit' ? true : false} />
          </Form.Item>
          <Form.Item name="address" label={'主体地址'} rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contactPerson" label={'联系人'} rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="contactPersonTel"
            label={'联系电话'}
            rules={[{ required: false }, { validator: utils.handleCheckPhone }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="businessScope" label={'经营范围'} rules={[{ required: false }]}>
            <Input.TextArea maxLength="500" row={4} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddProduct;
