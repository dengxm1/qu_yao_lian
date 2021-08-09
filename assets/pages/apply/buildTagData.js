import React from 'react';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import moment from 'moment';
import JSEncrypt from 'utils/jsEncrypt.js';
import utils from 'utils/index';

export const buildTabsArr = [
  { key: '0', label: '全部代办' },
  { key: '1', label: '人员审核' },
  { key: '2', label: '企业申请' }
];

export const columns = (onAction) => {
  let arr = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '申请人',
      dataIndex: 'sponsor',
      key: 'sponsor'
    },
    {
      title: '联系电话',
      dataIndex: 'sponsorTel',
      key: 'sponsorTel',
      render: (text, record) => {
        const str = JSEncrypt(text);
        return <span>{(str && utils.noPassByMobile(str)) || ''}</span>;
      }
    },
    {
      title: '申请时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text, record) => {
        return <span>{moment(text).format('YYYY-MM-DD')}</span>;
      }
    },
    {
      title: '代办类型',
      dataIndex: 'approveType',
      key: 'approveType',
      render: (text) => {
        return <span>{['人员审核', '企业申请'][+text - 1]}</span>;
      }
    },
    {
      title: '代办状态',
      dataIndex: 'approveStatus',
      key: 'approveStatus'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        const isFinish = ['已完成', '已取消'].includes(record.approveStatus);
        return (
          <a onClick={() => onAction(isFinish ? 'finish' : 'dosth', record)}>
            {isFinish ? '查看详情' : '审批代办'}
          </a>
        );
      }
    }
  ];

  arr = arr.map((item) => {
    if (!item.render) {
      item.render = (text) => text || '-';
    }
    return item;
  });

  return arr;
};

export const dataSource = [];

Array(50)
  .fill(1)
  .forEach(() => {
    dataSource.push({
      title: '这是一个标题',
      sponsor: '张三',
      sponsorTel: '13409824321',
      startTime: '2021-04-12',
      approveType: Math.floor(Math.random() * 2) + 1,
      approveStatus: ['待处理', '已完成'][Math.floor(Math.random() * 2)]
    });
  });

export const actionBtns = (popType, personType, handleFooterBtnClick) => {
  let obj = {
    dosth: [
      {
        tagType: 'Button',
        tagText: personType === 1 ? '同意' : '通过',
        tagProps: {
          type: 'primary',
          onClick: () => handleFooterBtnClick('submit')
        }
      },
      {
        tagType: 'Button',
        tagText: '拒绝',
        tagProps: {
          type: 'default',
          onClick: () => handleFooterBtnClick('cancel')
        }
      }
    ],
    finish: [
      {
        tagType: 'Button',
        tagText: '关闭',
        tagProps: {
          type: 'default',
          onClick: () => handleFooterBtnClick('cancel')
        }
      }
    ]
  };
  return obj[popType];
};

export const operations = (
  <Button
    type="primary"
    icon={<HomeOutlined />}
    onClick={() => {
      window.location.href = '/public';
    }}
  >
    返回首页
  </Button>
);
