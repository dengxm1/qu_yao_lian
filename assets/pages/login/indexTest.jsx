import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import QRCode from 'qrcode.react';
import { Button, Input, message, Tabs, Form, Checkbox, Steps, Select } from 'antd';
import { LeftOutlined, CheckCircleFilled } from '@ant-design/icons';
import loginApi from 'api/login';
import authUtils from 'utils/authUtils';
import routerPath from 'router/routerPath';
import iconPwd from 'public/imgs/login/icon-pwd.png';
import iconAccount from 'public/imgs/login/icon-account.png';
import JSEncrypt from 'utils/jsEncrypt.js';
import enCode from 'utils/encode.js';
import utils from 'utils/index';

import BindAccount from './bindAccount';
import OtherLogin from './otherLogin';
import querystring from 'querystring';
import axios from 'axios';
import md5 from 'js-md5';
let Base64 = require('js-base64').Base64;
import './index.less';
import { constants } from 'buffer';

const { Step } = Steps;
const { Option } = Select;
const TabPane = Tabs.TabPane;
const optionData = {
  certificateList: [
    { value: 1, name: '居民身份证' },
    { value: 2, name: '军官证' },
    { value: 3, name: '机动车驾驶证' },
    { value: 4, name: '护照' },
    { value: 5, name: '港澳通行证' },
    { value: 6, name: '台胞证' },
    { value: 7, name: '其他' }
  ]
};

const Login = () => {
  const [globalValue, setGlobalValue] = useState(null);
  const [mobile, setMbile] = useState('');
  const [idcardNo, setIdcardNo] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [testCode, setTestCode] = useState('');
  const [testCodeState, setTestCodeState] = useState(true);
  const [forgetCodeState, setForgetCodeState] = useState(true);
  const [forgetCode, setForgetCode] = useState('');
  const [forgetInputState, setForgetInputState] = useState(true);
  const [forgetCodeTime, setForgetCodeTime] = useState(60);
  const [codeInputState, setCodeInputState] = useState(true);
  const [codeTime, setCodeTime] = useState(60);
  const [checked, setchecked] = useState(false);
  const [tabValue, setTabValue] = useState('1');
  const [forgetVsible, setForgetVisible] = useState(false);
  const [secondStep, setSecondStep] = useState(false);
  const [thirdStep, setThirdStep] = useState(false);
  const [fourStep, setFourStep] = useState(false);
  const [otherLogin, setOtherLogin] = useState(false);
  const [bindState, setBindState] = useState(3);
  const [zlbUser, setZlbUser] = useState(null);
  const [certType, setCertType] = useState(null);
  const [certTypeList, setCertTypeList] = useState(optionData['certificateList']);
  const [form] = Form.useForm();
  const [forgetForm] = Form.useForm();
  const [secondForm] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 22 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };
  useEffect(() => {
    setchecked(getCookie('checked'));
    setMbile(getCookie('mobile'));
    setIdcardNo(JSEncrypt(getCookie('pwd')));
    zlbLogin();
  }, []);

  useEffect(() => {
    setGlobalValue(
      localStorage.getItem('globalValue') && JSON.parse(localStorage.getItem('globalValue'))
    );
    loginApi.config().then((res) => {
      sessionStorage.setItem('config', JSON.stringify(res.data.data));
    });
  }, [localStorage.getItem('globalValue')]);

  const getQueryParams = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  };

  const handleSubmit = () => {
    const { app } = routerPath;
    if (!mobile || !idcardNo) {
      message.warning('手机号或密码不能为空');
      return false;
    }
    if (checked) {
      setCookie('checked', checked, 7);
      setCookie('mobile', mobile, 7);
      setCookie('pwd', enCode(idcardNo), 7);
    }
    if (!checked) {
      delCookie('mobile');
      delCookie('pwd');
      delCookie('checked');
    }
    const params = { mobile, password: enCode(idcardNo) };
    loginApi.login(params).then((e) => {
      if (e?.data?.success) {
        sessionStorage.setItem('userInfo', JSON.stringify(e.data.data));
        sessionStorage.setItem('companyInfo', JSON.stringify(e.data.data));
        authUtils.loginTest(e.data.data);
      } else {
        message.error(e && e.data.message);
      }
    });
  };

  const handleRegister = () => {
    form.validateFields().then((values) => {
      if (values.testCode != JSEncrypt(testCode)) {
        message.error('验证码不正确');
      } else if (values.pwd !== values.rePwd) {
        message.error('两次输入的密码不相同');
      } else {
        loginApi
          .register({
            userName: values.userName,
            mobile: values.phone,
            certType: certType,
            idcardNo: values.idcardNo,
            password: values.pwd
          })
          .then((res) => {
            if (res?.data?.data) {
              message.success('注册成功');
              form.resetFields();
              handleChangeTab('1');
              setTestCode('');
            } else {
              message.error(res?.data?.message);
            }
          });
      }
    });
  };

  const handleTestCode = () => {
    const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
    if (registerPhone) {
      loginApi.send(registerPhone, companyInfo ? companyInfo.regulatoryCode : '', 1).then((res) => {
        if (res?.data?.data) {
          setTestCodeState(false);
          setCodeInputState(false);
          let time = 60;
          let interval = setInterval(() => {
            if (time > 0) {
              time -= 1;
              setCodeTime(time);
            } else {
              time = 60;
              setCodeTime(time);
              setTestCodeState(true);
              clearInterval(interval);
            }
          }, 1000);
          setTestCode(res.data.data.code);
          message.success('验证码获取成功');
        } else {
          message.error(res.data.message);
        }
      });
    } else {
      message.error('手机号码不能为空');
    }
  };
  const handleRegisterPhone = (e) => {
    setRegisterPhone(e.target.value);
  };

  //设置cookie
  const setCookie = (name, value, day) => {
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
  };
  //获取cookie
  const getCookie = (name) => {
    var reg = RegExp(name + '=([^;]+)');
    var arr = document.cookie.match(reg);
    if (arr) {
      return arr[1];
    } else {
      return '';
    }
  };
  //删除cookie
  const delCookie = (name) => {
    setCookie(name, null, -1);
  };

  const handleRemember = (e) => {
    const value = e.target.checked;
    setchecked(value);
  };

  const handleChangeTab = (e) => {
    setTabValue(e);
  };
  const handleChange = (e) => {
    setCertType(e);
    form.setFieldsValue({
      idcardNo: ''
    });
  };
  //忘记密码第一步--显示
  const handleForget = () => {
    setForgetVisible(true);
    setSecondStep(true);
    setThirdStep(false);
    setFourStep(false);
  };
  //忘记密码第一步--获取验证码
  const handleForgetCodeState = () => {
    const phone = forgetForm.getFieldValue('phone');
    loginApi.checkPhoneExist(phone).then((res) => {
      if (res?.data?.success) {
        if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(phone)) {
          message.error('手机号码不正确');
        } else {
          loginApi.send(phone, '', 3).then((res) => {
            if (res?.data?.data) {
              setForgetCodeState(false);
              setForgetInputState(false);
              let time = 60;
              let interval = setInterval(() => {
                if (time > 0) {
                  time -= 1;
                  setForgetCodeTime(time);
                } else {
                  time = 60;
                  setForgetCodeTime(time);
                  setForgetCodeState(true);
                  clearInterval(interval);
                }
              }, 1000);
              setForgetCode(res.data.data.code);
              message.success('验证码获取成功');
            } else {
              message.error(res.data.message);
            }
          });
        }
      } else {
        message.error(res.data.message);
      }
    });
  };
  //忘记密码第一步--提交数据--第二步显示
  const handleTestForgetPhone = () => {
    const code = forgetForm.getFieldValue('forgetCode');
    if (JSEncrypt(forgetCode) === code) {
      setSecondStep(false);
      setThirdStep(true);
      setFourStep(false);
      message.success('电话号码验证成功', 5);
    } else {
      message.error('验证码不正确');
    }
  };
  //忘记密码第二步--提交数据
  const handleForgetPhoneSubmit = () => {
    const phone = forgetForm.getFieldValue('phone');
    secondForm.validateFields().then((values) => {
      const params = {
        mobile: phone,
        password: values.pwd
      };

      if (values.pwd === values.rePwd) {
        loginApi.forgetPassword(params).then((res) => {
          if (res?.data?.success) {
            message.success('修改密码成功');
            setSecondStep(false);
            setThirdStep(false);
            setFourStep(true);
            secondForm.resetFields();
          } else {
            message.error(res.data.message);
          }
        });
      } else {
        message.error('两次密码不一致！');
      }
    });
  };
  //忘记密码结束--去登录
  const handleSetLogin = () => {
    setTabValue('1');
    setForgetVisible(false);
    setSecondStep(false);
    setThirdStep(false);
    setFourStep(false);
  };
  //返回登录
  const handleThirdReturn = () => {
    setForgetVisible(false);
    setSecondStep(false);
    setThirdStep(false);
    setFourStep(false);
  };

  const zlbLogin = async () => {
    const search = location.search ? querystring.parse(location.search.substr(1)) : {};
    const id = search.id;
    const state = +search.state;
    const zlbUserType = +search.zlbUserType;
    if (id && state !== 3) {
      const res = await loginApi.zlbLogin({ id, zlbUserType });
      if (res?.data?.data) {
        const data = res.data.data;
        let obj = {
          idCardNo: data.idnum || data.attnIDNo,
          mobile: data.mobile || data.attnPhone,
          username: data.username,
          zlbUserType,
          id,
          state
        };
        setZlbUser(() => ({ ...obj }));
        setBindState(state);
      } else {
        message.error('获取信息失败');
        setTimeout(() => {
          window.location.href = '/login';
        }, 800);
      }
    } else if (id && state === 3) {
      handleBindClick({ id, state, zlbUserType });
    } else {
      message.warn('请选择登录方式');
    }
  };

  const handleBindClick = async (obj = null) => {
    let user = obj || zlbUser;
    if (user) {
      const res = await loginApi.bindZllAccount(user);
      if (res?.data?.data) {
        message.success('登录成功');
        sessionStorage.setItem('userInfo', JSON.stringify(res.data.data));
        sessionStorage.setItem('companyInfo', JSON.stringify(res.data.data));
        setTimeout(() => {
          authUtils.loginTest(res.data.data);
        }, 800);
        return true;
      } else {
        message.error(res.data.message || '操作失败，请重试重试');
        return false;
      }
    }
    return false;
  };
  return (
    <div className="login-component">
      <Helmet>
        <title>
          衢州市药品信息化追溯平台
          {/* {globalValue && globalValue.provinceName && globalValue.systemName
            ? `${globalValue.provinceName}${globalValue.systemName}`
            : '浙江省食品安全信息追溯企业平台'} */}
        </title>
        <link rel="icon" href={globalValue && globalValue.logoUrl ? globalValue.logoUrl : ''} />
      </Helmet>
      <div className="login">
        {forgetVsible ? (
          <div className="forget-component-title" onClick={handleThirdReturn}>
            <LeftOutlined style={{ marginRight: 10, fontSize: 18 }} />
            <span>返回登录</span>
          </div>
        ) : (
          <div>
            <div className="switch" onClick={() => setOtherLogin(!otherLogin)}>
              切换
            </div>
            <p className="login-name">衢药安链</p>
          </div>
        )}
        {!otherLogin ? (
          <>
            {!forgetVsible ? (
              <Tabs activeKey={tabValue} onChange={handleChangeTab}>
                <TabPane tab="登录" key="1" className="loginModal">
                  <Input.Group>
                    <Input
                      size="large"
                      prefix={
                        <img src={iconAccount} style={{ fontSize: '20px', color: '#9F9F9F' }} />
                      }
                      type="text"
                      onChange={(e) => {
                        setMbile(e.target.value);
                      }}
                      placeholder="请输入手机号"
                      value={mobile}
                      style={{ marginBottom: '20px' }}
                      onPressEnter={handleSubmit}
                    />
                    <Input.Password
                      size="large"
                      prefix={<img src={iconPwd} style={{ fontSize: '20px', color: '#9F9F9F' }} />}
                      onChange={(e) => {
                        setIdcardNo(e.target.value);
                      }}
                      placeholder="请输入密码"
                      value={idcardNo}
                      onPressEnter={handleSubmit}
                    />
                  </Input.Group>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}
                  >
                    <Checkbox
                      onChange={handleRemember}
                      checked={checked === 'false' || checked == false ? false : true}
                    >
                      记住密码
                    </Checkbox>
                    <a onClick={handleForget}>忘记密码？</a>
                  </div>
                  <Button type="primary" className="submit" onClick={handleSubmit}>
                    登录
                  </Button>
                </TabPane>
                <TabPane tab="注册" key="2">
                  <Form className="register" form={form} {...formItemLayout}>
                    <Form.Item
                      label="姓名"
                      name="userName"
                      rules={[{ required: true, message: '用户名不能为空' }]}
                    >
                      <Input placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      label="账号"
                      rules={[
                        { required: true, message: '手机号码不能为空' },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || /^(?:(?:\+|00)86)?1\d{10}$/.test(value)) {
                              return Promise.resolve();
                            }
                            return Promise.reject('手机号码格式不正确!');
                          }
                        })
                      ]}
                    >
                      <Input
                        placeholder="请输入电话号码"
                        onChange={(e) => handleRegisterPhone(e)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="certType"
                      label="证件类型"
                      rules={[{ required: true, message: '证件类型不能为空' }]}
                    >
                      <Select placeholder="请选择证件类型" onChange={handleChange}>
                        {certTypeList.map((item) => (
                          <Option key={item.name}>{item.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {certType ? (
                      <Form.Item
                        label="证件号"
                        name="idcardNo"
                        rules={[
                          { required: true, message: '证件号不能为空' },
                          ({ getFieldValue }) => ({
                            validator(rule, value) {
                              if (utils.idNumberCheck(certType, value) || value == '') {
                                return Promise.resolve();
                              } else {
                                return Promise.reject('证件号格式不正确!');
                              }
                            }
                          })
                        ]}
                      >
                        <Input placeholder="请输入身份证号码" />
                      </Form.Item>
                    ) : null}

                    <Form.Item
                      name="pwd"
                      label="登录密码"
                      rules={[
                        { required: true, message: '密码不能为空' },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (
                              !value ||
                              /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value)
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject('密码格式不正确!');
                          }
                        })
                      ]}
                    >
                      <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item
                      name="rePwd"
                      label="确认密码"
                      rules={[{ required: true, message: '请再次输入密码' }]}
                    >
                      <Input.Password placeholder="请再次输入密码" />
                    </Form.Item>

                    <Form.Item
                      label="验证码"
                      name="testCode"
                      rules={[{ required: true, message: '验证码不能为空' }]}
                    >
                      <Input
                        placeholder="请输入验证码"
                        disabled={codeInputState}
                        addonAfter={
                          <Button
                            style={{ width: '100px' }}
                            className="testCodeBtn"
                            disabled={!testCodeState}
                            type="primary"
                            onClick={handleTestCode}
                          >
                            {testCodeState ? '获取验证码' : `${codeTime}s`}
                          </Button>
                        }
                      />
                    </Form.Item>
                  </Form>
                  <p className="pwdTip">
                    密码由8-16位组成，至少包含一位大、小写字母、数字。允许基础字符、不允许空格和中文
                  </p>
                  <Button type="primary" className="submit" onClick={handleRegister}>
                    注册
                  </Button>
                </TabPane>
              </Tabs>
            ) : (
              <div className="forget-component">
                <div className="stepLogin">
                  <Steps size="small" current={secondStep ? 0 : thirdStep ? 1 : 2}>
                    <Step title="验证" />
                    <Step title="重置密码" />
                    <Step title="完成" />
                  </Steps>
                </div>
                {secondStep ? (
                  <div className="forget-component-content">
                    <div>
                      <Form form={forgetForm}>
                        <Form.Item
                          name="phone"
                          rules={[{ required: true, message: '手机号不能为空' }]}
                        >
                          <Input placeholder="请输入注册的手机号" />
                        </Form.Item>
                        <Form.Item
                          name="forgetCode"
                          rules={[{ required: true, message: '验证码不能为空' }]}
                        >
                          <Input
                            placeholder="请输入验证码"
                            disabled={forgetInputState}
                            addonAfter={
                              <Button
                                style={{ width: '100px' }}
                                className="testCodeBtn"
                                disabled={!forgetCodeState}
                                type="primary"
                                onClick={handleForgetCodeState}
                              >
                                {forgetCodeState ? '获取验证码' : `${forgetCodeTime}s`}
                              </Button>
                            }
                          />
                        </Form.Item>
                      </Form>
                      <Button type="primary" className="submit" onClick={handleTestForgetPhone}>
                        提交
                      </Button>
                    </div>
                  </div>
                ) : null}
                {thirdStep ? (
                  <div className="forget-component-content">
                    <Form form={secondForm}>
                      <Form.Item
                        name="pwd"
                        rules={[
                          { required: true, message: '密码不能为空' },
                          ({ getFieldValue }) => ({
                            validator(rule, value) {
                              if (
                                !value ||
                                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value)
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject('密码格式不正确!');
                            }
                          })
                        ]}
                      >
                        <Input placeholder="请输入新密码" />
                      </Form.Item>
                      <Form.Item
                        name="rePwd"
                        rules={[
                          { required: true, message: '密码不能为空' },
                          ({ getFieldValue }) => ({
                            validator(rule, value) {
                              if (
                                !value ||
                                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value)
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject('密码格式不正确!');
                            }
                          })
                        ]}
                      >
                        <Input placeholder="请重复输入密码" />
                      </Form.Item>
                    </Form>
                    <Button type="primary" className="submit" onClick={handleForgetPhoneSubmit}>
                      提交
                    </Button>
                  </div>
                ) : null}
                {fourStep ? (
                  <div>
                    <div className="successTip">
                      <CheckCircleFilled style={{ color: '#3887E5', fontSize: '90px' }} />
                    </div>
                    <Button type="primary" className="submit" onClick={handleSetLogin}>
                      立即登录
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
          </>
        ) : (
          <OtherLogin />
        )}
      </div>
      {bindState !== 3 && (
        <BindAccount bindState={bindState} handleBindClick={handleBindClick} zlbUser={zlbUser} />
      )}
    </div>
  );
};
export default Login;
