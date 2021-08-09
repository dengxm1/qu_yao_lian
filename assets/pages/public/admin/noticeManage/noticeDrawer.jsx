import React from 'react';
import { Drawer, Button, Row, Col, Form, Divider, Modal, message, Space } from 'antd';
import adminApi from 'api/admin';

const baseURL =
  globalConfig && globalConfig.apiPrefix
    ? process.env.PLACE === 'wuhan'
      ? globalConfig.apiPrefix.ellApi
      : globalConfig.apiPrefix.default
    : '/api'; //请求前缀，根据实际情况修改

const layout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 19
  }
};

const rowLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 14
  }
};

class NoticeDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imgVisible: false,
      data: null,
      sourceType: '',
      entityId: '',
      fileList: [],
      fileExt: ''
    };
  }

  componentDidMount() {
    // this.fetchFileList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState(
        {
          entityId: nextProps.noticeRecord.id
        },
        () => {
          this.fetchFileList();
        }
      );
    }
  }

  fetchFileList = () => {
    const { entityId } = this.state;
    adminApi
      .noticeFileList({
        entityId
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          this.setState({
            fileList: data,
            fileName: data[0] && data[0].fileName,
            fileUrl: data[0] && data[0].url
          });
        } else {
          message.error(res.data.message);
        }
      });
  };

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

  showPicture = () => {
    this.setState({
      imgVisible: true
    });
  };

  handleCloseModal = () => {
    this.setState({
      imgVisible: false
    });
  };

  onClose = () => {
    this.props.onClose();
  };

  render() {
    const { fileList } = this.state;
    const { visible, noticeRecord } = this.props;

    return (
      <Drawer
        title="信息资源详情"
        width={800}
        onClose={this.onClose}
        visible={visible}
        maskClosable={false}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right'
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              关闭
            </Button>
          </div>
        }
      >
        <Form>
          <Row>
            <Col span={24}>
              <Form.Item {...layout} label="信息资源名称" name="name">
                <span>{noticeRecord && noticeRecord.name}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...layout} label="类型" name="type">
                <span>
                  {noticeRecord && noticeRecord.resourceType === 1
                    ? '通知公告'
                    : noticeRecord && noticeRecord.resourceType === 2
                    ? '信息公告'
                    : '常见问题'}
                </span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...layout} label="格式" name="format">
                <span>
                  {noticeRecord && noticeRecord.format === 1
                    ? '文件'
                    : noticeRecord && noticeRecord.format === 2
                    ? '文本'
                    : '富文本'}
                </span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...layout} label="发布平台" name="platform">
                <span>{noticeRecord && noticeRecord.platform === 0 ? '小程序' : 'PC端'}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...layout} label="排序" name="sequence">
                <span>{noticeRecord && noticeRecord.sequence}</span>
              </Form.Item>
            </Col>
          </Row>
          {noticeRecord && noticeRecord.format === 1 ? (
            <Row>
              <Col span={24}>
                <Form.Item {...layout} label="文件">
                  {!fileList || fileList.length === 0 ? (
                    <span>暂无数据</span>
                  ) : (
                    fileList &&
                    fileList.map((item, i) => {
                      return (
                        <Space key={i}>
                          <span>{item.fileName}</span>
                          <a onClick={this.handlePreviewCerti.bind(this, item.ext, item.id)}>
                            【下载】
                          </a>
                        </Space>
                      );
                    })
                  )}
                </Form.Item>
              </Col>
            </Row>
          ) : noticeRecord && noticeRecord.format === 2 ? (
            <Row>
              <Col span={24}>
                <Form.Item {...layout} label="内容" name="content">
                  <span>{noticeRecord && noticeRecord.content}</span>
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={24}>
                <Form.Item {...layout} label="内容" name="content">
                  <div
                    dangerouslySetInnerHTML={{ __html: noticeRecord && noticeRecord.content }}
                  ></div>
                </Form.Item>
              </Col>
            </Row>
          )}
          <Form.Item {...layout} label="内容" name="content">
            <div dangerouslySetInnerHTML={{ __html: noticeRecord && noticeRecord.content }}></div>
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
}

export default NoticeDrawer;
