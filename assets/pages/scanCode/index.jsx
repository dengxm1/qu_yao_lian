import React, { useEffect, useState } from 'react';
import { Modal, Select, Carousel } from 'antd';
import { useSetState } from 'ahooks';

import moment from 'moment';

import { BySelect } from 'utils/createAntTags';
import scanCodeApi from 'api/scanCode';

import './index.less';
import recall from 'public/imgs/scanCode/recall.png';
import link from 'public/imgs/link.png';
import scanLogo from 'public/imgs/scanCode/scanLogo.png';
import test from 'public/imgs/test.png';
import unitIcon from 'public/imgs/unit.png';
import headBg from 'public/imgs/head-bg.png';

const companySelectKeys = { k: 'companyId', l: 'companyName' };

const ScanCode = (props) => {
  const batIndex = window.location.href.indexOf('bat');
  const gtinIndex = window.location.href.indexOf('gtin');

  const ref = React.useRef(null);

  const [noShow, setNoshow] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [batchNumberList, setBatchNumberList] = useState([]);
  const [searchData, setSearchData] = useState('');
  const [id, setId] = useState('');
  const [batchData, setBatchData] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [state, setState] = useSetState({
    percent: 0,
    data: {}
  });

  const handleGetBatchList = (gtin, bat) => {
    setSearchData('');
    const params = {
      batchNumber: bat,
      productId: gtin
    };
    scanCodeApi.selectProductBatch(params).then((res) => {
      if (res?.data?.data) {
        setBatchNumberList(res.data.data);
      }
    });
  };

  const handleChangeSearchData = (id) => {
    if (id) {
      scanCodeApi.getProductTraceInfo(id).then((res) => {
        if (res?.data?.data) {
          setBatchData(res?.data?.data);
          setNoshow(res.data?.data.noShow);
          setSearchData(id);
        }
      });
    }
    // else {
    //   setBatchData(null);
    //   setState({ batchNumber: '' });
    // }
  };

  const handleSearchData = (e) => {
    handleGetBatchList(id, e);
    setSearchData(e);
  };

  const getCodePageInfoCompanyList = async (params) => {
    if (!companyList.length) {
      const res = await scanCodeApi.getCodePageInfoCompanyList(params);
      if (res?.data?.data?.dataList) {
        setCompanyList(res?.data?.data?.dataList);
      }
    }
  };

  const getData = async (e) => {
    let res = {};
    const params = {
      gtin: props?.match?.params.gtin,
      bat: e
    };
    try {
      if (batIndex != -1) {
        res = await scanCodeApi.getDeatil(params);
      } else {
        if (gtinIndex != -1) {
          // 品类码
          res = await scanCodeApi.getDeatilNoBat(params);
          getCodePageInfoCompanyList({ barCode: params.gtin });
        } else {
          const noGtin = { traceNumber: props?.match?.params.code };
          res = await scanCodeApi.getTraceNumber(noGtin);
        }
      }
      if (res?.data?.data) {
        setState({ data: res.data?.data || {} });
        setNoshow(res.data?.data.noShow);
        setId(res.data?.data.productId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompanySelectChange = async (e) => {
    const params = {
      barCode: props?.match?.params.gtin,
      companyId: e
    };
    const res = await scanCodeApi.getCodePageInfoAll(params);
    if (res?.data?.data) {
      setState({ data: res.data?.data || {} });
      setNoshow(res.data?.data.noShow);
      setId(res.data?.data.productId);
      setBatchData(null);
      setSearchData('');
    }
  };

  const {
    productName,
    fromCompanyName,
    businessScope,
    shelfLife,
    spec,
    productionDate,
    companyLink,
    batchNumber,
    address,
    imageLink,
    uniformCode,
    barCode,
    dateUnit,
    companyName,
    liscenceNumber,
    specUnit,
    isRevoke,
    testImage,
    unit,
    testPdfImage,
    factoryCode,
    barCodeImageLink
  } = state.data;

  const testImages = testImage ? testImage : '' || batchData ? batchData.testImage : '';
  const images = imageLink ? imageLink.split(',') : [];
  const format = 'YYYY-MM-DD';

  useEffect(() => {
    const bat = props?.match?.params.bat;
    getData(bat);
  }, []);

  useEffect(() => {
    const asy = setTimeout(() => {
      if (state.percent < 100) {
        setState((v) => ({ percent: v.percent + 1 }));
      }
      clearTimeout(asy);
    }, 50);
  }, [state.percent]);

  return (
    <div className="scan-code">
      <div className="con">
        <div className="header-component">
          {isRevoke == '1' ? (
            <div className="tag">
              <img src={recall} />
            </div>
          ) : (
            ''
          )}
          {!imageLink || imageLink === 'null' ? (
            <img className="logo" src={scanLogo} />
          ) : (
            <Carousel>
              {images.length > 0
                ? images.map((ele, index) => {
                    return (
                      <div key={index} className="tag">
                        <img src={ele} />
                      </div>
                    );
                  })
                : ''}
            </Carousel>
          )}
          <div className="banner-title">
            <p className="banner-title-name">浙食链</p>
            <img className="banner-bg" src={headBg} />
            <p className="product-detail">
              {productName}&nbsp;
              {spec}
              {specUnit}/{unit}
            </p>
          </div>
        </div>
        {!!companyList.length && (
          <div className="company-name-tips">
            <div>
              当前信息为{companyName}提供的信息，如需查看其他生产企业信息，可以下拉框选择查看
            </div>
            <BySelect
              keys={companySelectKeys}
              style={{ width: '60vw' }}
              data={companyList}
              onChange={handleCompanySelectChange}
            />
          </div>
        )}
        <div className="info">
          <div className="base-info">
            <div className="info-title">
              <div>基本信息</div>
            </div>
            <div className="product-info">
              <div className="item">
                <label>商品名称</label>
                <span>{productName}</span>
              </div>
              <div className="item">
                <label>企业名称</label>
                <span>
                  <span>{companyName}</span>
                </span>
              </div>

              {productionDate ? (
                <div className="item">
                  <label>生产日期</label>
                  <span>{productionDate ? moment(productionDate).format(format) : ''}</span>
                </div>
              ) : (
                ''
              )}

              <div className="item">
                <label>保质期</label>
                <span>
                  {dateUnit == '月'
                    ? shelfLife && dateUnit
                      ? `${shelfLife}个${dateUnit}`
                      : ''
                    : `${shelfLife ? shelfLife : ''}${dateUnit ? dateUnit : ''}`}
                </span>
              </div>

              <div className="item">
                <label>规格单位</label>
                <span>
                  {spec}
                  {specUnit || ''} /{unit || ''}
                </span>
              </div>

              {batchNumber ? (
                <div className="item">
                  <label>生产批次号</label>
                  <span>{batchNumber}</span>
                </div>
              ) : (
                ''
              )}

              <div className="item">
                <label>商品条码</label>
                {barCodeImageLink ? <img src={barCodeImageLink} /> : <span>{barCode}</span>}
              </div>
            </div>
          </div>
          {batIndex == -1 && id && !state.data.batchNumber ? (
            <div>
              <p style={{ marginTop: '10px', marginBottom: '10px', color: '#999999' }}>
                请输入包装袋上的批次号或生产日期，检索查看对应检测报告或相关检测信息。
              </p>
              <Select
                style={{ width: '200px' }}
                showSearch
                value={searchData}
                placeholder="可输入批次号进行搜索"
                // allowClear
                onChange={handleChangeSearchData}
                onSearch={handleSearchData}
                filterOption={false}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                onFocus={() => handleGetBatchList(id, '')}
              >
                {batchNumberList.length > 0
                  ? batchNumberList.map((ele, index) => {
                      return (
                        <Select.Option key={ele.id} value={ele.id}>
                          {ele.batchNumber}
                        </Select.Option>
                      );
                    })
                  : ''}
              </Select>
            </div>
          ) : (
            ''
          )}
          {state.data.batchNumber || batchData ? (
            <div>
              <div className="base-info">
                <div className="info-title">
                  <div>食品追溯</div>
                </div>
                <div className="product-info-unit">
                  <div>
                    <img className="product-info-logo" src={unitIcon} alt="" />
                    <span className="product-test-title">生产单位</span>
                  </div>
                  <div className="product-unit">
                    <div className="product-unit-content">
                      <div className="item">
                        <label>企业名称</label>
                        <span>{batchData ? batchData.fromCompanyName : ''}</span>
                      </div>
                      <div className="item">
                        <label>统一社会信用代码</label>
                        <span>{batchData ? batchData.fromCompanyCode : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <img className="product-info-logo" src={test} alt="" />
                  <span className="product-test-title">出厂检验</span>
                </div>
                <div className="product-info">
                  {testPdfImage || (batchData && batchData.testPdfImage) ? (
                    <img
                      style={{ maxWidth: '300px', marginTop: '5px', marginBottom: '20px' }}
                      src={testPdfImage || batchData.testPdfImage}
                    />
                  ) : (
                    // <p style={{ maxWidth: '300px', marginTop: '5px', marginBottom: '20px' }}>
                    //   暂无电子检验报告
                    // </p>
                    ''
                  )}
                  {!noShow ? (
                    <div>
                      {testImages
                        ? testImages.split(',').map((ele, index) => {
                            return (
                              <img
                                key={index}
                                style={{ maxWidth: '300px', marginBottom: '5px' }}
                                src={ele}
                              />
                            );
                          })
                        : ''}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        {companyLink ? (
          <div className="companyLink">
            <a href={companyLink} style={{ display: 'flex' }}>
              <img
                style={{ width: '30px', height: '27px', marginLeft: '5px', marginTop: '3px' }}
                src={link}
              />
              <span style={{ fontSize: '12px', marginTop: '3px', color: '#5C99FA' }}>
                <span>企业</span>
                <span>相关</span>
              </span>
            </a>
          </div>
        ) : (
          ''
        )}
      </div>
      <Modal
        visible={isDetail}
        footer={null}
        maskClosable={true}
        closable={false}
        bodyStyle={{ padding: 0, background: 'rgba(0,0,0,0)' }}
        wrapClassName="detai-modal"
        onCancel={() => setIsDetail(false)}
      >
        <div className="con is-detail">
          <div className="info">
            <div className="base-info">
              <div className="info-title">生产单位信息</div>
              <div className="product-info">
                <div className="item">
                  <label>企业名称</label>
                  <span>{fromCompanyName}</span>
                </div>
                <div className="item">
                  <label>统一社会信用代码</label>
                  <span>{uniformCode}</span>
                </div>
                <div className="item">
                  <label>经营范围</label>
                  <span>{businessScope}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScanCode;
