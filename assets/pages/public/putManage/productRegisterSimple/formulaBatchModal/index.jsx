import React, { useState, useEffect } from 'react';
import { Divider, Popconfirm, Form, Modal, Table, message } from 'antd';
import informFillingApi from 'api/informFilling.js';
import moment from 'moment';
import './index.less';

const FormulaBatchModal = (props) => {
  const { visible, onCancel, handleGetTableData, dataList, type, handleGetFormulaData } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [data, setData] = useState(dataList);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchData, setSearchData] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectDatasource, setSelectDatasource] = useState([]);
  const [searchForm] = Form.useForm();
  const columns = [
    {
      title: '配方编号',
      dataIndex: 'formulaNo',
      key: 'formulaNo',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      })
    },
    {
      title: '配方名称',
      dataIndex: 'formulaName',
      key: 'formulaName',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      })
    },

    {
      title: '最小生产量',
      dataIndex: 'minProduction',
      key: 'minProduction',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return <span>{`${text}${record.minProductionUnit}`}</span>;
      }
    }
  ];
  useEffect(() => {
    getData(1, 20);
  }, []);
  useEffect(() => {
    if (JSON.stringify(dataSource) != '{}') {
      if (type == 'edit') {
        setData(dataList);
        handleGetTableData(dataList);
      } else {
        setData([]);
      }
    }
  }, [dataList]);
  const getData = (page, pageSize, searchData) => {
    const params = {
      pageNum: page,
      pageSize,
      ...searchData
    };
    informFillingApi.formulaList(params).then((res) => {
      if (res?.data?.data) {
        setPageNum(page);
        setTotal(res.data.data.total);
        setDataSource(res.data.data.list);
        if (res.data.data.list.length == 0 && pageNum != 1) {
          // setData(pageNum - 1, pageSize);
        }
      }
    });
  };

  const onSelectChange = (record, selected, selectedRows) => {
    setSelectDatasource(selectedRows);
  };

  const onSelectAll = (selected, selectedRows, changeRows) => {
    setSelectDatasource(selectedRows);
  };
  const onSelectChangeKeys = (selectedRowKey) => {
    setSelectedRowKeys(selectedRowKey);
  };
  const handleClose = () => {
    onCancel();
    searchForm.resetFields();
    setSelectDatasource([]);
    setSelectedRowKeys([]);
  };
  const handleBatchSubmit = () => {
    const indexArray = [];
    let keyValue = null;
    let dataKeyArr = [];
    informFillingApi.formulaDetail({ formulaId: selectDatasource[0].id }).then((res) => {
      if (res?.data?.success) {
        const list = res.data.data.rawMaterialRecordDOList; // 新的原料
        list.map((ele, i) => {
          const index = data.findIndex((v) => v.id == ele.id);
          let dataKey = dataList.findIndex((v) => v.id == ele.id);
          dataKeyArr.push(dataKey);
          indexArray.push(index);
          keyValue = indexArray.findIndex((v) => v != -1);
        });
        const dataLists = dataList.concat(list);
        setData(list);
        handleGetFormulaData(list);
        handleGetTableData(list);
        onCancel();
        searchForm.resetFields();
        setSelectDatasource([]);
      }
    });
  };
  return (
    <Modal visible={visible} onOk={handleBatchSubmit} width={700} onCancel={handleClose}>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={'id'}
        filterMultiple
        rowSelection={{
          type: 'radio',
          onSelect: onSelectChange,
          onSelectAll: onSelectAll,
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChangeKeys
        }}
      />
    </Modal>
  );
};
export default FormulaBatchModal;
