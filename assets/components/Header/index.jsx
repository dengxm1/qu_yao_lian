import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import {
  Avatar,
  Dropdown,
  Menu,
  Modal,
  Checkbox,
  Radio,
  Input,
  Select,
  Form,
  message,
  Button,
  Row,
  Col
} from 'antd';
import { UserOutlined, HomeOutlined, DownOutlined } from '@ant-design/icons';
import cx from 'classnames';
import authUtils from 'utils/authUtils';
import routerPath from 'router/routerPath';
import CompanyModal from './companyModal';
import './index.less';
import JoinCompany from './joinCompany';
import loginApi from 'api/login';
import systemApi from 'api/system.js';

import JSEncrypt from 'utils/jsEncrypt.js';
const addFormItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 12
  }
};

@inject('Breadcrumb', 'UI')
@observer
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.currentModuleTitle = {};
    this.state = {
      current: this.props.location.pathname,
      visible: false,
      companyVisible: false,
      messageVisible: false,
      setCompanyVisible: false,
      checkVisible: false,
      companyList: [],
      searchData: '',
      companyAllInfo: {},
      codeTime: 60,
      testCode: '',
      registerPhone: '',
      testCodeState: false,
      selectType: [],
      typeList: [],
      reLogin: false,
      joinVisible: false,
      type: 1,
      way: '',
      userCompanyList: [],
      nameVisible: false,
      userInfo: {}
    };
    this.companyRef = React.createRef();
    this.nameForm = React.createRef();
  }

  componentWillMount() {
    if (window.location.search) {
      // window.location.search = '';
    }
  }

  setCookie = (key, value, t) => {
    var myDate = new Date();
    myDate.setDate(myDate.getDate() + t);
    document.cookie = key + '=' + value + ';expires=' + myDate.toGMTString();
  };

  getQueryParams = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return '';
  };

  handleLogout = (e) => {
    if (e.key === 'signout') {
      // authUtils.logout();
      // ??????????????????
      loginApi.logout().then((res) => {
        window.location.pathname = routerPath.app.login;
        sessionStorage.removeItem('companyInfo');
        sessionStorage.removeItem('userInfo');

        sessionStorage.removeItem('tokenId');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('videoToken');
        sessionStorage.removeItem('modules');

        this.setCookie('JSESSIONID', '', -1);
      });
    }
    if (e.key === 'update') {
      this.setState({ visible: true });
    }
    if (e.key === 'message') {
      this.props.history.push(routerPath.app.personMessage);
    }
    if (e.key === 'company') {
      this.setState({
        checkVisible: true,
        way: 'head'
      });
    }
    if (e.key === 'change') {
      this.setState({
        companyVisible: true
      });
    }
  };

  handlePage = (e) => {
    const path = e.currentTarget.id;
    const title = e.currentTarget.getAttribute('name');
    this.props.UI.reset();
    this.props.Breadcrumb.setValue(0, { path, title });
    this.props.history.push(path);
    this.setState({ current: path });
  };

  handleIndex = (e) => {
    const currentRoute = this.props.location.pathname;
    if (currentRoute !== e.target.id) {
      window.location.href = e.target.id;
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.formRef.current.validateFields().then((values) => {
      const { oldPassword, newPassword } = values;
      loginApi.updatePassword({ oldPassword, newPassword }).then((res) => {
        const { data } = res.data;
        if (data === 1) {
          this.setState({ visible: false });
          Modal.success({
            title: '????????????????????????????????????',
            okText: '?????????',
            onOk: () => {
              authUtils.logout();
            }
          });
        } else if (data === -1) {
          message.error('???????????????');
        } else {
          message.error('??????????????????');
        }
      });
    });
  };

  componentDidMount() {
    const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.props.Breadcrumb.setValue(0, this.currentModuleTitle);

    if (companyInfo ? !companyInfo.uniformCode : '') {
      this.setState({ checkVisible: true });
    }
    systemApi.getValue({ type: 'company_type' }).then((res) => {
      if (res?.data?.success) {
        this.setState({
          typeList: res.data.data.dataList
        });
      }
    });
  }
  handleCloseCompany = (needRefresh) => {
    this.setState(
      {
        companyVisible: false
      },
      () => {
        if (needRefresh) {
          location.reload();
        }
      }
    );
  };

  handleCloseMessage = () => {
    this.setState({
      messageVisible: false
    });
  };

  handleMessage = () => {
    this.setState({
      messageVisible: true
    });
  };

  handleCompanyCancel = () => {
    this.setState({
      setCompanyVisible: false,
      checkVisible: true,
      selectType: []
    });
    this.companyRef.current.resetFields();
  };
  // ????????????
  handleSetCompany = () => {
    const { testCode, companyAllInfo, type } = this.state;
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    if (type == 1) {
      this.companyRef.current.validateFields().then((values) => {
        if (JSEncrypt(testCode) != values.code) {
          message.error('?????????????????????');
        } else {
          delete values.phone;
          delete values.code;
          const params = {
            ...companyAllInfo,
            ...values,
            userId: userInfo.id,
            legalPhone: JSEncrypt(companyAllInfo.legalPhone)
          };
          loginApi.firstAddCompany({ ...params }).then((res) => {
            if (res?.data?.success) {
              this.setState({
                reLogin: true,
                setCompanyVisible: false
              });
              this.companyRef.current.resetFields();
            } else {
              message.error(res.data.message);
            }
          });
        }
      });
    } else {
      this.companyRef.current.validateFields().then((values) => {
        values.userId = userInfo.id;
        delete values.phone;
        delete values.code;
        delete values.cerno;
        const params = {
          ...companyAllInfo,
          ...values,
          cerno: values.cerNo
        };

        if (values.cerNo !== JSEncrypt(companyAllInfo.cerno)) {
          message.error('????????????????????????????????????');
        } else {
          loginApi.firstAddCompany({ ...params }).then((res) => {
            if (res?.data?.success) {
              this.setState({
                reLogin: true,
                setCompanyVisible: false
              });
              this.companyRef.current.resetFields();
            } else {
              message.error(res.data.message);
            }
          });
        }
      });
    }
  };

  // ????????????
  handleReLogin = () => {
    this.setState({
      reLogin: false
    });
    window.location.pathname = routerPath.app.login;
  };
  // ????????????????????????
  handleCompany = async () => {
    const { userInfo } = this.state;
    this.setState({
      checkVisible: false,
      setCompanyVisible: true
    });
    // if (userInfo.zlbBind && userInfo.zlbBind === '2') {
    //   const res = await loginApi.getZlbCompanyInfoByUserId({ userId: userInfo.id });
    //   if (res) {
    //     this.setJhModalValue(res);
    //   } else {
    //     message.error('????????????????????????');
    //   }
    // }
  };

  onChange = (companyName) => {
    this.setState({ searchData: companyName });
    loginApi.getCompanyInfo('', companyName).then((res) => {
      if (res?.data?.success) {
        this.setJhModalValue(res);
      } else {
        message.error(res.data.message || res.data.msg);
      }
    });
  };

  // ????????? form ??????
  setJhModalValue = (res) => {
    this.setState({
      companyList: res.data.data.dataList,
      companyAllInfo: res.data.data.dataList[0]
    });
    let data = { ...res.data.data.dataList[0] };
    let Phone = JSEncrypt(data.legalPhone);
    let cerNo = JSEncrypt(data.cerno);
    data.legalPhone = Phone ? `****${Phone.slice(Phone.length - 4, Phone)}` : '';
    data.cerno = cerNo ? `**********${cerNo.slice(cerNo.length - 4, cerNo)}` : '';
    data.businessClass = data.businessClass ? data.businessClass.split(',') : '';
    this.companyRef.current.setFieldsValue({ ...data });
  };

  onSearch = (companyName) => {
    this.setState({ searchData: companyName });
    if (companyName && companyName.length >= 2) {
      loginApi.getCompanyInfo(companyName, '').then((res) => {
        if (res?.data?.success) {
          this.setState({
            companyList: res.data.data.dataList
          });
        } else {
          message.error(res.data.message);
        }
      });
    }
  };

  handleTestCode = () => {
    const { registerPhone, companyAllInfo } = this.state;
    const companyInfo = JSON.stringify(sessionStorage.getItem('companyInfo'));
    if (!registerPhone) {
      message.error('???????????????????????????');
    } else if (registerPhone !== JSEncrypt(companyAllInfo.legalPhone)) {
      message.error('??????????????????????????????????????????');
    } else {
      loginApi.send(registerPhone, companyInfo.regulatoryCode || '', '').then((res) => {
        if (res?.data?.data) {
          this.setState({
            testCodeState: true
          });
          let time = 60;
          let interval = setInterval(() => {
            if (time > 0) {
              time -= 1;
              this.setState({
                codeTime: time
              });
            } else {
              time = 60;
              this.setState({
                codeTime: time,
                testCodeState: false
              });
              clearInterval(interval);
            }
          }, 1000);
          this.setState({
            testCode: res.data.data.code
          });
        }
      });
    }
  };

  handleGetPhone = (e) => {
    this.setState({
      registerPhone: e.target.value
    });
  };
  handleSelectType = (e) => {
    this.setState({
      selectType: e
    });
  };

  handleChangeType = (e) => {
    this.setState({
      type: e.target.value
    });
  };

  handleClear = () => {
    this.setState({
      companyList: []
    });
  };
  handleChangeName = () => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.nameForm.current.validateFields().then((values) => {
      const params = {
        id: userInfo.id,
        userName: values.userName
      };
      loginApi.updateUserInfo(params).then((res) => {
        if (res?.data?.success) {
          message.success('?????????????????????');
          loginApi.getUserInfo({ userId: userInfo.id }).then((res) => {
            if (res?.data?.data) {
              sessionStorage.setItem('userInfo', JSON.stringify(res.data.data));
              sessionStorage.setItem('companyInfo', JSON.stringify(res.data.data));
              window.location.href = '/public';
            }
          });
        } else {
          message.error(res.data.message || res.data.msg);
        }
      });
    });
  };
  handleChangeCancel = () => {
    this.setState({
      nameVisible: false
    });
  };

  render() {
    const {
      current,
      visible,
      companyVisible,
      checkVisible,
      messageVisible,
      setCompanyVisible,
      companyList,
      testCodeState,
      codeTime,
      selectType,
      registerPhone,
      reLogin,
      companyAllInfo,
      joinVisible,
      type
    } = this.state;
    const { modules } = this.props;
    const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const userName = userInfo ? userInfo.userName : '';

    const companyName = companyInfo ? companyInfo.companyName : '';
    const homePath = authUtils.getHomePath();
    const globalValue =
      localStorage.getItem('globalValue') && JSON.parse(localStorage.getItem('globalValue'));

    const loginMenu = (
      <Menu onClick={this.handleLogout}>
        <Menu.Item key="message">????????????</Menu.Item>
        <Menu.Item key="company">????????????</Menu.Item>
        <Menu.Item key="change">????????????</Menu.Item>
        <Menu.Item key="signout">
          <span>{userName == null ? '??????' : '????????????'}</span>
        </Menu.Item>
      </Menu>
    );

    const companyMenu = (
      <Menu onClick={this.handleLogout} style={{ width: 'auto', float: 'right' }}>
        <Menu.Item key="change">
          <span>????????????</span>
        </Menu.Item>
      </Menu>
    );

    const isActive = (obj, index) => {
      let active = current.indexOf(obj.path) !== -1;
      if (!active && index === 0 && homePath === current) {
        active = true;
      }
      if (active) {
        this.currentModuleTitle = { path: obj.path, title: obj.title };
      }
      return active;
    };

    const loopNavMap = (data) =>
      data.map((item, index) => (
        <li
          key={item.path}
          id={item.path}
          name={item.title}
          className={cx({ active: isActive(item, index) })}
          onClick={this.handlePage}
        >
          {item.title}
        </li>
      ));

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    };

    const handleJoin = async () => {
      const { userInfo } = this.state;
      this.setState({
        joinVisible: true,
        way: 'join'
      });
    };

    const handleCancelJoin = () => {
      this.setState({
        joinVisible: false,
        checkVisible: true
      });
    };

    const handleOkJoin = () => {
      this.setState({
        joinVisible: false,
        reLogin: true
      });
    };

    return (
      <div className="header-component">
        <div className="header-left">
          <span id={homePath} onClick={this.handleIndex}>
            ????????????????????????????????????
          </span>
          {/* {userInfo.companyType === '5' && <img src={sunshine} className="sun-logo" alt="" />} */}
          <ul>{modules && modules.length > 1 && loopNavMap(modules)}</ul>
        </div>
        <div className="header-right">
          <Dropdown overlay={companyMenu} trigger={['click']}>
            <span
              title={companyName}
              style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}
            >
              <Avatar
                size="small"
                style={{ color: '#BBBBBB', backgroundColor: '#fff' }}
                icon={<HomeOutlined />}
              />
              <span
                style={{
                  color: '#fff',
                  fontSize: '14px',
                  margin: '0 3px',
                  maxWidth: 200,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {companyName || <span>{''}</span>}
              </span>
              <DownOutlined style={{ color: '#fff' }} />
            </span>
          </Dropdown>
          <Dropdown overlay={loginMenu} trigger={['click']}>
            <span>
              <Avatar
                size="small"
                style={{ color: '#BBBBBB', backgroundColor: '#fff' }}
                icon={<UserOutlined />}
              />
              <span style={{ color: '#fff', fontSize: '14px', margin: '0 3px' }}>
                {userName || <span>{'?????????'}</span>}
              </span>
              <DownOutlined style={{ color: '#fff' }} />
            </span>
          </Dropdown>
        </div>
        <Modal
          title="????????????"
          width={400}
          visible={visible}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          onOk={this.handleSubmit}
          className="header-modal"
        >
          <Form {...formItemLayout} ref={this.formRef}>
            <Form.Item
              label="?????????"
              name="oldPassword"
              rules={[{ required: true, message: '??????????????????!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="?????????"
              rules={[
                {
                  required: true,
                  min: 6,
                  message: '??????????????????6?????????'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject('?????????????????????!');
                  }
                })
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="???????????????"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: '??????????????????!'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('?????????????????????!');
                  }
                })
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
        <CompanyModal visible={companyVisible} onClose={this.handleCloseCompany} />
        <Modal
          visible={setCompanyVisible}
          title={'????????????'}
          width={700}
          closable={false}
          footer={
            <div>
              <Button onClick={this.handleSetCompany} type="primary">
                ??????
              </Button>
              <Button onClick={this.handleCompanyCancel}>??????</Button>
            </div>
          }
        >
          <div>
            <Form {...formItemLayout} ref={this.companyRef}>
              <Form.Item
                label="????????????"
                name="companyName"
                rules={[{ required: true, message: '????????????????????????' }]}
              >
                <Radio.Group value={type} onChange={this.handleChangeType}>
                  <Radio value={1}>???????????????????????????</Radio>
                  <Radio value={2}>??????????????????????????????</Radio>
                  <Radio value={3}>??????????????????</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="????????????"
                name="companyName"
                rules={[{ required: true, message: '????????????????????????' }]}
              >
                <Select
                  placeholder="??????????????????????????????????????????"
                  showSearch
                  value={this.state.searchData}
                  onChange={this.onChange}
                  onSearch={this.onSearch}
                  notFoundContent={null}
                  optionFilterProp="children"
                  onBlur={this.handleClear}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {companyList && companyList.length > 0
                    ? companyList.map((ele, index) => {
                        return (
                          <Select.Option key={index} value={ele.uniformCode}>
                            {ele.companyName}
                          </Select.Option>
                        );
                      })
                    : ''}
                </Select>
              </Form.Item>
              <Form.Item
                className="legalPhone"
                name="legalPhone"
                label={
                  <span>
                    ????????????????????????
                    <br />
                    ?????????????????????
                  </span>
                }
                rules={[{ required: true, message: '?????????????????????????????????????????????????????????' }]}
              >
                <Input placeholder="??????????????????????????????????????????????????????" />
              </Form.Item>
              <Form.Item
                label="????????????"
                name="companyType"
                rules={[{ required: true, message: '????????????????????????' }]}
              >
                <Select
                  placeholder="?????????????????????"
                  notFoundContent={null}
                  onChange={this.handleSelectType}
                >
                  {this.state.typeList.map((ele, index) => {
                    return (
                      <Radio key={ele.id} value={ele.value}>
                        {ele.name}
                      </Radio>
                    );
                  })}
                  <Radio key={11} value={1}>
                    {1}
                  </Radio>
                </Select>
              </Form.Item>
              {selectType == 2 ||
              (companyAllInfo &&
                companyAllInfo.businessClass &&
                companyAllInfo.businessClass.split(',').findIndex((v) => v == 2) != -1) ? (
                <div>
                  <Form.Item label="????????????" name="businessType">
                    <Select placeholder="?????????????????????">
                      <Select.Option value={1}>??????</Select.Option>
                      <Select.Option value={2}>??????</Select.Option>
                      <Select.Option value={3}>???????????????</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="????????????" name="businessScope">
                    <Input />
                  </Form.Item>
                </div>
              ) : (
                ''
              )}
              <Form.Item label="???????????????" name="uniformName">
                <Input disabled={true} />
              </Form.Item>
              <Form.Item label="???????????????????????????" name="cerno" rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
              {type === 1 ? (
                <div>
                  <Form.Item
                    className="legalPhone"
                    name="legalPhone"
                    label={
                      <span>
                        ???????????????????????????
                        <br />
                        (??????????????????)
                      </span>
                    }
                  >
                    <Input disabled={true} />
                  </Form.Item>
                  <Form.Item
                    label="????????????????????????"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: '????????????????????????????????????'
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject('???????????????????????????!');
                        }
                      })
                    ]}
                  >
                    <Input
                      placeholder="?????????????????????????????????"
                      onChange={this.handleGetPhone}
                      addonAfter={
                        <Button
                          style={{ width: '100px' }}
                          className="testCodeBtn"
                          disabled={testCodeState}
                          type="primary"
                          onClick={this.handleTestCode}
                        >
                          {!testCodeState ? '???????????????' : `${codeTime}s`}
                        </Button>
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="?????????"
                    name={'code'}
                    rules={[{ required: true, message: '?????????????????????' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              ) : (
                <div>
                  {/* <Form.Item label="???????????????????????????" name="cerno" rules={[{ required: true }]}>
                    <Input disabled />
                  </Form.Item> */}
                  <Form.Item label="???????????????????????????" name="cerNo" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </div>
              )}
            </Form>
          </div>
        </Modal>
        <Modal
          visible={checkVisible}
          closable={companyInfo ? companyInfo.companyId : ''}
          // maskClosable={false}
          onCancel={() => {
            this.setState({ checkVisible: false });
          }}
          title="????????????????????????????????????????????????????????????"
          width={400}
          footer={
            <div>
              <Button onClick={this.handleCompany} type="primary">
                ????????????
              </Button>
              <Button type="primary" onClick={handleJoin}>
                ????????????
              </Button>
            </div>
          }
        >
          <span>
            {this.state.way === 'head'
              ? '???????????????????????????'
              : '????????????????????????????????????????????????????????????'}
          </span>
        </Modal>
        <Modal
          visible={reLogin}
          closable={false}
          title="????????????????????????????????????????????????????????????"
          width={400}
          footer={
            <Button onClick={this.handleReLogin} type="primary">
              ??????
            </Button>
          }
        >
          <span>
            {this.state.way == 'join' ? '????????????????????????????????????' : '?????????????????????????????????'}
          </span>
        </Modal>
        <JoinCompany
          handleOk={handleOkJoin}
          handleCancel={handleCancelJoin}
          visible={joinVisible}
        />
        <Modal
          title={'???????????????'}
          footer={
            <div>
              <Button type="primary" onClick={this.handleChangeName}>
                ??????
              </Button>
            </div>
          }
          // onOk={this.handleChangeName}
          closable={false}
          visible={
            userInfo ? (userInfo.userName === '????????????' ? true : this.state.nameVisible) : ''
          }
        >
          <Form ref={this.nameForm} {...addFormItemLayout}>
            <Form.Item
              name={'userName'}
              label={'?????????'}
              initialValue={userInfo && userInfo.userName}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <p style={{ marginLeft: '105px', fontSize: '12px', color: '#E0716B' }}>
              ???????????????????????????????????????????????????????????????
            </p>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default withRouter(Header);
