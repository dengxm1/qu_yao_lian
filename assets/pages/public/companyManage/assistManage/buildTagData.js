import React, { Fragment } from 'react';
import { Tag, Space, Divider, Popconfirm } from 'antd';

export const buildTabsArr = [
  { key: '1', label: '下游经销商' },
  { key: '2', label: '上游供应商' }
];

export const columns = (type = '1', onActions) => {
  let arr = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
      isSearch: true
    },
    // {
    //   title: '统一社会信用代码',
    //   dataIndex: 'uniformCode',
    //   key: 'uniformCode',
    //   isSearch: true
    // },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      isSearch: true
    },
    {
      title: '联系方式',
      dataIndex: 'contactPersonTel',
      key: 'contactPersonTel',
      isSearch: true
    },
    {
      title: '登记时间',
      dataIndex: 'trustTime',
      key: 'trustTime'
    },
    {
      title: '状态',
      dataIndex: 'approveStatus',
      key: 'approveStatus',
      render: (text) => {
        if (text !== undefined) {
          const temp = [
            ['通过', 'success'],
            ['待通过', 'warning'],
            ['已拒绝', 'error']
          ][text - 1];
          return <Tag color={temp[1]}>{temp[0]}</Tag>;
        }
        return null;
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space>
            {record.approveStatus === '3' && type === '1' && (
              <Fragment>
                <a onClick={() => onActions('again', record)}>重新申请</a>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Popconfirm title="确定要删除这条记录吗？" onConfirm={() => onActions('del', record)}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  if (type === '2') {
    arr = arr.filter((col) => !['approveStatus'].includes(col.key));
  }

  arr = arr.map((item) => {
    if (!item.render) {
      item.render = (text) => text || '-';
    }
    return item;
  });

  return arr;
};

export const buildHeaderSearchArr = columns()
  .filter((item) => item.isSearch)
  .map((item) => ({
    tagType: 'Input',
    tagProps: {
      placeholder: item.title,
      allowClear: true
    },
    props: {
      name: item.key
    }
  }));

export const modalColums = columns().filter((item) => item.isSearch);
// export let dataSource = [];
// for (let index = 0; index < 50; index++) {
//   dataSource.push({
//     companyName: Math.random()
//       .toString(32)
//       .substr(2),
//     uniformCode: '13251315123123',
//     uniformName: '张三',
//     legalPhone: '13409824151',
//     registeDate: '2021022312',
//     state: Math.floor(Math.random() * 3) + 1
//   });
// }
