import React, { useEffect, useState } from 'react';
import { Modal, Table, Input, Button, message } from 'antd';
import stockManageApi from 'api/stockManage';

const ContactModal = (props) => {
  const [contactList, setContactList] = useState([]);
  const [selectContact, setSelectContact] = useState(null);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    if (props.visible) {
      fetchContactList();
    }
  }, [props.visible]);

  const fetchContactList = () => {
    stockManageApi
      .oftenCompanyList({
        type: props.type,
        companyType: props.companyType,
        keyword: searchVal
      })
      .then((res) => {
        if (res.data.code == '0') {
          setContactList(res.data.data.dataList);
        } else {
          message.error(res.data.message);
        }
      });
  };

  const onSelectContact = (selectedRowKeys, selectedRows) => {
    setSelectContact(selectedRows[0]);
  };

  const handleChangeInput = (e) => {
    setSearchVal(e.target.value);
  };

  const handleOk = () => {
    setContactList([]);
    props.onClose(selectContact);
  };

  const handleClose = () => {
    setContactList([]);
    props.onClose();
  };

  const rowSelection = {
    type: 'radio',
    onChange: onSelectContact
  };

  const columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName'
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'uniformCode'
    }
  ];

  return (
    <Modal
      visible={props.visible}
      title="选择联系人"
      width={800}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleClose}
    >
      <div>
        <Input
          placeholder="请输入企业或联系人名称搜索"
          onChange={handleChangeInput}
          style={{ width: 250, marginRight: 15, marginBottom: 15 }}
        />
        <Button type="primary" onClick={fetchContactList}>
          搜索
        </Button>
      </div>
      <Table
        rowKey="oftenId"
        columns={columns}
        dataSource={contactList}
        rowSelection={rowSelection}
        pagination={false}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default ContactModal;
