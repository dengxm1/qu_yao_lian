import React from 'react';
import { Button, Modal } from 'antd';
import codeManageApi from 'api/codeManage';

class CodeImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgList: []
    };
  }
  componentDidMount = () => {
    const { record } = this.props;
    console.log('record--', record);
    let imgList = [];
    if (record) {
      codeManageApi
        .createQrCode({ barCode: record.combinationBarCode, batchNumber: record.batchNumber })
        .then((res) => {
          imgList.push(res);
          this.setState({
            imgList: imgList
          });
        });
    }
  };

  handleCancel = () => {
    this.props.onClose();
  };
  render() {
    const { visible } = this.props;
    const { imgList } = this.state;
    return (
      <Modal
        visible={visible}
        title="查看溯源码"
        onCancel={this.handleCancel}
        footer={
          <div>
            <Button onClick={this.handleCancel}>确认</Button>
          </div>
        }
      >
        {imgList &&
          imgList.map((item, i) => {
            return (
              <div key={i}>
                <p id={'img_' + i} style={{ textAlign: 'center' }}>
                  <img key={i} src={item.config.url} style={{ width: '300px', margin: '0 auto' }} />
                </p>
              </div>
            );
          })}
      </Modal>
    );
  }
}

export default CodeImage;
