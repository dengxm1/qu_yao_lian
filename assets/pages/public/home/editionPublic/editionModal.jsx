import React from 'react';
import { Button, Modal, Input, message, Select } from 'antd';
import 'braft-editor/dist/index.css';
import adminApi from 'api/admin';
import './editionPublic.less';

class EditionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    const { detailedRecord } = this.props;
    if (detailedRecord && detailedRecord.id) {
      this.getRead(detailedRecord.id);
    }
  };
  //获取详情数据
  getLoad = (id) => {
    adminApi.imprintLoad({ id }).then((res) => {
      const { data } = res.data;
      if (res.data.code === '0' && data) {
        this.setState({
          dataSource: data.dataList
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  //修改为已读状态
  getRead = (imprintId) => {
    adminApi.imprintRead({ imprintId }).then((res) => {});
  };
  handleCancel = () => {
    this.props.onClose();
  };
  render() {
    const { visible, detailedRecord } = this.props;
    return (
      <Modal
        title="版本发布说明"
        visible={visible}
        width={800}
        maskClosable={false}
        bodyStyle={{ paddingBottom: 80 }}
        onCancel={this.handleCancel}
        footer={
          <div>
            <Button onClick={this.handleCancel} style={{ marginRight: 8 }}>
              关闭
            </Button>
          </div>
        }
      >
        <div className="editionModal">
          <h2>版本编号:{detailedRecord && detailedRecord.version}</h2>
          <h3>
            <p className="title">版本简介:</p>
            <p className="content">{detailedRecord && detailedRecord.introduction}</p>
          </h3>
          <h4>
            <p className="title">版本内容:</p>
            <p
              className="content"
              style={{ border: '1px solid #f5f5f5', minHeight: '200px' }}
              dangerouslySetInnerHTML={{ __html: detailedRecord && detailedRecord.content }}
            ></p>
          </h4>
        </div>
      </Modal>
    );
  }
}

export default EditionModal;
