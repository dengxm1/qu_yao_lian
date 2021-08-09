import React from 'react';
import { Button, Form, Input, DatePicker, Modal, message, Select, Radio, InputNumber } from 'antd';
import FormInputSearch from 'components/FormInputSearch';
import codeManageApi from 'api/codeManage';
import informFillingApi from 'api/informFilling';
import otherApi from 'api/other';

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};
class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selType: null, //用途
      executionStandardlist: [], //执行标准
      inputModalVisible: false,
      allCompany: [],
      searchData: ''
    };
    this.formRef = React.createRef();
    this.timer = null;
  }
  //取消空格校验
  handleInputType = (rule, value, callback) => {
    try {
      if (value) {
        if (value.trim() === '') {
          callback('请输入正确的数据！');
          return false;
        } else {
          callback();
        }
      } else {
        callback();
      }
    } catch (err) {
      callback();
    }
  };
  handleCreateCodeSubmit = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        codeManageApi.emptyCodeInsert(values).then((res) => {
          if (res.data.code == '0') {
            message.success('领码成功');
            this.props.onClose(true);
            this.setState({
              productType: ''
            });
            this.formRef.current.resetFields();
          } else {
            message.error(`领取失败`);
          }
        });
      })
      .catch((errorInfo) => {});
  };
  handleCreateCodeCancel = () => {
    // this.formRef.current.resetFields();
    this.props.onClose();
  };
  handleChangeSelType = (e) => {
    this.setState({
      selType: e.target.value
    });
  };
  //字典值获取
  getValue = (remark) => {
    otherApi.getValue({ type: remark }).then((res) => {
      if (res?.data?.success) {
        if (remark == 'execution_standard') {
          //执行标准
          this.setState({
            executionStandardlist: res.data.data.dataList
          });
        }
      }
    });
  };
  getSupplierList = async (name, pageNum = 1, pageSize = 20) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      return informFillingApi
        .manufacturerList({ pageNum, pageSize, companyName: name })
        .then((res) => {
          if (res?.data?.data) {
            this.setState({
              allCompany: res.data.data
            });
            return true;
          } else {
            return false;
          }
        });
    }, 500);
  };
  handleSeleted = (v) => {
    this.setState({
      inputModalVisible: false,
      searchData: (v && v.companyName) || ''
    });
  };
  handleFindAll = async (params, key) => {
    let flag = false;
    console.log('params--', params);
    if (key === 'saleName') {
      const { saleName = '', pageNum = 1, pageSize = 10 } = params;
      flag = await this.getSupplierList(saleName, pageNum, pageSize);
    }
    if (flag) {
      this.setState({
        inputModalVisible: true
      });
    }
  };
  onSearch = (value) => {
    this.getSupplierList(value, 1, 10);
  };
  render() {
    let { selType, executionStandardlist, searchData, allCompany, inputModalVisible } = this.state;
    const { visible } = this.props;

    return (
      <Modal
        title="申请追溯码"
        visible={visible}
        width={500}
        maskClosable={false}
        onCancel={this.handleCreateCodeCancel}
        footer={
          <div>
            <Button type="primary" onClick={() => this.handleCreateCodeSubmit()}>
              确认
            </Button>
            <Button type="primary" onClick={() => this.handleCreateCodeCancel()}>
              取消
            </Button>
          </div>
        }
      >
        <Form ref={this.formRef} {...formItemLayout}>
          <Form.Item
            name="sellType"
            label="用途"
            rules={[{ required: true, message: '请选择用途' }]}
          >
            <Radio.Group value={selType} onChange={this.handleChangeSelType}>
              <Radio value={1}>增量药品赋码</Radio>
              <Radio value={2}>存量药品赋码</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="productName" label={'药品'} rules={[{ required: true }]}>
            <Select
              style={{
                width: '80%',
                marginRight: 5
              }}
              placeholder="请输入选择药品"
              showSearch
              allowClear
              value={searchData}
              optionFilterProp="children"
              onSearch={(e) => {
                this.onSearch(e);
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {allCompany.length > 0
                ? allCompany.map((ele, index) => {
                    return (
                      <Select.Option key={ele.value} value={ele.value}>
                        {ele.name}
                      </Select.Option>
                    );
                  })
                : ''}
            </Select>
            <span
              style={{ color: '#1890ff', cursor: 'pointer' }}
              onClick={() => this.handleFindAll({}, 'saleName')}
            >
              查看全部
            </span>
          </Form.Item>
          <Form.Item name="barCode" label="药品本位码" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          {selType == 2 ? (
            <>
              <Form.Item name="productionDate" label={'生产日期'} rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>
              <Form.Item name="executionStandard" label={'执行标准'} rules={[{ required: true }]}>
                <Select
                  placeholder="请输入选择执行标准"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onFocus={() => this.getValue('execution_standard')}
                >
                  {executionStandardlist.length
                    ? executionStandardlist.map((ele, index) => {
                        return (
                          <Select.Option key={ele.value} value={ele.value}>
                            {ele.name}
                          </Select.Option>
                        );
                      })
                    : ''}
                </Select>
              </Form.Item>
            </>
          ) : null}
          <Form.Item name="batchNumber" label="生产批次号" rules={[{ required: true }]}>
            <Input placeholder="请输入生产批次号" />
          </Form.Item>
          <Form.Item name="bagNum" label="包装层级" rules={[{ required: true }]}>
            <InputNumber precision={0} placeholder="请输入包装层级"></InputNumber>
          </Form.Item>
        </Form>
        <FormInputSearch
          visible={inputModalVisible}
          ModalTitle={'选择上市许可持有人'}
          searchKey={'saleName'}
          dataSource={allCompany}
          onFocus={(v) => this.handleFindAll(v, 'saleName')}
          handleSeleted={(v) => this.handleSeleted(v)}
        />
      </Modal>
    );
  }
}

export default Code;
