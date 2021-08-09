import React, { useState, useEffect } from 'react';
import { Drawer, Button, Form, Input, DatePicker, message } from 'antd';

import NameLabel from 'components/NameLabel';
import FormInputSearch from 'components/FormInputSearch';
import DataTable from 'components/DataTable';
import { DrawerHeaderTips, companyColumns, productColumns } from './localData';
import { randomKey, dataValidation, rules } from 'utils/common';
import outApi from 'api/outRegister';
import informFillingApi from 'api/informFilling.js';
import './index.less';
import moment from 'moment';
import loginApi from 'api/login.js';

const AddAndUpdate = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const { visible, handleCancel, type, getData, data, outputType } = props;
  const [searchProductData, setSearchProductData] = useState([]);
  const [productList, setProductList] = useState(null);
  const [allCompany, setAllCompany] = useState(null);
  const [productBatchList, setProductBatchList] = useState(null);
  const [detailData, setDetailData] = useState({});
  const [InputModalVisible, setInputModalVisible] = useState(false);
  const [tempType, setTempType] = useState('outCompanyName');
  const [form] = Form.useForm();
  const [companyList, setCompanyList] = useState([]);
  const [productDataList, setProductDataList] = useState([]);
  const [dataTableRecordId, setDataTableRecordId] = useState('');

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

  const getBuyerList = async (name, pageNum = 1, pageSize = 20) => {
    return informFillingApi.BuyerList({ pageNum, pageSize, companyName: name }).then((res) => {
      if (res?.data?.data) {
        setAllCompany(res.data.data);
        return true;
      } else {
        return false;
      }
    });
  };

  useEffect(() => {
    form.setFieldsValue({ managePhone: userInfo.mobile, manageName: userInfo.userName });
    if (type) {
      getBuyerList('');
    }
    if (type === 'edit') {
      outApi.getOutRegisterDetail({ id: data.id }).then((res) => {
        if (res?.data?.data) {
          const data = res.data.data;
          setDetailData(data);
          form.setFieldsValue({
            sellCode: data.outOrderNo,
            registerName: data.registerPerson,
            manageName: data.managerPerson,
            managePhone: data.managerPhone,
            outCompanyName: data.buyName,
            buyerUniformCode: data.buyUniformCode,
            buyId: data.buyId,
            contactPerson: data.buyContact,
            contactPersonTel: data.buyContactTel,
            stockOutTime: data.stockOutTime ? moment(data.stockOutTime) : '',
            companyType: ['生产企业', '流通企业'][+data.buyCompanyType - 1]
          });

          let datasource = [];
          data.page.list.forEach((ele, index) => {
            datasource.push({ ...ele, unitSpecifications: ele.spec });
          });

          let tempObj = {};
          for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
              const element = data[key];
              if (typeof element !== 'object') {
                tempObj[key] = element;
              }
            }
          }
          tempObj.companyName = tempObj.buyName;
          tempObj.contactPerson = tempObj.buyContact;
          tempObj.contactPersonTel = tempObj.buyContactTel;

          setProductDataList(datasource);
          setCompanyList([tempObj]);
        }
      });
    }
  }, [type]);

  const handleSelectCompany = (e) => {
    let companyMessage = allCompany.list.filter((v) => v.companyName == e)[0];
    loginApi.getCompanyByUniformcode({ uniformCode: companyMessage.uniformCode }).then((res) => {
      if (res?.data?.data) {
        const value = res.data.data;
        form.setFieldsValue({
          ...companyMessage,
          buyerUniformCode: companyMessage.uniformCode.replace(/\s/g, ''),
          buyId: value.companyId,
          outCompanyName: e
        });
        const arr = [...companyList];
        if (!arr.some((item) => item.companyName === companyMessage.companyName)) {
          const i = arr.findIndex((item) => item.id === dataTableRecordId);
          arr[i] = {
            ...arr[i],
            ...companyMessage,
            buyUniformCode: companyMessage.uniformCode.replace(/\s/g, ''),
            buyId: value.companyId,
            outCompanyName: e,
            buyRegulatoryCode: value.regulatoryCode,
            buyCompanyType: value.companyType,
            buyName: value.companyName,
            contactAddr: value.address
          };
          setCompanyList(arr);
        } else {
          message.warn('已添加该企业，请不要重复添加');
        }
      }
    });
  };

  const handleClose = () => {
    handleCancel();
    form.resetFields();
    setProductDataList([]);
    setCompanyList([]);
  };

  const handleChangeBatch = (e) => {
    const batch = productBatchList.list.find((v) => v.batchNumber === e);
    const batchId = batch.id;
    const stockNum = batch.stockNum;
    const arr = [...productDataList];
    if (!arr.find((item) => item.productRecordId === batchId)) {
      const i = arr.findIndex((item) => item.tempId === dataTableRecordId);
      arr[i] = {
        ...arr[i],
        productRecordId: batchId,
        stockNum: stockNum,
        batchNumber: e
      };
      setProductDataList(arr);
    } else {
      message.error('批次已存在，请重新选择');
    }
  };

  const getProductBatchList = async (id, pageNum = 1, pageSize = 10) => {
    const params = { id, pageNum, pageSize };
    return outApi.getProductBatchList(params).then((res) => {
      if (res?.data?.data) {
        setProductBatchList(res.data.data);
        return true;
      } else {
        return false;
      }
    });
  };

  const onChange = (e) => {
    const product = productList.list.find((v) => `${v.id}` === e);
    setSearchProductData(e);
    getProductBatchList(e);

    // if (!productDataList.find((item) => item.id === product.id)) {
    setProductDataList([...productDataList, { ...product, tempId: randomKey() }]);
    // } else {
    //   message.error('当前商品已存在');
    // }
  };

  const add = () => {
    form.validateFields().then((values) => {
      // ---------------- validation start! ----------------
      if (!companyList.length) {
        return message.error('下游企业列表不能为空');
      }
      if (!productDataList.length) {
        return message.error('产品出库列表不能为空');
      }
      for (let i = 0; i < companyList.length; i++) {
        const record = companyList[i];
        const msgHead = '下游为' + record.companyName + '的';
        const rule = {
          buyClass: '请选择下游企业类型',
          companyName: (text) => {
            if (record.buyClass === 1 && !text) {
              return '请为下游为企业类型的选择企业';
            }
          },
          contactPerson: (text) => {
            if (record.buyClass === 1 && !text) {
              return msgHead + '联系人不能为空';
            }
          },
          contactPersonTel: (text) => {
            if (record.buyClass === 1) {
              if (!text || !rules.isPhone.test(text)) {
                return msgHead + (!text ? '联系人电话号码不能为空' : '联系人电话号码格式非法');
              }
            }
          },
          productNum: (text) => {
            if (outputType === 'single' && !text) {
              return '出库数量不能为空且不能为0';
            }
          }
        };
        if (dataValidation(record, rule)) {
          return;
        }
        delete record.id;
      }
      for (let i = 0; i < productDataList.length; i++) {
        const record = productDataList[i];
        const msgHead = '产品为' + record.productName + '的';
        const rule = {
          batchNumber: `请选择${msgHead}生产批次`,
          productNum: (text) => {
            if (outputType === 'double' && type === 'add' && !text) {
              return msgHead + '出库数量不能为空且不能为0';
            }
          }
        };
        if (dataValidation(record, rule)) {
          return;
        }
      }
      if (outputType === 'single') {
        let maxNum = companyList.reduce((sum, i) => (sum += i.productNum), 0);
        if (maxNum > productDataList[0].stockNum) {
          return message.error('出库总量不能大于产品库存量，请调整');
        }
      }

      // ---------------- validation end! ----------------
      const params = {
        ...values,
        status: 1,
        sellCode: values.sellCode,
        baseInfo: {
          managePhone: values.managePhone,
          managerPhone: values.manageName
        },
        stockOutTime: values.stockOutTime.valueOf(),
        productInfo: productDataList,
        buyCompanyList: companyList,
        outputType
      };
      !values.sellCode && delete params.sellCode;
      if (type === 'add') {
        productDataList.forEach((ele) => (ele.productDetailId = ele.id));
        outApi.addOutStackInfo(params).then((res) => {
          if (res?.data?.success) {
            message.success('新增成功');
            handleClose();
            getData(1, 10);
            form.resetFields();
          } else {
            message.error(res.data.message || res.data.msg);
          }
        });
      } else if (type === 'edit') {
        productDataList.forEach((ele) => {
          ele.id = ele.productDetailId;
          ele.productionQuantity = ele.productNum;
        });
        const editParams = {
          ...values,
          // productionQuantity: values.productNum,
          buyCompanyType: detailData.companyType,
          // combinationBarCode: detailData.combinationBarCode,
          userId: companyInfo.userId,
          buyUniformCode: detailData.buyerUniformCode,
          buyId: detailData.buyId,
          buyName: detailData.buyName,
          buyClass: detailData.buyClass,
          stockOutTime: values.stockOutTime.valueOf(),
          productDetails: productDataList
        };
        editParams.outOrderId = data.id;
        editParams.outOrderNo = data.outOrderNo;
        outApi.updateBuyProductBatchInfo(editParams).then((res) => {
          if (res?.data?.success) {
            message.success('编辑成功');
            handleClose();
            getData(1, 10);
            form.resetFields();
          } else {
            message.error(res.data.message || res.data.msg);
          }
        });
      }
    });
  };

  const handleFindAll = async (params, key = tempType, id = '', tempId) => {
    setTempType(key);
    let flag = false;
    if (key === 'outCompanyName') {
      id && setDataTableRecordId(id);
      const { outCompanyName, pageNum = 1, pageSize = 10 } = params;
      flag = await getBuyerList(outCompanyName, pageNum, pageSize);
    }
    if (key === 'productName') {
      id && setDataTableRecordId(id);
      const listParams = {
        pageNum: params.pageNum || 1,
        pageSize: params.pageSize || 10,
        productName: params.productName || ''
      };
      const res = await outApi.getProductList(listParams);
      if (res?.data?.data) {
        setProductList(res.data.data);
        flag = true;
      }
    }
    if (key === 'batchNumber') {
      const { _, pageNum = 1, pageSize = 10 } = params;
      tempId && setDataTableRecordId(tempId);
      flag = await getProductBatchList(id || searchProductData, pageNum, pageSize);
    }
    flag && setInputModalVisible(true);
  };

  const handleSeleted = (v) => {
    if (v) {
      switch (tempType) {
        case 'outCompanyName':
          handleSelectCompany(v.companyName);
          break;
        case 'productName':
          onChange(v.id);
          break;
        case 'batchNumber':
          handleChangeBatch(v.batchNumber);
          break;
        default:
          break;
      }
    }
    setInputModalVisible(false);
  };

  const FormInputSearchObj = {
    outCompanyName: {
      ModalTitle: '选择企业',
      searchKey: 'outCompanyName',
      dataSource: allCompany
    },
    productName: {
      ModalTitle: '选择产品',
      searchKey: 'productName',
      dataSource: productList
    },
    batchNumber: {
      ModalTitle: '选择批次',
      searchKey: 'batchNumber',
      dataSource: productBatchList
    }
  }[tempType];

  const handleAddCompany = () => {
    setCompanyList([...companyList, { id: randomKey(), buyClass: null }]);
  };

  return (
    <div className="modal">
      <Drawer
        className="addDrawer"
        title={type == 'add' ? '新增出库登记' : '编辑出库登记'}
        placement="right"
        maskClosable={false}
        closable={true}
        width={1000}
        onClose={handleClose}
        visible={visible}
        footer={
          <div>
            <Button type="primary" onClick={add}>
              确认并提交
            </Button>
            <Button onClick={handleClose}>关闭</Button>
          </div>
        }
      >
        {type === 'add' && <DrawerHeaderTips type={outputType} />}
        <NameLabel name={'销售出库信息'} />
        <div className="modal-first">
          <Form className="modal-first-left" form={form} {...formItemLayout}>
            <Form.Item
              name="manageName"
              label="经办人"
              required={[{ required: true, message: '经办人不能为空' }]}
            >
              <Input disabled={type == 'edit' ? true : false} />
            </Form.Item>
            <Form.Item
              name="stockOutTime"
              label="出库日期"
              rules={[{ required: true, message: '登记日期不能为空' }]}
            >
              <DatePicker
              // disabled={type == 'edit' ? true : false}
              />
            </Form.Item>
          </Form>
          <Form className="modal-first-right" form={form} {...formItemLayout}>
            <Form.Item
              name="managePhone"
              label="经办人电话"
              rules={[
                {
                  required: true,
                  message: '经办人电话不能为空'
                },
                {
                  pattern: rules.isPhone,
                  message: '经办人电话格式非法'
                }
              ]}
            >
              <Input disabled={type == 'edit' ? true : false} />
            </Form.Item>
            {(type === 'edit' || outputType === 'double') && (
              <Form.Item name="sellCode" label="出库单号">
                <Input disabled={type == 'edit' ? true : false} />
              </Form.Item>
            )}
          </Form>
        </div>
        <NameLabel name="下游信息" />
        {React.useMemo(
          () => (
            <DataTable
              addBtnText="添加下游"
              dataSource={companyList}
              maxLength={outputType === 'single' ? undefined : 1}
              isShowFooter={type === 'add'}
              addRecord={handleAddCompany}
              columns={companyColumns({
                type,
                companyList,
                setCompanyList,
                handleFindAll,
                outputType
              })}
            />
          ),
          [companyList, type]
        )}
        <NameLabel name="产品明细" />
        {React.useMemo(
          () => (
            <DataTable
              addBtnText="添加出库产品"
              dataSource={productDataList}
              maxLength={outputType === 'single' ? 1 : undefined}
              isShowFooter={type === 'add'}
              addRecord={() => handleFindAll({}, 'productName')}
              columns={productColumns({
                type,
                productDataList,
                setProductDataList,
                handleFindAll,
                outputType
              })}
            />
          ),
          [productDataList, type]
        )}
      </Drawer>
      {type !== 'edit' && (
        <FormInputSearch
          visible={InputModalVisible}
          ModalTitle={FormInputSearchObj.ModalTitle}
          searchKey={FormInputSearchObj.searchKey}
          dataSource={FormInputSearchObj.dataSource}
          onFocus={(v = {}) => handleFindAll(v)}
          handleSeleted={(v) => handleSeleted(v)}
        />
      )}
    </div>
  );
};
export default AddAndUpdate;
