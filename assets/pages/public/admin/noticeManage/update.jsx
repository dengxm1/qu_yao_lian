import React from 'react';
import {
  Pagination,
  Form,
  DatePicker,
  Button,
  Input,
  Space,
  Popconfirm,
  Drawer,
  message,
  InputNumber,
  Radio,
  Upload,
  Select
} from 'antd';
import adminApi from 'api/admin';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
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

class NoticeUpdate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      editorState: BraftEditor.createEditorState(null),
      noticeRecord: this.props.noticeRecord
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    adminApi
      .noticeDetail({
        id: this.props.noticeRecord.id
      })
      .then((res) => {
        const { data } = res.data;
        if (res.data.code === '0' && data) {
          if (data && data.format == 3) {
            data.content = BraftEditor.createEditorState(data.content);
            this.formRef.current &&
              this.formRef.current.setFieldsValue({
                content: BraftEditor.createEditorState(data.content)
              }); //清空类型
          }
          this.setState({
            noticeRecord: data,
            fileName: data.fileName
          });
        } else {
          message.error(res.data.message);
        }
      });
  }

  fileType = (file, key = false) => {
    const fileName = file.name;
    const index = fileName.lastIndexOf('.');
    //获取后缀
    const isType = fileName.substr(index + 1);

    if (!key) {
      if (
        isType == 'pdf' ||
        isType == 'rar' ||
        isType == '7z' ||
        isType == 'zip' ||
        isType == 'doc' ||
        isType == 'docx'
      ) {
        return false;
      } else {
        message.error('只支持上传pdf文件,word文档和压缩包');
        return true;
      }
    }
  };
  //获取富文本框的内容
  handleChange = (editorState) => {
    const htmlString = editorState.toHTML();
    this.setState({
      editorState: editorState,
      richtext: htmlString
    });
  };
  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.onClose();
  };
  //提交表单
  handleOk = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        values = { ...this.state.noticeRecord, ...values };

        let formData = new FormData();
        for (let key in values) {
          if (values[key] || values[key] === 0) {
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
        formData.append('fileEdit', false);
        adminApi.noticeUpdateJson(formData).then((res) => {
          if (res.data.code == '0') {
            message.success('修改成功');
            this.formRef.current.resetFields();
            this.props.onClose(true);
          } else {
            message.error(res.data.message);
          }
        });
      })
      .catch((errorInfo) => {});
  };
  //上传富文本图片
  beforeUploadControls = (file) => {
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
          if (res.data.code == '0') {
            if (this.formRef.current.getFieldValue('content')) {
              this.formRef.current.setFieldsValue({
                content: ContentUtils.insertMedias(this.formRef.current.getFieldValue('content'), [
                  {
                    type: 'IMAGE',
                    url: `/ell/api/source/resouce/download?id=${res.data.data.id}`
                  }
                ])
              });
            } else {
              this.formRef.current.setFieldsValue({
                content: ContentUtils.insertMedias(BraftEditor.createEditorState(null), [
                  {
                    type: 'IMAGE',
                    url: `/ell/api/source/resouce/download?id=${res.data.data.id}`
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
    const { editorState, noticeRecord } = this.state;
    const { visible } = this.props;
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
      // 'superscript',
      // 'subscript',
      'remove-styles',
      'emoji',
      'separator',
      'text-indent',
      'text-align',
      'separator',
      'headings',
      'list-ul',
      'list-ol',
      // 'blockquote',
      // 'code',
      'separator',
      'link',
      'separator',
      'hr',
      'separator',
      //'media',
      'separator'
    ];
    const uploadprops = {
      showUploadList: false,
      beforeUpload: (file) => {
        return false;
      },
      onChange: (info) => {
        let file = info.file;
        if (!this.fileType(file)) {
          if (file.size / (1024 * 1024) > 10 || !file.size) {
            message.error('上传文件不能为空或超过10M');
          } else {
            this.setState({
              file: file,
              fileName: file.name
            });
          }
        }
      }
    };
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
    return (
      <Drawer
        title="信息资源详情"
        width={1200}
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
            <Button onClick={this.handleOk} type="primary">
              提交
            </Button>
          </div>
        }
      >
        <Form {...layout} ref={this.formRef}>
          <Form.Item
            name="id"
            initialValue={noticeRecord && noticeRecord.id}
            style={{ display: 'none' }}
          >
            <span></span>
          </Form.Item>
          <Form.Item
            label="信息资源名称"
            name="name"
            initialValue={noticeRecord && noticeRecord.name}
            rules={[{ required: true, message: '请输入信息资源名称!' }]}
          >
            <Input />
          </Form.Item>
          {noticeRecord && noticeRecord.format == 2 ? (
            <Form.Item
              label="内容"
              name="content"
              initialValue={noticeRecord && noticeRecord.content}
              rules={[{ required: true, message: '请输入内容!' }]}
            >
              <TextArea rows={3} />
            </Form.Item>
          ) : (
            <Form.Item
              label="内容"
              name="content"
              initialValue={noticeRecord && noticeRecord.content}
              rules={[{ required: true, message: '请输入内容!' }]}
            >
              <BraftEditor
                value={editorState}
                onChange={this.handleChange}
                controls={controls}
                extendControls={extendControls}
                placeholder="请输入正文内容"
              />
            </Form.Item>
          )}
          <Form.Item
            label="排序"
            name="sequence"
            initialValue={noticeRecord && noticeRecord.sequence}
            rules={[{ required: true, message: '请输入排序!' }]}
          >
            <InputNumber min={0} precision={0} style={{ width: 100 }} />
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
}

export default NoticeUpdate;
