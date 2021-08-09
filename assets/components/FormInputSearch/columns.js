import React from 'react';
import moment from 'moment';
import { Tooltip, Badge } from 'antd';

export default (key, fuc, ModalTitle, resetPaging) => {
  switch (key) {
    case 'cicleProductName':
      return [
        {
          title: '物料名称',
          dataIndex: 'productName',
          key: 'productName',
          ellipsis: {
            showTitle: false
          },
          render: (text, record) => (
            <Tooltip placement="topLeft" title={text}>
              {text || record.name}
            </Tooltip>
          )
        },
        {
          title: '商品条码',
          dataIndex: 'barCode',
          key: 'barCode'
        },
        {
          title: '产地',
          dataIndex: 'address',
          key: 'address',
          ellipsis: {
            showTitle: false
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          )
        },
        {
          title: '规格单位',
          dataIndex: 'spec',
          key: 'spec',
          ellipsis: {
            showTitle: false
          },
          render: (text, record) => (
            <Tooltip placement="topLeft" title={text}>
              {`${text}${record.unit || ''}/${record.specUnit || ''}`}
            </Tooltip>
          )
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (_, record) => (
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fuc(record);
                resetPaging();
              }}
            >
              选择
            </a>
          )
        }
      ];
    case 'productName':
      return [
        {
          title: ModalTitle.substr(2, ModalTitle.length) + '名称',
          dataIndex: 'productName',
          key: 'productName',
          ellipsis: {
            showTitle: false
          },
          render: (text, record) => (
            <Tooltip placement="topLeft" title={text}>
              {text || record.name}
            </Tooltip>
          )
        },
        {
          title: '商品条码',
          dataIndex: 'barCode',
          key: 'barCode'
        },
        {
          title: '产地',
          dataIndex: 'address',
          key: 'address',
          ellipsis: {
            showTitle: false
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          )
        },
        {
          title: '规格单位',
          dataIndex: 'spec',
          key: 'spec',
          ellipsis: {
            showTitle: false
          },
          render: (text, record) => (
            <Tooltip placement="topLeft" title={text}>
              {`${text}${record.unit || ''}/${record.specUnit || ''}`}
            </Tooltip>
          )
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (_, record) => (
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fuc(record);
                resetPaging();
              }}
            >
              选择
            </a>
          )
        }
      ];
    case 'outCompanyName':
      return [
        {
          title: '企业名称',
          dataIndex: 'companyName',
          key: 'companyName',
          ellipsis: {
            showTitle: false
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          )
        },
        {
          title: '联系人',
          dataIndex: 'contactPerson',
          key: 'contactPerson',
          render: (text) => text || '-'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (_, record) => (
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fuc(record);
                resetPaging();
              }}
            >
              选择
            </a>
          )
        }
      ];
    case 'batchNumber':
      return [
        {
          title: '批次编号',
          dataIndex: 'batchNumber',
          key: 'batchNumber'
        },
        {
          title: '来源地',
          dataIndex: 'fromCompanyAddress',
          key: 'fromCompanyAddress',
          ellipsis: {
            showTitle: false
          },
          render: (text) => <Tooltip title={text}>{text || '-'}</Tooltip>
        },
        {
          title: '来源企业',
          dataIndex: 'fromCompanyName',
          key: 'fromCompanyName',
          ellipsis: {
            showTitle: false
          },
          render: (text) => <Tooltip title={text}>{text || '-'}</Tooltip>
        },
        {
          title: '是否过期',
          dataIndex: 'changeColor',
          key: 'changeColor',
          render: (text, record) => {
            if (record.changeColor == 'default')
              return (
                <Tooltip title={`过期时间:${moment(record.shelfDate).format('YYYY-MM-DD')}`}>
                  <div>
                    <Badge status="success"></Badge>
                    <span>正常</span>
                  </div>
                </Tooltip>
              );
            if (record.changeColor == 'orange')
              return (
                <Tooltip title={`过期时间:${moment(record.shelfDate).format('YYYY-MM-DD')}`}>
                  <div>
                    <Badge status="warning"></Badge>
                    <span>即将过期</span>
                  </div>
                </Tooltip>
              );
            if (record.changeColor == 'red')
              return (
                <Tooltip title={`过期时间:${moment(record.shelfDate).format('YYYY-MM-DD')}`}>
                  <div>
                    <Badge status="error"></Badge>
                    <span>已过期</span>
                  </div>
                </Tooltip>
              );
          }
        },
        {
          title: '库存数',
          dataIndex: 'stockNum',
          key: 'stockNum'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (_, record) => (
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fuc(record);
                resetPaging();
              }}
            >
              选择
            </a>
          )
        }
      ];
    case 'rawMaterial':
      return [
        {
          title: '原理名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '来源地',
          dataIndex: 'address',
          key: 'address',
          ellipsis: {
            showTitle: false
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text || '-'}
            </Tooltip>
          )
        },
        {
          title: '规格单位',
          dataIndex: 'spec',
          key: 'spec',
          ellipsis: {
            showTitle: false
          },
          render: (text, record) => (
            <Tooltip placement="topLeft" title={text}>
              {`${text + record.specUnit}/${record.uint || ''}`}
            </Tooltip>
          )
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (_, record) => (
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fuc(record);
                resetPaging();
              }}
            >
              选择
            </a>
          )
        }
      ];
    case 'saleName':
      return [
        {
          title: '企业名称',
          dataIndex: 'companyName',
          key: 'companyName',
          ellipsis: {
            showTitle: false
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          )
        },
        {
          title: '联系人',
          dataIndex: 'contactPerson',
          key: 'contactPerson',
          render: (text) => text || '-'
        },
        {
          title: '联系方式',
          dataIndex: 'contactPersonTel',
          key: 'contactPersonTel',
          render: (text) => text || '-'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (_, record) => (
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fuc(record);
                resetPaging();
              }}
            >
              选择
            </a>
          )
        }
      ];
  }
};

export const placeholders = (key) => {
  switch (key) {
    case 'cicleProductName':
      return '请输入物料名称';
    case 'productName':
      return '请输入产品名称';
    case 'outCompanyName':
      return '输入下游企业名称';
    case 'batchNumber':
      return '请输入批次号';
    case 'rawMaterial':
      return '请输入物料名称';
    case 'saleName':
      return '请输入企业名称';
    default:
      return undefined;
  }
};
