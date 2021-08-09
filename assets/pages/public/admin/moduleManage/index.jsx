import React, { useState, useEffect } from 'react';
import { Table, Tree, message, Button, Divider, Popconfirm, Pagination } from 'antd';
import SearchForm from './SearchForm';
import AddAndUpdate from './addAndUpdate';
import MemberManage from './memberManage';
import adminApi from 'api/admin';
import './index.less';

const ModuleManage = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));

  const [pageNum, setPageNum] = useState(1);
  const [searchData, setSearchData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [addVisible, setAddVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [rowId, setRowId] = useState(null);
  const [rowRecord, setRowRecord] = useState({});
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [treeList, setTreeList] = useState([]);
  const [memberVisible, setMemberVisible] = useState(false);
  const [memberData, setMemberData] = useState({});
  const columns = [
    // {
    //   title: '序号',
    //   key: 'index',
    //   onHeaderCell: () => ({
    //     style: { minWidth: 80 }
    //   }),
    //   onCell: () => ({
    //     style: {
    //       whiteSpace: 'nowrap',
    //       maxWidth: 80
    //     }
    //   }),
    //   render: (text, record, index) => {
    //     return <span>{(pageNum - 1) * pageSize + index + 1}</span>;
    //   }
    // },
    {
      title: '企业模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
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
      title: '模板描述',
      dataIndex: 'description',
      key: 'description',
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
      title: '模板状态',
      dataIndex: 'status',
      key: 'barCode',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return <span>{text ? '已启用' : '禁用'}</span>;
      }
    },
    {
      title: '操作',
      dataIndex: 'barCode',
      key: 'barCode',
      fix: 'right',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return (
          <div>
            <a
              onClick={() => {
                handleMember(record);
              }}
            >
              企业管理
            </a>
            <Divider type="vertical" />
            <a onClick={() => handleEdit(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除吗?" onConfirm={() => handleDeleteRecord(record)}>
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      }
    }
  ];
  useEffect(() => {
    getData(1, 10, {}, dataSource[0]);
  }, []);
  const getData = (pageNum, pageSize, search, record) => {
    const params = {
      currentPage: pageNum,
      pageSize,
      ...search
    };
    adminApi.templateList(params).then((res) => {
      if (res?.data?.data) {
        const data = res.data.data;
        setTotal(data.totalCount);
        setPageNum(pageNum);
        setDataSource(data.dataList);
        onRowClick(record || data.dataList[0]);
        if (data.dataList.length == 0 && pageNum != 1) {
          handleChangePage(pageNum - 1, pageSize);
        }
      }
    });
  };
  const handleGetSearchData = (data) => {
    setSearchData(data);
  };
  const handleChangePage = (e, size) => {
    setPageNum(e);
    setPageSize(size);
    getData(e, size, searchData);
  };
  const handleDeleteRecord = (record) => {
    adminApi.deleteTemplate({ id: record.id }).then((res) => {
      if (res?.data?.success) {
        message.success('删除成功');
        getData(pageNum, 10, searchData);
      } else {
        message.success(res.data.message);
      }
    });
  };
  const handleAddCancel = () => {
    setAddVisible(false);
    setModalType('');
  };
  const handleAdd = () => {
    setAddVisible(true);
    setModalType('add');
  };
  const handleEdit = (record) => {
    setUpdateData(record);
    setModalType('edit');
    setAddVisible(true);
  };
  const setRowClassName = (record) => {
    return record.id === rowId ? 'clickRowStyl' : '';
  };
  const onRowClick = (record) => {
    setRowId(record.id);
    setRowRecord(record);
    getTreeList(record);
  };
  const getTreeList = (record) => {
    const params = {
      companyTemplateId: record.id
    };
    adminApi.companyTemplateModuleTree(params).then((res) => {
      if (res?.data?.success) {
        const data = res.data.data;
        setTreeList(data.dataList);
        getSelectKeys(data.dataList);
      }
    });
  };
  const getSelectKeys = (data) => {
    let selkey = [];
    for (let item of data) {
      if (item.hasSelect) {
        selkey.push(item.id);
      }
      if (item.children && item.children.length > 0) {
        for (let index of item.children) {
          if (index.hasSelect) {
            selkey.push(index.id);
          }
        }
      }
    }
    setCheckedKeys(selkey);
  };
  const getTreeData = (data) => {
    return (
      data &&
      data.map((item) => {
        if (item.children) {
          return {
            title: item.title,
            key: item.id,
            pid: item.pid,
            value: item,
            children: getTreeData(item.children)
          };
        }
        return {
          title: item.title,
          key: item.id,
          pid: item.pid,
          value: item
        };
      })
    );
  };
  const onCheck = (checkedKey, e) => {
    setCheckedKeys(checkedKey);
  };
  const handleSave = () => {
    const moduleArr = [];
    checkedKeys.map((ele, index) => {
      moduleArr.push({ id: ele });
    });
    const params = {
      companyTemplateId: rowRecord.id,
      moduleIds: moduleArr
    };
    adminApi.addModule(params).then((res) => {
      if (res?.data?.success) {
        message.success('保存成功');
        getData(pageNum, 10, searchData, rowRecord);
      } else {
        message.success(res.data.message);
      }
    });
  };
  const handleMember = (data) => {
    setMemberVisible(true);
    setMemberData(data);
  };
  const handleMemberCancel = (data) => {
    setMemberVisible(false);
  };
  return (
    <div className="modalManage">
      <div style={{ width: '60%' }}>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: '20px' }}>
          新增企业模板
        </Button>
        <SearchForm getData={getData} pageNum={pageNum} getSearchData={handleGetSearchData} />
        <p>点击角色名选中企业类型，并在右侧分配菜单权限</p>
        <div>
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: true }}
            onRow={(record, index) => {
              return {
                onClick: () => onRowClick(record)
              };
            }}
            rowClassName={setRowClassName}
            pagination={false}
          />
          <Pagination
            total={total}
            style={{ marginTop: '10px', float: 'right', paddingBottom: '20px' }}
            showTotal={(total) => `共${total}条`}
            showSizeChanger
            pageSizeOptions={['10', '20', '50', '100']}
            onChange={(page, pageSize) => handleChangePage(page, pageSize)}
            onShowSizeChange={(page, pageSize) => handleChangePage(page, pageSize)}
            current={pageNum}
            pageSize={pageSize}
          />
        </div>
        <AddAndUpdate
          visible={addVisible}
          getData={getData}
          page={pageNum}
          searchData={searchData}
          onCancel={handleAddCancel}
          data={updateData}
          type={modalType}
        />
      </div>
      <div className="treeClass-border">
        <p>当前选中企业模板：{rowRecord.templateName}</p>
        <div className="treeClass">
          <div className="treeClass-title">菜单权限</div>
          <div className="treeClass-tree">
            {treeList.length > 0 ? (
              <Tree
                showLine
                showIcon
                checkable
                defaultExpandAll={true}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                treeData={getTreeData(treeList)}
              />
            ) : (
              ''
            )}
            <Button
              style={{ float: 'right', marginTop: '10px' }}
              onClick={handleSave}
              type="primary"
            >
              保存权限
            </Button>
          </div>
        </div>
      </div>
      <MemberManage
        visible={memberVisible}
        onCancel={handleMemberCancel}
        data={memberData}
        handleData={getData}
      />
    </div>
  );
};

export default ModuleManage;
