import React from 'react';
import { Row, Button } from 'antd';

const Index = ({ handleBatch, handleDownLoad }) => {
  return (
    <Row align="middle">
      <Button type="primary" onClick={handleBatch}>
        批量导入
      </Button>
      <a onClick={handleDownLoad}>下载模板</a>
    </Row>
  );
};

export default Index;
