import React, { useState, useRef, memo } from 'react';
import { Modal, Button, Row, Space, Typography, message, Form } from 'antd';

// import { noPassByName, noPassByMobile, noPassByCode, isIdCardLegal } from 'utils';
import utils from 'utils';
import { createTags } from 'utils/createAntTags';
const { Text, Link: ALink } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const BindAccount = memo((props) => {
  const { bindState = 0, handleBindClick, zlbUser = null } = props;
  const [visible, setVisible] = useState(true);
  const formRef = useRef();

  const modalProps = {
    width: '50%',
    title: '注意',
    visible,
    // closable: false,
    // keyboard: false,
    maskClosable: false,
    onCancel: () => setVisible(false)
  };

  const formArr = zlbUser
    ? [
        {
          isShow: true,
          tagType: 'Input',
          props: {
            label: '您的手机号码',
            name: 'mobile',
            initialValue: utils.noPassByMobile(zlbUser.mobile)
          },
          tagProps: {
            disabled: true
          }
        },
        {
          isShow: true,
          tagType: 'Input',
          props: {
            label: '姓名',
            name: 'userName',
            initialValue: utils.noPassByName(zlbUser.username)
          },
          tagProps: {
            disabled: true
          }
        },
        {
          isShow: true,
          tagType: 'Input',
          props: {
            label: '您的身份证号码',
            name: 'idcardNo',
            initialValue: utils.noPassByCode(zlbUser.idCardNo)
          },
          tagProps: {
            disabled: true
          }
        },
        {
          isShow: bindState === 1,
          tagType: 'Input',
          props: {
            label: '请填写完整身份证号码',
            name: 'idcardNo2',
            rules: [
              { required: true, message: '请输入确认身份证' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  let msg = '';
                  if (!utils.isIdCardLegal(value)) {
                    msg = '身份证号不合法';
                  } else if (value !== zlbUser.idCardNo) {
                    msg = '确认身份证不正确';
                  }
                  if (msg) {
                    return Promise.reject(msg);
                  }
                  return Promise.resolve();
                }
              })
            ]
          },
          tagProps: {
            disabled: false,
            placeholder: '请输入确认身份证'
          }
        }
      ]
    : [];

  const handleModalOk = () => {
    formRef.current.submit();
  };

  const onFinish = async (values) => {
    const falg = await handleBindClick();
    const msgObj = [
      {
        success: '绑定成功',
        error: '绑定失败，请重试'
      },
      {
        success: '填写正确，绑定成功',
        confirm: (
          <>
            <Row>填写错误，绑定失败</Row>
            <Row>
              您可以返回&nbsp;
              <Text strong type="danger">
                重新填写
              </Text>
              &nbsp;或&nbsp;
              <Text strong type="danger">
                咨询客服
              </Text>
            </Row>
          </>
        )
      },
      {
        success: '创建成功',
        error: '创建失败，请重试'
      }
    ];
    let modalType = 'success'; // success  confirm
    switch (bindState) {
      case 0:
      case 2:
        modalType = falg ? 'success' : 'error';
        break;
      case 1:
        modalType = falg ? 'success' : 'confirm';
        break;
      default:
        break;
    }

    let modal = {
      title: '绑定通知',
      cancelText: '关闭',
      okText: '确定',
      closable: true,
      icon: null,
      content: (
        <div style={{ fontSize: 18, marginTop: 20 }}>
          <Space direction="vertical" size={'large'}>
            {msgObj[bindState][modalType]}
          </Space>
        </div>
      ),
      onCancel: () => {}
    };

    Modal[modalType](modal);
  };

  const ModalContext = () => (
    <div style={{ fontSize: 18 }}>
      <Space direction="vertical" size={'large'}>
        <Row>
          未来登录方式将使用&nbsp;
          <Text strong style={{ color: '#0000F4' }}>
            浙江政务服务网
          </Text>
          &nbsp;或&nbsp;
          <Text strong style={{ color: '#0000F4' }}>
            浙里办
          </Text>
          &nbsp;账号登录。为了保证您之后的正常使用，请您确认身份信息
        </Row>
        <div className="form-area" style={{ width: '60%' }}>
          <Form {...layout} name="basic" ref={formRef} onFinish={onFinish}>
            {formArr.map((item, index) => {
              return item.isShow ? (
                <Form.Item {...item.props} key={index}>
                  {createTags(item)}
                </Form.Item>
              ) : null;
            })}
          </Form>
        </div>
        {bindState === 2 && (
          <Row>
            检测到您的身份证号码与手机号码均不存在，您可以&nbsp;
            <Text strong type="danger">
              选择创建新用户
            </Text>
            &nbsp;或&nbsp;
            <Text strong type="danger">
              咨询客服
            </Text>
          </Row>
        )}
      </Space>
    </div>
  );

  return (
    <div>
      <Modal
        {...modalProps}
        footer={
          <Button type="primary" onClick={handleModalOk}>
            {bindState === 2 ? '创建用户' : ' 确认绑定'}
          </Button>
        }
      >
        {ModalContext()}
      </Modal>
    </div>
  );
});

export default BindAccount;
