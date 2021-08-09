import React, { memo } from 'react';
import { Row, Button } from 'antd';

const tips = [
  '新增信任经销商，且该企业同意后，您的企业发货给信任企业的商品将自动入库到其库存中，无需在待确认页面进行确认入库。',
  '新增信任供应商，您的信任供应商发货给您的商品将自动入库到其库存中，无需在待入库页面进行确认入库。'
];

const AddAction = ({ type = '1', handleClick }) => {
  return (
    <Row justify="space-between" align="middle" style={{ margin: '10px 0' }}>
      <a style={{ fontSize: 16 }}>{tips[+type - 1]}</a>
      <Button type="primary" onClick={handleClick}>
        新增
      </Button>
    </Row>
  );
};

export default memo(AddAction);
