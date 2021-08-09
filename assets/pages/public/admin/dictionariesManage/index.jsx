import React from 'react';
import {
  Button,
  Input,
  Table,
  Divider,
  Modal,
  Form,
  Select,
  Popconfirm,
  InputNumber,
  Tooltip
} from 'antd';
import EllipsisTooltip from 'components/EllipsisTooltip';
import './index.less';
import adminApi from 'api/admin';
import moment from 'moment';

export default () => {
  const [form] = Form.useForm();
  const [search, setSearch] = React.useState({});
  const [data, setData] = React.useState({ dataList: [], total: 0 });
  const [state, setState] = React.useState({
    visible: false,
    modalTitle: '',
    resData: Date.parse(new Date()),
    initialValues: {},
    kids: {}
  });

  const columns = [
    {
      title: '字典编号',
      dataIndex: 'id',
      key: 'name',
      render: (text) => (
        <Tooltip title={text}>
          <span>{text.length > 6 ? text.substring(0, 6) + '...' : text}</span>
        </Tooltip>
      )
    },
    {
      title: '字典名称',
      dataIndex: 'name'
    },
    !state.kids.id
      ? {
          title: '字典类型',
          dataIndex: 'type'
        }
      : null,
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        if (text == 1) {
          return <span>正常</span>;
        } else {
          return <span>停用</span>;
        }
      }
    },
    state.kids.id
      ? {
          title: '字典键值',
          dataIndex: 'value',
          onCell: () => ({
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 400
            }
          }),
          render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
        }
      : null,
    state.kids.id
      ? {
          title: '排序',
          dataIndex: 'sequence'
        }
      : null,
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <div>
          <a
            onClick={() => {
              record.status = record.status + '';
              const arr = [];
              for (let key in record) {
                arr.push({
                  name: key,
                  value: record[key]
                });
              }
              form.setFields(arr);
              setState({
                ...state,
                visible: true,
                modalTitle: `修改${record.name}`,
                initialValues: record
              });
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          {!state.kids.id && (
            <>
              <a
                onClick={() => {
                  setState({
                    ...state,
                    kids: record,
                    pageCopy: page
                  });
                  setSearch({});
                  setPage((page) => ({
                    pagination: {
                      ...page.pagination,
                      current: 1,
                      total: 0
                    },
                    fetchData: {
                      pageSize: 10,
                      pageNum: 1
                    }
                  }));
                }}
              >
                详情
              </a>
              <Divider type="vertical" />
            </>
          )}
          <Popconfirm
            title={`确定删除${record.name}吗?`}
            onConfirm={() => {
              if (state.kids.id) {
                return adminApi.deleteDictManListKids({ id: record.id }).then((data) => {
                  if (data.data.success) {
                    setState({ ...state, resData: Date.parse(new Date()) });
                  }
                });
              }
              return adminApi.deleteDictManList({ id: record.id }).then((data) => {
                if (data.data.success) {
                  setState({ ...state, resData: Date.parse(new Date()) });
                }
              });
            }}
            okText="是"
            cancelText="否"
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      )
    }
  ];

  //设置分页
  const [page, setPage] = React.useState({
    pagination: {
      // hideOnSinglePage: true,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '80', '100'],
      showTotal: (total) => `共 ${total} 条`,
      current: 1
    },
    fetchData: {
      pageSize: 10,
      pageNum: 1
    }
  });

  //监听表格变化
  const handleTableChange = (pagination, filters, sorter) => {
    const pager = page;
    pager.current = pagination.current;
    setPage({
      pagination: pager,
      fetchData: {
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      }
    });
  };

  //发起请求
  React.useEffect(() => {
    let desc = false;
    // 获取字典列表
    if (state.kids.id) {
      (async () => {
        const {
          data: { data, success }
        } = await adminApi.dictManListKid({ ...page.fetchData, ...search, typeId: state.kids.id });
        if (!desc && success) {
          setData({ dataList: data.dataList, total: data.totalCount });
        }
      })();
    } else {
      (async () => {
        const {
          data: { data, success }
        } = await adminApi.dictManList({ ...page.fetchData, ...search });
        if (!desc && success) {
          setData({ dataList: data.dataList, total: data.totalCount });
        }
      })();
    }
    //组件卸载执行
    return () => {
      desc = true;
    };
  }, [page, search, state.resData, state.kids]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  };

  const FormRender = () => {
    return (
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={(values) => {
          //子元素
          if (state.kids.id) {
            if (state.modalTitle.indexOf('修改') !== -1 && state.initialValues.id) {
              //修改(二)
              return adminApi
                .editDictManListKids({ id: state.initialValues.id, ...values })
                .then((data) => {
                  if (data.data.success) {
                    setState({ ...state, visible: false, resData: Date.parse(new Date()) });
                  }
                });
            }
            //添加(二)
            return adminApi.addDictManListKid({ ...values, typeId: state.kids.id }).then((data) => {
              if (data.data.success) {
                setState({ ...state, visible: false, resData: Date.parse(new Date()) });
              }
            });
          }
          //一级字典
          if (state.modalTitle.indexOf('新增') == -1 && state.initialValues.id) {
            //修改(-)
            return adminApi
              .editDictManList({ id: state.initialValues.id, ...values })
              .then((data) => {
                if (data.data.success) {
                  setState({ ...state, visible: false, resData: Date.parse(new Date()) });
                }
              });
          }
          //添加(-)
          return adminApi.addDictManList(values).then((data) => {
            if (data.data.success) {
              setState({ ...state, visible: false });
              setSearch({});
              setPage((page) => ({
                pagination: {
                  ...page.pagination,
                  current: 1,
                  total: 0
                },
                fetchData: {
                  pageSize: 10,
                  pageNum: 1
                }
              }));
            }
          });
        }}
      >
        <Form.Item name="name" label="字典名称" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        {!state.kids.id && (
          <Form.Item name="type" label="字典类型" rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </Form.Item>
        )}
        {state.kids.id && (
          <>
            <Form.Item name="value" label="字典键值" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="sequence" label="排序" rules={[{ required: true }]}>
              <InputNumber placeholder="请输入" />
            </Form.Item>
          </>
        )}
        <Form.Item name="status" label="状态" rules={[{ required: true }]}>
          <Select placeholder="请输入">
            <Select.Option value="1">正常</Select.Option>
            <Select.Option value="2">停用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="remark" label="备注" rules={[{ required: false }]}>
          <Input.TextArea placeholder="请输入" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className="dictMan-pages">
      <h2>{state.kids.id ? `${state.kids.name}字典详情` : '字典管理'}</h2>
      <div className="search-box">
        <div>
          {state.kids.id && (
            <a
              style={{ marginRight: 12 }}
              onClick={() => {
                setPage(state.pageCopy);
                setSearch({});
                setState({ ...state, kids: {} });
              }}
            >
              {`< 返回`}
            </a>
          )}
          <Button
            onClick={() => {
              form.resetFields();
              setState({ ...state, visible: true, modalTitle: '新增字典' });
            }}
            type="primary"
          >
            {state.kids.id ? `+ 在${state.kids.name}下添加` : '新增字典'}
          </Button>
        </div>
        <div className="search-input">
          <Input
            placeholder="请输入字典名称"
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          {!state.kids.id && (
            <Input
              placeholder="请输入字典类型"
              onChange={(e) => setSearch({ ...search, type: e.target.value })}
            />
          )}
          <Button style={{ marginLeft: 12, marginRight: 20 }} type="primary">
            查询
          </Button>
        </div>
      </div>
      <Table
        columns={columns.reduce((t, i) => (i ? [i, ...t] : t), []).reverse()}
        dataSource={data.dataList}
        rowKey="id"
        pagination={{ ...page.pagination, total: data.total }}
        onChange={handleTableChange}
      />
      <Modal
        title={state.modalTitle}
        destroyOnClose
        maskClosable={false}
        visible={state.visible}
        onOk={() => form.submit()}
        onCancel={() => setState({ ...state, visible: false, initialValues: {} })}
      >
        <div style={{ marginLeft: -80, marginRight: 20 }}>{FormRender()}</div>
      </Modal>
    </div>
  );
};
