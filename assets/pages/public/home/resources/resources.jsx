import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Space, Divider, Collapse, message, Empty } from 'antd';
import { LeftOutlined, DownloadOutlined } from '@ant-design/icons';
import adminApi from 'api/admin';
import './resources.less';

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

class Resources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NoticeList: []
    };
  }
  componentDidMount() {
    this.homeNotice();
  }
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
        message.error(data.message);
      }
    });
  };
  //资源管理
  resources = (item) => {
    item.isNew = true;
    if (item.isPdf) {
      this.props.history.push({
        pathname: routerPrefix + '/public/home/detail',
        state: item
      });
    } else {
      message.warning('仅PDF文件支持预览，其他文件请直接下载。');
    }
  };
  //下载文件
  down = (codeId) => {
    adminApi
      .noticeFileList({
        entityId: codeId
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          adminApi
            .download({
              id: data.dataList.length > 0 && data.dataList[0].id
            })
            .then(() => {
              console.log('下载文件成功');
            });
        } else {
          message.error(res.data.message);
        }
      });
  };
  //返回按钮
  toback = () => {
    this.props.history.goBack();
  };
  render() {
    const { NoticeList } = this.state;
    return (
      <div className="resources bg_content">
        <Row gutter={16} className="resourcesPage">
          <Col span={24}>
            <Card className="resourcesCard">
              <div className="cardtitle goBack" onClick={this.toback}>
                <LeftOutlined style={{ marginRight: 10, fontSize: 18 }} />
                <h2>返回</h2>
              </div>
              <Divider className="line" />
              <div className="homecontent">
                {NoticeList.length > 0 ? (
                  NoticeList.map((item, i) => {
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
                        <DownloadOutlined
                          style={{ color: '#1890ff', float: 'right' }}
                          onClick={this.down.bind(this, item.id)}
                        />
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
      </div>
    );
  }
}

export default Resources;
