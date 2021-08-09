import React, { useEffect, useState } from 'react';
import { Table, Divider, Button, Popover, Form, Col, Row, message, Tabs, Steps, Modal } from 'antd';
import moment from 'moment';
import loginApi from 'api/login.js';
import SignatureApi from 'api/signature.js';
import Header from 'components/Header';
import downLoad from 'utils/download.js';

const { Step } = Steps;

import './index.less';
const TabPane = Tabs.TabPane;
const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);
const Apply = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const [tabValue, setTabValue] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [signaDataSource, setSignaDataSource] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState({});
  const { companyId } = companyInfo;
  const signaColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        if (record.type == '1') {
          return (
            <div>
              {record.productName}
              {record.inorderid}
            </div>
          );
        } else if (record.type == 2) {
          return (
            <div>
              {record.productName}申请签章进度
              {/* {record.ourtorderid} */}
            </div>
          );
        }
      }
    },
    {
      title: '申请人',
      dataIndex: 'userName',
      key: 'userName',
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
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile',
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
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return <span>{moment(text).format('YYYY-MM-DD')}</span>;
      }
    },
    {
      title: '代办类型',
      dataIndex: 'type',
      key: 'type',
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
            <span>{text == 0 ? '食品销售凭证' : '检验报告'}</span>
          </div>
        );
      }
    },
    {
      title: '代办状态',
      dataIndex: 'status',
      key: 'status',
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
            <span>{text == 0 ? '申请' : '通过'}</span>
          </div>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return <a onClick={() => handleDetail(record)}>查看详情</a>;
      }
    }
  ];
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return <div>{`${record.userName || record.mobile}申请加入${record.companyName}`}</div>;
      }
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile',
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
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      render: (text, record) => {
        return <span>{moment(text).format('YYYY-MM-DD')}</span>;
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
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
            {record.status == 1 ? (
              <div>
                <a onClick={() => handleAgree(record)}>同意</a>
                <Divider type="vertical" />
                <a onClick={() => handleDisagree(record)}>拒绝</a>
                <Divider type="vertical" />
                <a onClick={() => handleManager(record)}>设置管理员</a>
              </div>
            ) : record.status == 2 ? (
              <div>
                <span>已同意</span>
                <Divider type="vertical" />
                <a onClick={() => handleManager(record)}>设置管理员</a>
              </div>
            ) : record.status == 3 ? (
              <div>
                <span>已同意</span>
                <Divider type="vertical" />
                <span>已设为管理员</span>
              </div>
            ) : record.status == 4 ? (
              <div>
                <span>已拒绝</span>
              </div>
            ) : (
              ''
            )}
          </div>
        );
      }
    }
  ];

  const getData = () => {
    loginApi.getApplyList(companyId, userInfo.id).then((res) => {
      if (res?.data?.data) {
        setDataSource(res.data.data.dataList);
      }
    });
  };
  const getSignatureData = (page) => {
    const params = {
      currentPage: page,
      pageSize: 10
    };
    SignatureApi.signaturePage(params).then((res) => {
      setSignaDataSource(res.data.data.dataList);
    });
  };
  useEffect(() => {
    getData();
    getSignatureData(1);
  }, []);
  //   同意
  const handleAgree = (record) => {
    const params = {
      ...record,
      status: 2
    };
    loginApi.agree({ ...params }).then((res) => {
      if (res?.data?.success) {
        message.success('同意成功');
        getData();
      } else {
        message.error('操作失败');
      }
    });
  };
  //   拒绝
  const handleDisagree = (record) => {
    const params = {
      ...record,
      status: 4
    };
    loginApi.disAgree({ ...params }).then((res) => {
      if (res?.data?.data) {
        message.success('已拒绝');
        getData();
      } else {
        message.error('操作失败');
      }
    });
  };
  //   设置管理员
  const handleManager = (record) => {
    const params = {
      ...record,
      status: 3
    };
    loginApi.setAdmin({ ...params }).then((res) => {
      if (res?.data?.success) {
        message.success('已设置');
        getData();
      } else {
        message.error('操作失败');
      }
    });
  };
  const handleBack = () => {
    window.location.href = '/public';
  };
  const handleChangeTab = (e) => {
    setTabValue(e);
  };
  const handleDetail = (record) => {
    setDetailVisible(true);
    const params = {
      signature: record.id
    };
    SignatureApi.getSignatureByid(params).then((res) => {
      if (res?.data?.success) {
        setDetailData(res.data.data);
      }
    });
  };
  const handleCreateSignal = () => {
    SignatureApi.inspectionReportUpdate({ signature: detailData.data.id }).then((res) => {
      if (res?.data?.success) {
        handleCancelSignal();
        message.success('审批成功');
      } else {
        message.error(res.data.msg || res.data.message);
      }
    });
  };
  const handleCancelSignal = () => {
    setDetailVisible(false);
  };
  const handleDownload = () => {
    SignatureApi.download({ id: detailData.resourceId, type: '3' }).then((res) => {
      if (res) {
        downLoad(res, '检验报告.pdf');
      }
    });
  };
  return (
    <div>
      <Header />
      <a
        style={{ marginLeft: '20px' }}
        className="apply-page-back"
        onClick={handleBack}
      >{`< 返回`}</a>

      <div className="apply-page">
        {/* <Tabs activeKey={tabValue} onChange={handleChangeTab}>
          <TabPane tab={'人员审核'} key={'1'}> */}
        <Table style={{ marginTop: '20px' }} columns={columns} dataSource={dataSource} />
        {/* </TabPane> */}
        {/* <TabPane tab={'签章授权'} key={'2'}>
            <Table
              style={{ marginTop: '20px' }}
              columns={signaColumns}
              dataSource={signaDataSource}
            />
          </TabPane>
        </Tabs> */}
      </div>
      <Modal
        title="签章授权"
        visible={detailVisible}
        width={650}
        onCancel={handleCancelSignal}
        footer={
          <div>
            {/* <Button onClick={handleCreateSignal} type="primary">
              检验人盖章
            </Button> */}
            <Button onClick={handleCancelSignal}>确认</Button>
          </div>
        }
      >
        <Form>
          <Row gutter={24}>
            <Col span={11}>
              <Form.Item label="标题">{detailData?.data?.userName}申请签章</Form.Item>
              <Form.Item label="申请人">{detailData?.data?.userName}</Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="申请时间">
                {moment(detailData?.data?.createdTime).format('yyyy-MM-DD')}
              </Form.Item>
              <Form.Item label="联系电话">{detailData?.data?.mobile}</Form.Item>
            </Col>
          </Row>
        </Form>
        <Steps
          current={detailData?.nodelist}
          progressDot={customDot}
          style={{ marginBottom: '30px' }}
        >
          <Step title="提交申请" />
          <Step title="申请检验人签章" />
          <Step title="申请签发人签章" />
          <Step title="申请公章" />
          <Step title="完成" />
        </Steps>
        <a onClick={handleDownload}>查看检验报告</a>
      </Modal>
    </div>
  );
};
export default Apply;
