import React, { useEffect, useState } from 'react';
import { Modal, Table, message, Pagination } from 'antd';
import utils from 'utils';
import stockManageApi from 'api/stockManage';

class CarryListModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      page: 1,
      pageSize: 10,
      contactList: [],
      total: 0,
      selectContact: []
    };
  }
  componentDidMount() {
    this.fetchContactList();
  }
  fetchContactList = () => {
    const { page, pageSize } = this.state;
    stockManageApi
      .epMoversList({
        currentPage: page,
        pageSize: pageSize
      })
      .then((res) => {
        if (res.data.code == '0') {
          this.setState({
            contactList: res.data.data.dataList,
            total: res.data.data.totalCount
          });
        } else {
          message.error(res.data.message);
        }
      });
  };
  handleOk = () => {
    this.props.onClose(this.state.selectContact);
  };

  handleClose = () => {
    this.props.onClose();
  };
  handleChangeTablePage = (page, pageSize) => {
    this.setState(
      {
        page,
        pageSize
      },
      () => {
        this.fetchContactList();
      }
    );
  };
  onSelectContact = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectContact: selectedRows
    });
  };
  render() {
    const { page, pageSize, total, contactList } = this.state;
    const { visible, codeRecord } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'moversName',
        render: (text) => {
          return <span>{utils.noPassByName(text)}</span>;
        }
      },
      {
        title: '身份证号码',
        dataIndex: 'moversIdcard',
        render: (text) => {
          return <span>{utils.noPassByCode(text)}</span>;
        }
      }
    ];
    const rowSelection = {
      type: 'checkbox',
      onChange: this.onSelectContact
    };

    return (
      <Modal
        visible={visible}
        title="选择搬运人员"
        width={800}
        destroyOnClose
        onOk={this.handleOk}
        onCancel={this.handleClose}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={contactList}
          rowSelection={rowSelection}
          pagination={false}
          scroll={{ y: 400 }}
        />
        <Pagination
          total={total}
          showTotal={(total) => `共${total}条`}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          onChange={this.handleChangeTablePage}
          onShowSizeChange={this.handleChangeTablePage}
          current={page}
          pageSize={pageSize}
        />
      </Modal>
    );
  }
}
export default CarryListModal;
