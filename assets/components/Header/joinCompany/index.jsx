import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Spin, Checkbox, message } from 'antd';
import loginApi from 'api/login.js';
import './index.less';

const JoinCompany = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const { visible, handleCancel, handleOk } = props;
  const [companyName, setCompanyName] = useState('');
  const [companyList, setCompanyList] = useState([]);
  const [searchData, setSearchData] = useState('');
  const [companyAllInfo, setCompanyAllInfo] = useState({});
  const [selectType, setSelectType] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    }
  };

  const handleChangeName = (e) => {
    if (e) {
      setSearchData(e);
      setFetching(true);
      loginApi.getJoinCompanyList('', e).then((res) => {
        if (res?.data?.success) {
          setCompanyList(res.data.data.dataList);
          setCompanyAllInfo(res.data.data.dataList[0]);
          let data = { ...res.data.data.dataList[0] };
          data.legalPhone = data.legalPhone
            ? `****${data.legalPhone.slice(data.legalPhone.length - 4, data.legalPhone)}`
            : '';
          data.businessClass = data.businessClass ? data.businessClass.split(',') : '';
          if (data.companyState == 1) {
            data.hasCheck = '是';
          } else {
            data.hasCheck = '否';
          }
          data.companyType = '食品生产商/销售';
          form.setFieldsValue({ ...data });
        } else {
          message.error(res.data.message || res.data.msg);
        }
      });
    }
  };
  const handleSearchName = (e) => {
    if (e) {
      loginApi.getJoinCompanyList(e, '').then((res) => {
        if (res?.data?.success) {
          setCompanyList(res.data.data.dataList);
          setCompanyAllInfo(res.data.data.dataList[0]);
        }
      });
    }
  };

  const handleSubmit = () => {
    const params = {
      ...companyAllInfo,
      userId: userInfo.id,
      createdUserId: userInfo.id
    };
    loginApi
      .joinCompany(params)
      .then((res) => {
        if (res?.data?.data) {
          message.success(res.data.message);
          handleOk();
          form.resetFields();
        } else {
          message.error(res.data.message);
        }
      })
      .catch(() => {
        message.error('暂无企业法人信息，请使用法人身份证验证的方式进行激活。');
      });
  };

  const handleCancelJoin = () => {
    handleCancel();
    setSelectType([]);
    form.resetFields();
    setCompanyList([]);
  };
  const handleClear = () => {
    setCompanyList([]);
  };
  return (
    <Modal
      closable={false}
      title="申请加入企业"
      visible={visible}
      footer={
        <div>
          <Button type="primary" onClick={handleSubmit}>
            确认
          </Button>
          <Button onClick={handleCancelJoin}>取消</Button>
        </div>
      }
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item
          label="企业或个体户名称"
          name="companyName"
          rules={[{ required: true, message: '企业或个体户名称不能为空' }]}
        >
          <Select
            filterOption={false}
            placeholder="请输入企业或个体户名称，可模糊搜索。"
            showSearch
            onBlur={handleClear}
            value={searchData}
            onChange={handleChangeName}
            onSearch={handleSearchName}
            notFoundContent={fetching ? <Spin size="small" /> : null}
          >
            {companyList.length > 0
              ? companyList.map((ele, index) => {
                  return (
                    <Select.Option key={index} value={ele.uniformCode}>
                      {ele.companyName}
                    </Select.Option>
                  );
                })
              : ''}
          </Select>
          <span style={{ color: 'red' }}>请先激活所要加入的企业。</span>
        </Form.Item>

        <Form.Item label="统一社会信用代码" name="uniformCode">
          <Input disabled />
        </Form.Item>
        <Form.Item label="企业类型" name="companyType">
          <Select disabled>
            <Select.Option value={1}>食品生产商/销售</Select.Option>
          </Select>
        </Form.Item>
        {selectType.findIndex((v) => v === 2) !== -1 ||
        (companyAllInfo &&
          companyAllInfo.businessClass &&
          companyAllInfo.businessClass.split(',').findIndex((v) => v == 2) != -1) ? (
          <div>
            <Form.Item label="经营类型" name="businessType">
              <Select disabled placeholder="请选择经营类型">
                <Select.Option value={1}>批发</Select.Option>
                <Select.Option value={2}>零售</Select.Option>
                <Select.Option value={3}>批发兼零售</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="经营范围" name="businessScope">
              <Input disabled />
            </Form.Item>
          </div>
        ) : (
          ''
        )}
        <Form.Item label="法定代表人" name="uniformName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="经营场所" name="businessPlace">
          <Input disabled />
        </Form.Item>
        <Form.Item label="营业期限" name="businessTerm">
          <Input disabled />
        </Form.Item>
        <Form.Item label="激活状态" name="hasCheck">
          <Input disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default JoinCompany;
