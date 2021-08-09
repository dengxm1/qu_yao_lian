import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Divider, message, Empty, Button, notification } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import routerPath from 'router/routerPath';
import NameLabel from 'components/NameLabel';
import flowImg from 'public/imgs/流程图.png';
import iconCompany from 'public/imgs/login/icon-company.png';
import NoticeModal from '../noticeModal';

import LoginApi from 'api/login.js';
import adminApi from 'api/admin';
import './index.less';
let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isshowResources: false,
      isshowProblem: false,
      NoticeList: [],
      ProblemList: [],
      newsList: [],
      applyList: '',
      noReadNumber: 0,
      newNotice: {}
    };
  }
  componentDidMount() {
    this.homeNotice();
    const pathname = window.location.href;
    const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
    const isScan = pathname.indexOf('gtin') || pathname.indexOf('/login');
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (this.state.applyList == '') {
      LoginApi.getApplyNum(companyInfo.companyId, userInfo.id).then((res) => {
        if (res?.data?.data) {
          this.setState({
            applyList: res.data.data.waitApplyNum
          });
        }
      });
    }
    LoginApi.load({ id: userInfo.noticeId }).then((res) => {
      if (res?.data?.success) {
        this.setState({
          newNotice: res.data.data
        });
      }
    });
  }
  //获取企业消息提醒

  //获取资源
  homeNotice = () => {
    adminApi.resources({}).then((res) => {
      const data = res.data;
      if (data.code == '0') {
        if (data.data && data.data.dataList.length > 0)
          this.setState({
            NoticeList: data.data.dataList
          });
      } else {
        message.warning(data.message);
      }
    });
  };
  //获取文件
  fetchFileList = (item) => {
    const { entityId } = item.id;
    adminApi
      .noticeFileList({
        entityId
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          this.setState({
            fileList: data.dataList
          });
        } else {
          message.error(res.data.message);
        }
      });
  };
  //资源管理
  resources = (item) => {
    item.isNew = true;
    // if (item.isPdf) {
    this.props.history.push({
      pathname: routerPrefix + '/public/home/detail',
      state: item
    });
    // } else {
    //   message.warning('仅PDF文件支持预览，其他文件请直接下载。');
    // }
  };
  //下载文件
  down = (item) => {
    adminApi
      .download({
        id: item.fileId
      })
      .then(() => {
        console.log('下载文件成功');
      });
  };
  // //打开消息
  news = (item) => {
    let that = this;
    const key = `open${Date.now()}`;
    const cloneNew = function(params) {
      close();
      notification.close(key);
    };
    const close = function() {};
    const btn = (
      <Button type="primary" size="small" onClick={() => cloneNew()}>
        我已知晓
      </Button>
    );
    notification.open({
      message: '',
      description: item.content,
      btn,
      key,
      onClose: close
    });
  };

  handleApply = () => {
    const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
    if (companyInfo.isAdmin === '1') {
      this.props.history.push(routerPath.app.apply);
    } else {
      message.warning('您没有查看该内容的权限');
    }
  };

  render() {
    const { NoticeList, ProblemList, noReadNumber } = this.state;
    const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    return (
      <div className="home">
        <Row className="homePage">
          <Col span={14}>
            <Card className="homeCard home-first">
              <div className="cardtitle">
                <h2>企业信息</h2>
              </div>
              <Divider className="line" />
              <div className="companyMessage">
                <img src={iconCompany} />
                <div className="companyMessage-content">
                  <div>
                    <span className="companyMessage-name">企业名称：</span>
                    <span className="companyMessage-value">
                      {companyInfo ? companyInfo.companyName : ''}
                    </span>
                  </div>
                  <div>
                    <span className="companyMessage-name">企业代码：</span>
                    <span className="companyMessage-value">
                      {companyInfo ? companyInfo.uniformCode : ''}
                    </span>
                  </div>
                </div>
              </div>
              <div className="waitCheck">
                <NameLabel name="待办事项" />
                <div className="waitCheck-item">
                  <div style={{ cursor: 'pointer' }} onClick={this.handleApply}>
                    <p className="waitCheck-item-num">
                      {this.state.applyList ? this.state.applyList : 0}
                    </p>
                    <p className="waitCheck-item-name">待我审批</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="homeCard">
              <div className="cardtitle">
                <h2>功能总览</h2>
              </div>
              <Divider className="line" />
              <img src={flowImg} style={{ width: '100%', marginBottom: '30px' }} />
            </Card>
          </Col>
          <Col span={9}>
            <Card className="homeCard resourceList">
              <div className="cardtitle">
                <h2>信息公告</h2>
                <Link to="/public/home/resources" className="seeMore">
                  <div>
                    更多
                    <DoubleRightOutlined />
                  </div>
                </Link>
              </div>
              <Divider className="line" />
              <div className="homecontent">
                {NoticeList.length > 0 ? (
                  NoticeList.slice(0, 6).map((item, i) => {
                    return (
                      <p key={i}>
                        <a
                          onClick={() => {
                            this.resources(item);
                          }}
                          className="title"
                        >
                          <span style={{ color: item.isPdf ? '#1890ff' : '#666666' }}>
                            {item.name}
                          </span>
                        </a>
                      </p>
                    );
                  })
                ) : (
                  <Empty />
                )}
              </div>
            </Card>
            <Card className="homeCard resourceList">
              <div className="cardtitle">
                <h2>企业消息</h2>
                <Link to="/public/home/resources" className="seeMore">
                  <div>
                    更多
                    <DoubleRightOutlined />
                  </div>
                </Link>
              </div>
              <Divider className="line" />
              <div className="homecontent">
                {NoticeList.length > 0 ? (
                  NoticeList.slice(0, 6).map((item, i) => {
                    return (
                      <p key={i}>
                        <a
                          onClick={() => {
                            this.resources(item);
                          }}
                          className="title"
                        >
                          <span style={{ color: item.isPdf ? '#1890ff' : '#666666' }}>
                            {item.name}
                          </span>
                        </a>
                      </p>
                    );
                  })
                ) : (
                  <Empty />
                )}
              </div>
            </Card>
            <Card className="homeCard resourceList">
              <div className="cardtitle">
                <h2>常见问题</h2>
                <Link to="/public/home/resources" className="seeMore">
                  <div>
                    更多
                    <DoubleRightOutlined />
                  </div>
                </Link>
              </div>
              <Divider className="line" />
              <div className="homecontent">
                {NoticeList.length > 0 ? (
                  NoticeList.slice(0, 6).map((item, i) => {
                    return (
                      <p key={i}>
                        <a
                          onClick={() => {
                            this.resources(item);
                          }}
                          className="title"
                        >
                          <span style={{ color: item.isPdf ? '#1890ff' : '#666666' }}>
                            {item.name}
                          </span>
                        </a>
                      </p>
                    );
                  })
                ) : (
                  <Empty />
                )}
              </div>
            </Card>
          </Col>
        </Row>
        {NoticeList.length > 0 ? (
          <NoticeModal visible={userInfo.noticeId} content={this.state.newNotice.content} />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default HomePage;
