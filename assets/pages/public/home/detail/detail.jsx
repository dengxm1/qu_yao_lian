import React from 'react';
import moment from 'moment';
import { Row, Col, Card, Space, Divider, Collapse, message } from 'antd';
import { LeftOutlined, BellOutlined } from '@ant-design/icons';
import adminApi from 'api/admin';
import './detail.less';

const baseURL =
  globalConfig && globalConfig.apiPrefix
    ? process.env.PLACE === 'wuhan'
      ? globalConfig.apiPrefix.ellApi
      : globalConfig.apiPrefix.default
    : '/api'; //请求前缀，根据实际情况修改

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      dataResult: this.props.location.state,
      name: '',
      entityId: '',
      format: '',
      fileList: '',
      createdTime: ''
    };
  }
  componentDidMount() {
    if (this.state.dataResult.isnews) {
      this.setState(
        {
          name: this.state.dataResult ? this.state.dataResult.title : '',
          content: this.state.dataResult ? this.state.dataResult.content : '',
          createdTime: this.state.dataResult ? this.state.dataResult.createdTime : ''
        },
        () => {
          if (!this.state.dataResult.isRead) {
            adminApi
              .recordRead({
                infoId: this.state.dataResult.infoId
              })
              .then((res) => {
                const data = res.data;
                if (data.code == '0') {
                  // message.success(data.message);
                } else {
                  message.error(data.message);
                }
              });
          }
        }
      );
    } else {
      this.setState(
        {
          name: this.state.dataResult ? this.state.dataResult.name : '',
          content: this.state.dataResult ? this.state.dataResult.content : '',
          entityId: this.state.dataResult ? this.state.dataResult.id : '',
          format: this.state.dataResult ? this.state.dataResult.format : '',
          fileList: []
        },
        () => {
          if (this.state.format === 1) {
            this.fetchFileList();
          }
        }
      );
    }
  }
  //获取文件
  fetchFileList = () => {
    let dataPar = {};
    if (this.state.dataResult.isNew) {
      dataPar.id = this.state.dataResult.id;
    } else {
      dataPar.id = this.state.entityId;
    }
    adminApi.noticeDetail(dataPar).then((res) => {
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
  //打开文件
  handlePreviewCerti = (ext, id) => {
    if (ext === 'jpg' || ext === 'png') {
      this.setState(
        {
          fileId: id,
          fileExt: ext
        },
        () => {
          this.showPicture();
        }
      );
    } else {
      window.open(`${baseURL}/source/resouce/download?id=${id}`);
    }
  };
  //返回按钮
  toback = () => {
    this.props.history.goBack();
  };
  render() {
    const { format, fileList, content, dataResult, createdTime, name } = this.state;
    return (
      <div className="detailPage bg_content">
        <Row gutter={16}>
          <Col span={24}>
            <Card className="deatilCard">
              <div className="cardtitle goBack" onClick={this.toback}>
                <LeftOutlined style={{ marginRight: 10, fontSize: 18 }} />
                <h2>返回</h2>
              </div>
              <Divider className="line" />
              {this.state.dataResult.isnews ? (
                <div className="newstabs">
                  <p>
                    <BellOutlined style={{ fontSize: '20px', color: '#999' }} />
                    <span className="newstabstitle">{name}</span>
                    <span style={{ float: 'right' }}>
                      {moment(createdTime).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </p>
                  <p style={{ paddingLeft: '30px' }}>{content}</p>
                </div>
              ) : (
                <div>
                  <h3 style={{ marginBottom: 10, textAlign: 'center' }}>{name}</h3>
                  <div style={{ display: 'flex', marginBottom: '15px' }}>
                    <span>内容:&nbsp;&nbsp;</span>
                    <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
                  </div>
                  <span>文件:&nbsp;&nbsp;</span>
                  {format === 1
                    ? dataResult.files.map((ele, index) => {
                        return (
                          <p key={ele.fileId} style={{ marginLeft: '20px' }}>
                            <span>{ele.fileName}</span>
                            <a onClick={this.handlePreviewCerti.bind(this, ele.ext, ele.fileId)}>
                              【下载】
                            </a>
                          </p>
                        );
                      })
                    : ''}
                  {format === 2 && content ? <div>{content}</div> : ''}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Detail;
