import React, { useState, useEffect } from 'react';
import { Drawer, Form, Row, Col } from 'antd';
import NameLabel from 'components/NameLabel';
import './index.less';

const DetailModal = (props) => {
  const { visible, data, handleCancel } = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 25 },
      sm: { span: 12 }
    },
    wrapperCol: {
      xs: { span: 36 },
      sm: { span: 15 }
    }
  };
  const handleClose = () => {
    handleCancel();
  };
  return (
    <Drawer title="证照详情" visible={visible} onClose={handleClose} width={1000}>
      <NameLabel name="企业信息" />
      {data.licenseType == '浙江食品生产许可证' ? (
        <div>
          <Form {...formItemLayout}>
            <Row gutter={24}>
              <Col span={11}>
                <Form.Item label={'生产者名称'}>{data.companyName}</Form.Item>
                <Form.Item label={'法定代表人'}>{data.uniformName}</Form.Item>
                <Form.Item label={'住所(经营地址)'}>{data.businessPlace}</Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label={'社会信用代码/身份证号'}>
                  <span>{data.uniformCode}</span>
                </Form.Item>
                <Form.Item label={'生产地址'}>{data.productionAddress}</Form.Item>
              </Col>
            </Row>
          </Form>
          <NameLabel name="证照信息" />
          <Form {...formItemLayout}>
            <Row gutter={24}>
              <Col span={11}>
                <Form.Item label={'证照类型'}>{data.licenseType}</Form.Item>
                <Form.Item label={'许可证编号'}>{data.licenseNo}</Form.Item>
                <Form.Item label={'日常监督管理机构'}>{data.regulatoryName}</Form.Item>
                <Form.Item label={'签发人'}>{data.approve}</Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label={'发证机关'}>
                  <span>{data.issuingAuthority}</span>
                </Form.Item>
                <Form.Item label={'签证照有效日期'}>{data.expireDate}</Form.Item>
                <Form.Item label={'日常监督管理人员'}>{data.regulatoryPerson}</Form.Item>
              </Col>
            </Row>
          </Form>
          <Form style={{ marginLeft: '140px' }}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label={'食品类别'}>{data.foodType}</Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label={'许可证照片'}>
                  <img style={{ width: '800px' }} src={data.url} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ) : (
        <div>
          <Form {...formItemLayout}>
            <Row gutter={24}>
              <Col span={11}>
                <Form.Item label={'经营者名称'}>{data.companyName}</Form.Item>
                <Form.Item label={'住所'}>{data.address}</Form.Item>
                <Form.Item label={'主体业态'}>{data.mainType}</Form.Item>
                <Form.Item label={'法定代表人(负责人)'}>{data.uniformName}</Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label={'社会信用代码/身份证号'}>
                  <span>{data.uniformCode}</span>
                </Form.Item>
                <Form.Item label={'经营场所'}>{data.businessPlace}</Form.Item>
                {/* <Form.Item label={'主体业态备注'}>{data.productionAddress}</Form.Item> */}
              </Col>
            </Row>
          </Form>
          <NameLabel name="证照信息" />
          <Form {...formItemLayout}>
            <Row gutter={24}>
              <Col span={11}>
                <Form.Item label={'证照类型'}>{data.licenseType}</Form.Item>
                <Form.Item label={'签发人'}>{data.approve}</Form.Item>
                <Form.Item label={'发证机关'}>{data.issuingAuthority}</Form.Item>
                <Form.Item label={'日常监督管理机构'}>{data.regulatoryName}</Form.Item>
                <Form.Item label={'日常监督管理人员'}>{data.regulatoryPerson}</Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label={'许可证编号'}>
                  <span>{data.licenseNo}</span>
                </Form.Item>
                <Form.Item label={'签发日期'}>{data.approveDate}</Form.Item>
                <Form.Item label={'发证机关编码'}>{data.issuingAuthorityCode}</Form.Item>
                <Form.Item label={'日常监督管理机构编码'}>{data.regulatoryCode}</Form.Item>
                <Form.Item label={'证照有效日期'}>{data.expireDate}</Form.Item>
              </Col>
            </Row>
          </Form>
          <Form style={{ marginLeft: '140px' }}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label={'经营项目'}>{data.businessItem}</Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label={'许可证照片'}>
                  <img style={{ width: '800px' }} src={data.url} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </Drawer>
  );
};
export default DetailModal;
