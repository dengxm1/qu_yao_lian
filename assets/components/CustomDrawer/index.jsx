import React, { Fragment } from 'react';
import { Drawer, Space } from 'antd';
import { createTags } from 'utils/createAntTags';

const CustomDrawer = (props) => {
  const {
    children,
    drawerTitle,
    drawerVisible,
    actionBtns,
    width = 1000,
    onClose,
    handleFooterBtnClick
  } = props;

  const buildActionBtns = actionBtns || [
    {
      tagType: 'Button',
      tagText: '确定提交',
      tagProps: {
        type: 'primary',
        onClick: () => handleFooterBtnClick('submit')
      }
    },
    {
      tagType: 'Button',
      tagText: '取消',
      tagProps: {
        type: 'default',
        onClick: () => handleFooterBtnClick('cancel')
      }
    }
  ];

  return (
    <Fragment>
      <Drawer
        width={width}
        maskClosable={false}
        title={drawerTitle}
        visible={drawerVisible}
        onClose={onClose}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>{buildActionBtns.map((btn) => createTags(btn))}</Space>
          </div>
        }
      >
        {children}
      </Drawer>
    </Fragment>
  );
};

export default CustomDrawer;
