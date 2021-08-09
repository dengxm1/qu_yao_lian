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
import { UploadOutlined } from '@ant-design/icons';

import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import adminApi from 'api/admin';
import './noticeModal.less';

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
class NoticeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 1,
      resourceType: null,
      file: [],
      fileName: '',
      isshowmodules: false,
      editorState: BraftEditor.createEditorState(null),
      richtext: '', //存放富文本字段，
      modulesList: [],
      platform: 0,
      moduleid: '',
      ispc: false
    };
    this.formRef = React.createRef();
  }
  componentDidMount = () => {
    this.formRef.current && this.formRef.current.setFieldsValue({ resourceType: null }); //清空类型
    this.formRef.current && this.formRef.current.setFieldsValue({ module: null }); //所属模块
    this.modules();
  };
  //获取模块
  modules = () => {
    // adminApi.noticeModule({ platform: this.state.platform }).then((res) => {
    //   const result = res.data;
    //   if (result.code === '0') {
    //     this.setState({
    //       modulesList: result.data && result.data.dataList,
    //       moduleid: ''
    //     });
    //     this.formRef.current && this.formRef.current.setFieldsValue({ module: null });
    //   } else {
    //     message.error(result.message);
    //   }
    // });
  };
  //格式选择--文件，文本，富文本--通知内容模块的切换
  handleChangeType = (e) => {
    this.setState({
      format: e.target.value
    });
    this.formRef.current && this.formRef.current.setFieldsValue({ content: null }); //内容
  };
  //类型选择--所属模块的显示与隐藏
  handleChangeTypeNew = (e) => {
    if (e.target.value === 3) {
      this.setState({
        isshowmodules: true
      });
    } else {
      this.setState({
        isshowmodules: false,
        format: 1
      });
      this.formRef.current && this.formRef.current.setFieldsValue({ format: 1 });
    }
  };

  handleOk = () => {
    const { format, file } = this.state;
    if (format === 1 && (!file || file === '')) {
      message.error('请上传文件');
      return;
    }
    this.formRef.current
      .validateFields()
      .then((values) => {
        let formData = new FormData();
        if (format === 1) {
          file.map((ele, index) => {
            formData.append('files', ele, ele.name);
          });
        }
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
        adminApi.noticeInsert(formData).then((res) => {
          if (res.data.code == '0') {
            message.success('新增成功');
            this.props.onClose(true);
            this.formRef.current.resetFields();
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
        isType == 'docx' ||
        isType == 'png' ||
        isType == 'jpeg' ||
        isType == 'jpg'
      ) {
        return false;
      } else {
        message.error('文件格式不正确');
        return true;
      }
    }
  };
  //发布平台选择
  handleChangePlatform = (e) => {
    let that = this;
    if (e.target.value === 0) {
      //小程序
      this.setState({
        ispc: false
      });
    } else {
      //pc
      this.setState({
        ispc: true
      });
    }

    this.formRef.current && this.formRef.current.setFieldsValue({ resourceType: null }); //清空类型
    this.formRef.current && this.formRef.current.setFieldsValue({ module: null }); //所属模块
    this.formRef.current && this.formRef.current.setFieldsValue({ content: null }); //文本 富文本内容
    this.formRef.current && this.formRef.current.setFieldsValue({ format: 1 }); //所属模块
    this.setState(
      {
        isshowmodules: false,
        format: 1,
        platform: e.target.value
      },
      function() {
        that.modules();
      }
    );
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

  handleChangePop = () => {};

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
      // 'media',
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
    const {
      format,
      resourceType,
      fileName,
      file,
      isshowmodules,
      editorState,
      modulesList,
      moduleid,
      isshownotice,
      ispc,
      platform
    } = this.state;
    const { visible, noticeRecord } = this.props;
    const index = fileName.lastIndexOf('.');
    const isType = fileName.substr(index + 1).toLowerCase();
    const uploadprops = {
      // showUploadList: false,
      beforeUpload: (file) => {
        return false;
      },
      multiple: true,
      showUploadList: {
        showRemoveIcon: true
      },
      onChange: (info) => {
        let fileArr = this.state.file.slice();
        let file = info.file;
        fileArr.push(file);
        if (!this.fileType(file)) {
          if (file.size / (1024 * 1024) > 10 || !file.size) {
            message.error('上传文件不能为空或超过10M');
            this.setState({
              file: [],
              fileName: ''
            });
          }
          // else if (info.fileList[0].type !== 'application/pdf') {
          //   message.error('只支持上传pdf文件');
          // }
          else {
            this.setState({
              file: fileArr,
              fileName: file.name
            });
          }
        }
      }
    };

    return (
      <Drawer
        title="新增通知"
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
        <Form {...layout} ref={this.formRef} shouldUpdate>
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
            rules={[{ required: true, message: '请输入信息资源名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="发布平台"
            name="platform"
            initialValue={1}
            rules={[{ required: true, message: '请选择是否发布平台!' }]}
          >
            <Radio.Group onChange={this.handleChangePlatform}>
              <Radio value={1}>PC端</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="类型"
            initialValue={2}
            name="resourceType"
            rules={[{ required: true, message: '请选择类型!' }]}
          >
            <Radio.Group onChange={this.handleChangeTypeNew}>
              <Radio value={2}>信息公告</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="格式"
            name="format"
            initialValue={format}
            rules={[{ required: true, message: '请选择格式!' }]}
          >
            <Radio.Group onChange={this.handleChangeType}>
              <Radio value={1}>文件</Radio>
              {isshowmodules ? <Radio value={2}>文本</Radio> : ''}
              {isshowmodules ? <Radio value={3}>富文本</Radio> : ''}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="显示方式"
            name="pop"
            rules={[{ required: true, message: '请选择是否显示弹窗!' }]}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </Form.Item>
          {format === 1 ? (
            <Form.Item label="上传文件">
              <Upload {...uploadprops}>
                <Button type="primary">
                  <UploadOutlined /> 上传通知文件
                </Button>
                {/* <text className="remarkDes">
                  <InfoCircleOutlined style={{ marginRight: '5px' }} />
                  请上传10M以内的文件
                </text> */}
              </Upload>
              {/* <span style={{ display: 'block', marginTop: 10 }}>{fileName}</span> */}
            </Form.Item>
          ) : format === 2 ? (
            <Form.Item
              label="内容"
              name="content"
              // rules={[{ required: true, message: '请输入内容!' }]}
            >
              <TextArea rows={3} />
            </Form.Item>
          ) : (
            ''
          )}
          <Form.Item
            label="排序"
            name="sequence"
            rules={[{ required: true, message: '请输入排序!' }]}
          >
            <InputNumber min={0} precision={0} style={{ width: 100 }} />
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
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
        </Form>
      </Drawer>
    );
  }
}

export default NoticeModal;
