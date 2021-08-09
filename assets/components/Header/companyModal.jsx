import React from 'react';
import { Modal, Form, Select, message } from 'antd';
import loginApi from 'api/login.js';
import authUtils from 'utils/authUtils';

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 12
  }
};
const { Option } = Select;

class CompanyModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyList: [],
      hasCheck: true,
      type: '',
      companyType: '0'
    };
    this.formRef = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    if (visible && visible !== this.props.visible) {
      this.fetchList();
    }
  }

  fetchList() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    loginApi.getUserCompanyList(userInfo.id).then((res) => {
      if (res.data.code === '0') {
        this.setState({
          companyList: res.data.data
        });
      } else {
        message.error(res.data.message);
      }
    });
  }

  handleOk = () => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
    this.formRef.current.validateFields().then((values) => {
      loginApi
        .changeCompany(userInfo.id, this.state.hasCheck ? companyInfo.companyId : values.companyId)
        .then((res) => {
          if (res?.data?.success) {
            message.success('切换企业成功');
            loginApi.getCurrentCompany(userInfo.id).then((res) => {
              if (res?.data?.data) {
                sessionStorage.setItem('companyInfo', JSON.stringify(res.data.data));
                window.location.href = '/public';
              }
            });
          } else {
            message.error(res.data.message);
          }
        });
    });
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.onClose();
  };

  handleSelectCompany = (value, option) => {
    this.setState({
      hasCheck: option.hasCheck,
      type: option.type,
      companyType: option.companyType
    });
  };

  render() {
    const { companyList } = this.state;
    const { visible } = this.props;
    const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
    return (
      <Modal
        title="切换企业"
        visible={visible}
        centered
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form {...layout} ref={this.formRef}>
          <Form.Item
            label="选择企业"
            name="companyId"
            initialValue={companyInfo ? companyInfo.companyName : ''}
            rules={[{ required: true, message: '请选择权限可操作方法!' }]}
          >
            <Select onChange={this.handleSelectCompany}>
              {companyList &&
                companyList.map((item, i) => {
                  return (
                    <Option
                      key={i}
                      value={item.companyId}
                      hasCheck={item.hasCheck}
                      type={item.type}
                      companyType={item.companyType}
                    >
                      {item.companyName}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CompanyModal;
