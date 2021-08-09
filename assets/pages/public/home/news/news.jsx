import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Row, Col, Card, Space, Divider, Button, message, Empty, Tabs, Pagination } from 'antd';
import {
  ArrowLeftOutlined,
  LeftCircleOutlined,
  DownloadOutlined,
  BellOutlined
} from '@ant-design/icons';
import creatHistory from 'history/createHashHistory';
const history = creatHistory();
import adminApi from 'api/admin';
import './news.less';

const { TabPane } = Tabs;

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NoticeList: [],
      readList: [],
      dataList: [],
      noReadList: [],
      noReadId: '',
      allNumber: 0,
      noReadNumber: 0,
      readNumber: 0,
      itemsIndex: 2,
      page: 1,
      pageSize: 10,
      total: 0
    };
  }
  componentDidMount() {
    this.homeNews();
  }
  read = () => {
    adminApi
      .recordReadAll({
        noReadId: this.state.noReadId
      })
      .then((res) => {
        const data = res.data;
        if (data.code == '0') {
          message.success(data.message);
          this.homeNews();
        } else {
          message.error(data.message);
        }
      });
  };
  //获取企业消息提醒
  homeNews = () => {
    const that = this;
    let data = {
      currentPage: this.state.page,
      pageSize: this.state.pageSize,
      companyId: sessionStorage.getItem('companyId'),
      //userId: sessionStorage.getItem('userId'),
      isRead: this.state.itemsIndex == 2 ? false : this.state.itemsIndex == 3 ? true : ''
    };
    adminApi.recordList(data).then((res) => {
      const data = res.data;
      if (data.code == '0') {
        if (data.data) {
          data.data.list =
            data.data.list.length > 0
              ? data.data.list.reduce(
                  (t, v) => [
                    ...t,
                    {
                      ...v,
                      title:
                        (v.type === 1
                          ? '违规消息：'
                          : v.type === 2
                          ? '入库通知：'
                          : v.type === 3
                          ? '出库通知：'
                          : v.type === 4
                          ? '退货通知：'
                          : '检验检疫证书超时未上传通知：') + v.title
                    }
                  ],
                  []
                )
              : [];
          this.setState({
            dataList: data.data.list,
            noReadId: data.data.noReadId,
            allNumber: data.data.allNumber,
            noReadNumber: data.data.noReadNumber,
            readNumber: data.data.readNumber,
            total:
              that.state.itemsIndex == 2
                ? data.data.noReadNumber
                : that.state.itemsIndex == 3
                ? data.data.readNumber
                : data.data.allNumber
          });
        }
      } else {
        message.error(data.message);
      }
    });
  };
  //页面数据显示数量的切换
  handleChangeTablePage = (page, pageSize) => {
    this.setState(
      {
        page,
        pageSize
      },
      () => {
        this.homeNews();
      }
    );
  };
  setTabs = (key) => {
    let that = this;
    that.setState(
      {
        itemsIndex: key
      },
      () => {
        that.homeNews();
      }
    );
  };
  //返回按钮
  toback = () => {
    history.goBack();
  };
  //跳转详情页
  toDetail = (item) => {
    let itemNew = {
      isnews: true
    };
    this.props.history.push({
      pathname: routerPrefix + '/public/home/detail',
      state: { ...item, ...itemNew }
    });
  };
  render() {
    const { total, page, pageSize, dataList, allNumber, noReadNumber, readNumber } = this.state;
    return (
      <div className="resourcesPage">
        <Row gutter={16} style={{ height: '100%' }}>
          <Col span={24}>
            <Card className="resourcesCard">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                <ArrowLeftOutlined
                  onClick={this.toback}
                  style={{ marginRight: 10, fontSize: 18 }}
                />
                <h2>消息提醒</h2>
              </div>
              <Divider className="line" />
              <Tabs tabPosition="left" defaultActiveKey="2" onChange={(key) => this.setTabs(key)}>
                <TabPane tab={'全部消息 ' + allNumber} key="1">
                  {dataList.length > 0 ? (
                    dataList.map((item, i) => {
                      return (
                        <div className="newstabs" key={i}>
                          <p onClick={() => this.toDetail(item, false)}>
                            <BellOutlined style={{ fontSize: '20px', color: '#999' }} />
                            <span className="newstabstitle">{item.title}</span>
                            <span style={{ float: 'right' }}>
                              {moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}
                            </span>
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <Empty />
                  )}
                </TabPane>
                <TabPane tab={'未读消息 ' + noReadNumber} key="2">
                  <p style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <Button type="primary" htmlType="submit" onClick={() => this.read()}>
                      全部标记为已读
                    </Button>
                  </p>
                  {dataList.length > 0 ? (
                    dataList.map((item, i) => {
                      return (
                        <div className="newstabs" key={i}>
                          <p onClick={() => this.toDetail(item, true)}>
                            <BellOutlined style={{ fontSize: '20px', color: '#999' }} />
                            <span className="newstabstitle">{item.title}</span>
                            <span style={{ float: 'right' }}>
                              {moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}
                            </span>
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <Empty />
                  )}
                </TabPane>
                <TabPane tab={'已读消息 ' + readNumber} key="3">
                  {dataList.length > 0 ? (
                    dataList.map((item, i) => {
                      return (
                        <div className="newstabs" key={i}>
                          <p onClick={() => this.toDetail(item, false)}>
                            <BellOutlined style={{ fontSize: '20px', color: '#999' }} />
                            <span className="newstabstitle">{item.title}</span>
                            <span style={{ float: 'right' }}>
                              {moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}
                            </span>
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <Empty />
                  )}
                </TabPane>
              </Tabs>
              <Pagination
                total={total}
                showTotal={(total) => `共${total}条`}
                showSizeChanger
                pageSizeOptions={['10', '20', '50', '100']}
                onChange={this.handleChangeTablePage}
                // onShowSizeChange={this.handleChangeTablePage}
                current={page}
                pageSize={pageSize}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default News;
