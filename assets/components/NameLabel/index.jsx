import React, { useState } from 'react';
import './index.less';

const NameLabel = (props) => {
  const { name } = props;
  return (
    <div className="nameLabel">
      <p className="borberLeft"></p>
      <p className="nameLabel-name">{name || '企业基本信息'}</p>
    </div>
  );
};
export default NameLabel;
