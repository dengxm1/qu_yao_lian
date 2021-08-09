import React from 'react';
import {
  Drawer,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Radio,
  Upload,
  message,
  Select
} from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import adminApi from 'api/admin';
import './index.less';

const { Option } = Select;

const { TextArea } = Input;
const layout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};
class EditionDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceType: null,
      isshowmodules: false,
      editorState: BraftEditor.createEditorState(null),
      richtext: '', //存放富文本字段，
      modulesList: [],
      platform: 0,
      moduleid: '',
      dataSource: null
    };
    this.formRef = React.createRef();
  }
  componentDidMount = () => {
    const { detailedRecord } = this.props;
    if (detailedRecord && detailedRecord.id) {
      //this.getLoad(detailedRecord.id);
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
  handleOk = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        let formData = new FormData();
        for (let key in values) {
          if (values[key]) {
            if (
              key === 'content' &&
              Object.prototype.toString.call(values[key]) == '[object Object]'
            ) {
              formData.append(key, values[key].toHTML());
            } else {
              formData.append(key, values[key]);
            }
          }
        }
        console.log('formData', formData);
        adminApi.imprintInsert(formData).then((res) => {
          console.log(res);
          if (res.data.code == '0') {
            message.success('新增成功');
            this.formRef.current.resetFields();
            this.props.onClose(true);
          } else {
            message.error(res.data.message);
          }
        });
      })
      .catch((errorInfo) => {});
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.onClose();
  };
  //获取富文本框的内容
  handleChange = (editorState) => {
    const htmlString = editorState.toHTML();
    this.setState({
      editorState: editorState,
      richtext: htmlString
    });
  };
  //发布平台选择
  handleChangePlatform = (e) => {
    // this.formRef.current && this.formRef.current.setFieldsValue({ version: null }); //版本编号
    // this.formRef.current && this.formRef.current.setFieldsValue({ introduction: null }); //版本简介
    // this.formRef.current && this.formRef.current.setFieldsValue({ content: null }); //文本 富文本内容
  };
  //上传富文本图片
  beforeUploadControls = (file) => {
    let _this = this;
    console.log('file', file);
    const index = file.name.lastIndexOf('.');
    const isType = file.name.substr(index + 1).toLowerCase();
    if (isType !== 'jpg' && isType !== 'png') {
      message.error('只支持上传jpg和png格式的图片');
      return true;
    } else {
      if (file.size / (1024 * 1024) > 10 || !file.size) {
        message.error('上传文件不能为空或超过10M');
      } else {
        let formData = new FormData();
        formData.append('file', file);
        adminApi.resouceUpload(formData).then((res) => {
          console.log(res);
          if (res.data.code == '0') {
            console.log(this.formRef.current.getFieldValue('content'));
            console.log(ContentUtils);
            if (this.formRef.current.getFieldValue('content')) {
              this.formRef.current.setFieldsValue({
                content: ContentUtils.insertMedias(this.formRef.current.getFieldValue('content'), [
                  {
                    type: 'IMAGE',
                    url: `/api/source/resouce/download?id=${res.data.data.id}`
                  }
                ])
              });
            } else {
              this.formRef.current.setFieldsValue({
                content: ContentUtils.insertMedias(BraftEditor.createEditorState(null), [
                  {
                    type: 'IMAGE',
                    url: `/api/source/resouce/download?id=${res.data.data.id}`
                  }
                ])
              });
            }
          } else {
            message.error(res.data.message);
          }
        });
      }
    }
  };

  render() {
    const controls = [
      'undo',
      'redo',
      'separator',
      'font-size',
      'line-height',
      'letter-spacing',
      'separator',
      'text-color',
      'bold',
      'italic',
      'underline',
      'strike-through',
      'separator',
      'remove-styles',
      'emoji',
      'separator',
      'text-indent',
      'text-align',
      'separator',
      'headings',
      'list-ul',
      'list-ol',
      'separator',
      'link',
      'separator',
      'hr',
      'separator',
      //'media',
      'separator'
    ];
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload accept="image/*" showUploadList={false} beforeUpload={this.beforeUploadControls}>
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              <UploadOutlined />
            </button>
          </Upload>
        )
      }
    ];
    const { editorState } = this.state;
    const { visible, detailedRecord } = this.props;
    return (
      <Drawer
        title="版本发布说明"
        width={1000}
        onClose={this.handleCancel}
        visible={visible}
        maskClosable={false}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right'
            }}
          >
            <Button onClick={this.handleCancel} style={{ marginRight: 8 }}>
              关闭
            </Button>
            {detailedRecord && detailedRecord.id ? (
              ''
            ) : (
              <Button onClick={this.handleOk} type="primary">
                提交
              </Button>
            )}
          </div>
        }
      >
        <Form {...layout} ref={this.formRef} shouldUpdate>
          <Form.Item
            label="发布平台"
            name="source"
            initialValue={detailedRecord && detailedRecord.source}
            rules={[{ required: true, message: '请选择发布平台!' }]}
          >
            <Radio.Group onChange={this.handleChangePlatform}>
              <Radio value={1}>小程序</Radio>
              <Radio value={2}>PC端</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="版本编号"
            name="version"
            initialValue={detailedRecord && detailedRecord.version}
            rules={[{ required: true, message: '请输入版本编号!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="版本简介"
            name="introduction"
            initialValue={detailedRecord && detailedRecord.introduction}
            rules={[{ required: false, message: '请输入版本简介!' }]}
          >
            <TextArea rows={3} showCount maxLength={500} />
          </Form.Item>
          {detailedRecord && detailedRecord.content ? (
            <Form.Item label="版本内容" name="content">
              <div
                style={{ border: '1px solid #f5f5f5', padding: '20px', minHeight: '200px' }}
                dangerouslySetInnerHTML={{ __html: detailedRecord && detailedRecord.content }}
              ></div>
            </Form.Item>
          ) : (
            <Form.Item
              label="版本内容"
              name="content"
              rules={[{ required: false, message: '请输入版本内容!' }]}
            >
              <BraftEditor
                value={editorState}
                onChange={this.handleChange}
                controls={controls}
                extendControls={extendControls}
                placeholder="请输入版本内容"
              />
            </Form.Item>
          )}
        </Form>
      </Drawer>
    );
  }
}

export default EditionDrawer;
