import React, { useState, useEffect } from 'react';
import { Tabs, Card, Descriptions, Form, message, Select, Input, Button, Modal } from 'antd';
import Header from 'components/Header';
import loginApi from 'api/login.js';
import authUtils from 'utils/authUtils.js';
import './index.less';
import messages from '../../lang';
import adminApi from 'api/admin';

const TabPane = Tabs.TabPane;
const PersonMessage = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const companyLink = sessionStorage.getItem('companyLink');
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  const [pwdVisible, setPwdVisible] = useState(false);
  const [changeVisible, setChangeVisible] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [userCompanyList, setUserCompanyList] = useState([]);
  const [companyLinkStatus, setCompanyLinkStatus] = useState(false);
  const [form] = Form.useForm();
  const [nameForm] = Form.useForm();
  const [pwdForm] = Form.useForm();
  const [changeForm] = Form.useForm();
  const [linkForm] = Form.useForm();

  const addFormItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 12
    }
  };
  useEffect(() => {
    linkForm.setFieldsValue({ companyLink: companyInfo.companyLink || companyLink });
  }, []);

  const handlePwdCancel = () => {
    setPwdVisible(false);
  };

  const handleSubmitPwd = () => {
    setPwdVisible(true);
    pwdForm.validateFields().then((values) => {
      const params = {
        id: userInfo.id,
        mobile: userInfo.mobile,
        oldPassword: values.oldPassword,
        password: values.password
      };
      if (values.password !== values.repassword) {
        message.error('两次输入的密码不一致');
      } else {
        loginApi.updatePassword(params).then((res) => {
          if (res?.data?.data) {
            message.success({ content: '密码修改成功， 请重新登录', duration: 10 });
            authUtils.logout();
            pwdForm.resetFields();
          } else {
            message.error(res.data.message);
          }
        });
      }
    });
  };
  const handleChangeCompany = () => {
    changeForm.validateFields().then((values) => {
      loginApi.changeCompany(userInfo.id, values.companyId).then((res) => {
        if (res?.data?.success) {
          message.success('切换企业成功');
          loginApi.getCurrentCompany(userInfo.id).then((res) => {
            if (res?.data?.data) {
              sessionStorage.setItem('companyInfo', JSON.stringify(res.data.data));
              window.location.href = '/personMessage';
            }
          });
        } else {
          message.error(res.data.message);
        }
      });
    });
  };
  const handleCancelChange = () => {
    setChangeVisible(false);
  };
  const handleChange = () => {
    setChangeVisible(true);
    loginApi.getUserCompanyList(userInfo.id).then((res) => {
      if (res?.data?.data) {
        setUserCompanyList(res.data.data);
      }
    });
  };
  const handleExitCompany = () => {
    loginApi.exitCompany(userInfo.id, companyInfo.companyId).then((res) => {
      if (res?.data?.success) {
        setExitVisible(false);
        message.success('退出企业成功');
        loginApi.getUserInfo({ userId: userInfo.id }).then((res) => {
          if (res?.data?.data) {
            sessionStorage.setItem('userInfo', JSON.stringify(res.data.data));
            sessionStorage.setItem('companyInfo', JSON.stringify(res.data.data));
            window.location.href = '/personMessage';
          }
        });
      } else {
        message.error(res.data.msg || res.data.message);
      }
    });
  };
  const handleCancelExit = () => {
    setExitVisible(false);
  };
  const handleExit = () => {
    setExitVisible(true);
  };

  const handleBack = () => {
    window.location.href = '/public';
  };
  const handleChangeName = () => {
    nameForm.validateFields().then((values) => {
      const params = {
        id: userInfo.id,
        userName: values.userName
      };
      loginApi.updateUserInfo(params).then((res) => {
        if (res?.data?.data) {
          message.success('用户名修改成功');
          loginApi.getUserInfo({ userId: userInfo.id }).then((res) => {
            if (res?.data?.data) {
              sessionStorage.setItem('userInfo', JSON.stringify(res.data.data));
              sessionStorage.setItem('companyInfo', JSON.stringify(res.data.data));
              window.location.href = '/personMessage';
            }
          });
        } else {
          message.error(res.data.message || res.data.msg);
        }
      });
    });
  };
  const handleChangeCancel = () => {
    setNameVisible(false);
  };

  const handleSaveCompanyLink = () => {
    setCompanyLinkStatus(false);
    linkForm.validateFields().then((values) => {
      adminApi.updateCompany({ companyLink: values.companyLink || '' }).then((res) => {
        if (res?.data?.success) {
          sessionStorage.setItem('companyLink', res.data.data.companyLink);
          message.success('保存成功');
        } else {
          message.error(res.data.message);
        }
      });
    });
  };

  return (
    <div>
      <Header />
      <div className="personMessage">
        <a onClick={handleBack}>{`<< 返回`}</a>
        <Card
          style={{ marginTop: '20px' }}
          title="基本信息"
          bordered={true}
          className="person"
          extra={
            <div>
              <Button type={'primary'} style={{ marginRight: '10px' }} onClick={handleChange}>
                切换企业
              </Button>
              <Button type={'primary'} style={{ marginRight: '10px' }} onClick={handleExit}>
                退出企业
              </Button>
            </div>
          }
        >
          <Descriptions layout={'horizontal'}>
            <Descriptions.Item span={1} label="用户名称">
              <span>{userInfo.userName}</span>
              <a
                style={{ marginLeft: '30px' }}
                onClick={() => {
                  setPwdVisible(true);
                }}
              >
                修改密码
              </a>
              <a
                style={{ marginLeft: '30px' }}
                onClick={() => {
                  setNameVisible(true);
                }}
              >
                修改用户名
              </a>
            </Descriptions.Item>
          </Descriptions>
          <Descriptions layout={'horizontal'}>
            <Descriptions.Item span={1} label="手机号码">
              <span> {userInfo.mobile}</span>
            </Descriptions.Item>
          </Descriptions>
        </Card>
        {/* <Card
          title="企业信息"
          bordered={true}
          className="company"
          extra={
            <div>
              <Button type={'primary'} style={{ marginRight: '10px' }} onClick={handleChange}>
                切换企业
              </Button>
              <Button type={'primary'} style={{ marginRight: '10px' }} onClick={handleExit}>
                退出企业
              </Button>
            </div>
          }
        >
          <Form form={form} {...addFormItemLayout}>
            <Form.Item label="企业或个体户名称" name="name" rules={[{ required: true }]}>
              <span>{companyInfo.companyName}</span>
            </Form.Item>
            <Form.Item label="统一社会信用代码" name="credit" rules={[{ required: true }]}>
              <span>{companyInfo.uniformCode}</span>
            </Form.Item>
            <Form.Item label="企业地址" name="address" rules={[{ required: true }]}>
              <span>{companyInfo.address}</span>
            </Form.Item>
            <Form.Item label="企业类型" name="type" rules={[{ required: true }]}>
              <span>{companyInfo.companyType == 1 ? '生产企业' : '流通企业'}</span>
            </Form.Item>
            <Form.Item label="法定代表人">
              <span>{companyInfo.uniformName}</span>
            </Form.Item>
          </Form>
          <div className="linkDiv">
            <Form form={linkForm} {...addFormItemLayout}>
              <Form.Item name="companyLink" label="企业公众号">
                <Input.TextArea placeholder="仅支持添加微信公众号和支付宝生活号链接！" row={4} />
              </Form.Item>
            </Form>
            <p>
              <a style={{ marginLeft: '270px' }} onClick={handleSaveCompanyLink}>
                保存
              </a>
            </p>
            <span></span>
          </div>
        </Card> */}
      </div>
      <Modal
        title="修改密码"
        visible={pwdVisible}
        onCancel={handlePwdCancel}
        onOk={handleSubmitPwd}
        className="setPwd"
      >
        <Form form={pwdForm} {...addFormItemLayout}>
          <Form.Item label="旧密码" name="oldPassword" rules={[{ required: true }]}>
            <Input placeholder="请输入原密码" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="password"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject('密码格式不正确!');
                }
              })
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="repassword"
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>
        </Form>
        <p className="pwdTip">
          密码由8-16位组成，至少包含一位大、小写字母、数字。允许基础字符、不允许空格和中文
        </p>
      </Modal>
      <Modal
        title="切换企业"
        visible={changeVisible}
        onOk={handleChangeCompany}
        onCancel={handleCancelChange}
      >
        <Form form={changeForm}>
          <Form.Item name="companyId" label="企业名称">
            <Select placeholder="请选择企业名称">
              {userCompanyList.length > 0
                ? userCompanyList.map((ele, index) => {
                    return (
                      <Select.Option key={ele.uniformCode} value={ele.companyId}>
                        {ele.companyName}
                      </Select.Option>
                    );
                  })
                : ''}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="退出企业"
        visible={exitVisible}
        onOk={handleExitCompany}
        onCancel={handleCancelExit}
      >
        确认退出当前企业吗？
      </Modal>
      <Modal
        title={'修改用户名'}
        onOk={handleChangeName}
        onCancel={handleChangeCancel}
        visible={nameVisible}
      >
        <Form form={nameForm} {...addFormItemLayout}>
          <Form.Item name={'userName'} label={'用户名'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div></div>
        </Form>
      </Modal>
    </div>
  );
};
export default PersonMessage;
