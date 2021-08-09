import React from 'react';
import { Input, InputNumber } from 'antd';
import './index.less';

class NumBox extends React.Component {
  constructor(props) {
    super(props);
    this.currentModuleTitle = {};
    this.state = {
      num: this.props.min,
      disabled: false
    };
  }

  //加法操作
  increase = () => {
    const { max, min, type, index } = this.props;

    let newValData = this.state.num;
    if (type == 1) {
      newValData = parseInt(Number(newValData));
    }
    if (type == 2) {
      newValData = this.printDigit(newValData);
    }
    this.setState(
      {
        num: newValData == max ? newValData : newValData + 1
      },
      () => {
        this.props.onchange('add', type, this.state.num, index);
      }
    );
  };
  //减法操作
  decrease = () => {
    const { max, min, type, index } = this.props;
    let newValData = this.state.num;
    if (type == 1) {
      newValData = parseInt(Number(newValData));
    }
    if (type == 2) {
      newValData = this.printDigit(newValData);
    }
    this.setState(
      {
        num: newValData == min ? newValData : newValData - 1
      },
      () => {
        this.props.onchange('dec', type, this.state.num, index);
      }
    );
  };
  //小数点校验为3位
  printDigit(value) {
    value = value.toString();
    let maxlength = value.indexOf('.') + 4;
    if (maxlength !== 3) {
      value = value.substring(0, maxlength);
      const is_num = value.split('.').length;
      if (is_num > 2) {
        value = value
          .split('.')
          .splice(0, 2)
          .join('.');
      }
    }
    return parseFloat(value);
  }
  //输入监听
  onChangeNum(value) {
    const { max, min, type, index } = this.props;
    value = value == null ? min : value;
    value = value === '' ? min : value;
    value = value == '-' ? min : value;
    if (type == 1) {
      value = parseInt(Number(value));
    }
    if (type == 2) {
      value = this.printDigit(value);
    }
    this.setState(
      {
        num: value < min ? min : value
      },
      () => {
        this.props.onchange('add', type, value, index);
      }
    );
  }
  //失去焦点事件
  onBlurNum(value) {}
  render() {
    const { num } = this.state;
    const { min, max, type } = this.props;
    return (
      <div className="uni-numbox">
        <div onClick={this.decrease.bind(this)} className="uni-numbox__minus">
          <span className="uni-numbox--text">-</span>
        </div>
        {/* <Input value={num} min={min} className="uni-numbox__value" /> */}
        <InputNumber
          step={type == 1 ? 1 : 0.001}
          value={num}
          min={min}
          className="uni-numbox__value"
          onChange={(e) => this.onChangeNum(e)}
        />
        <div onClick={this.increase.bind(this)} className="uni-numbox__plus">
          <span className="uni-numbox--text">+</span>
        </div>
      </div>
    );
  }
}
export default NumBox;
