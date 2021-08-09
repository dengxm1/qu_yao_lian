import React, { Fragment, useMemo } from 'react';
import { Modal, Space, message } from 'antd';

import { createTags, ByDescriptions } from 'utils/createAntTags';
import { actionBtns } from './buildTagData';
import CustomDrawer from 'components/CustomDrawer';

import SignatureApi from 'api/signature.js';

const style = {
  border: '1px solid #999',
  borderRadius: 20,
  padding: '15px 35px 0',
  marginTop: 15
};

const PopupModal = ({ popType, personType, popVisible, popRecord, handlePopupClose }) => {
  let desData = [
    [
      { label: '标题', value: popRecord.title || '-' },
      { label: '申请人', value: popRecord.sponsor || '-' },
      { label: '申请时间', value: popRecord.startTime || '-' },
      { label: '联系电话', value: popRecord.sponsorTel || '-' }
    ],
    [
      { label: '企业名称', value: popRecord.companyName || '-' },
      { label: '所在地址', value: popRecord.address || '-' },
      { label: '统一社会信用代码', value: popRecord.uniformCode || '-' },
      { label: '联系人', value: popRecord.contactPerson || '-' },
      {
        label: '企业类型',
        value: ['生产企业', '流通企业', '', '', '阳光工厂'][+popRecord.companyType - 1] || '-'
      },
      { label: '联系电话', value: popRecord.contactPersonTel || '-' },
      { label: '经营场所', value: popRecord.businessPlace || '-' },
      { label: '营业期限', value: popRecord.businessTerm || '-' },
      {
        label: '经营范围',
        value: popRecord.businessScope || '-'
      }
    ]
  ];

  if (personType == 1 && popType === 'finish') {
    desData[0].push({ label: '处理结果', value: popRecord.approveStatus });
  }

  const handleFooterBtnClick = async (type) => {
    const { approveId } = popRecord;
    let res = {};
    switch (type) {
      case 'submit':
        res = await SignatureApi.approveAgree({ approveId });
        break;
      case 'cancel':
        if (popType === 'dosth') {
          res = await SignatureApi.approveDisagree({ approveId });
        } else {
          return handlePopupClose();
        }
        break;
      default:
        break;
    }
    let data = res?.data?.data;
    let msg = res?.data?.msg;
    if (data) {
      msg && message.success(msg);
      handlePopupClose(true);
    } else {
      msg && message.error(msg);
    }
  };

  const actionBtn = actionBtns(popType, personType, handleFooterBtnClick);
  const companyAppleState = {
    dosth: '是否通过该企业的申请？',
    finish: `处理结果：${popRecord.approveStatus}`
  };

  const companyAppleTitle = (
    <div style={{ fontSize: 18 }}>
      <p>{popRecord.companyName}申请成为您的信任供应商。</p>
      <p style={{ margin: '10px 0' }}>
        成为信任供应商后，该企业发货给您的商品将直接入库到库存中，无需在待入库中确认入库。
      </p>
    </div>
  );

  return (
    <Fragment>
      {personType == 2 ? (
        <CustomDrawer
          width={800}
          drawerVisible={popVisible}
          drawerTitle={'企业申请'}
          actionBtns={actionBtn}
          onClose={() => handlePopupClose()}
          handleFooterBtnClick={handleFooterBtnClick}
        >
          <div>
            {companyAppleTitle}
            <div style={style}>
              <ByDescriptions column={2} data={desData[personType - 1]} />
            </div>
            <p style={{ fontSize: 18, marginTop: 20 }}>{companyAppleState[popType]}</p>
          </div>
        </CustomDrawer>
      ) : (
        <Modal
          width={666}
          visible={popVisible}
          title={'人员审核'}
          onCancel={() => handlePopupClose()}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Space>{actionBtn.map((btn) => createTags(btn))}</Space>
            </div>
          }
        >
          <ByDescriptions column={2} data={desData[personType - 1]} />
        </Modal>
      )}
    </Fragment>
  );
};

export default PopupModal;
