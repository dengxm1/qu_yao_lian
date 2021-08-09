import React, { useState, useEffect } from 'react';
import { Drawer, Table, Button, Pagination } from 'antd';
import inventoryApi from 'api/inventory.js';

import './index.less';

const DetailModal = (props) => {
  const { visible, cancel, data } = props;
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      })
    },
    {
      title: '操作类型',
      dataIndex: 'optType',
      key: 'optType',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      })
    },
    {
      title: '登记人',
      dataIndex: 'user',
      key: 'user',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      })
    },
    {
      title: '出入库数量',
      dataIndex: 'stockDetailNum',
      key: 'stockDetailNum',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      })
    },
    {
      title: '库存',
      dataIndex: 'stockNum',
      key: 'stockNum',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      })
    },

    {
      title: '操作时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      onHeaderCell: () => ({
        style: { minWidth: 120 }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      })
    }
  ];
  const getData = (pageNum, pageSize, searchData) => {
    const params = {
      productDetailId: data.productDetailId,
      productId: data.productId,
      pageNum: pageNum,
      pageSize,
      ...searchData
    };
    inventoryApi.recordList(params).then((res) => {
      if (res?.data?.success) {
        const dataList = res.data.data.list;
        setDataSource(dataList);
        setTotal(res.data.data.total);
      }
    });
  };

  useEffect(() => {
    if (JSON.stringify(data) != '{}') {
      getData(1, 10);
    }
  }, [data]);

  const handleCancel = () => {
    cancel();
  };
  const handleSubmit = () => {
    cancel();
  };
  const handleChangePage = (e, size) => {
    getData(e, size);
    setPageNum(e);
    setPageSize(size);
  };
  return (
    <Drawer
      title="库存明细"
      className="detailModal"
      visible={visible}
      maskClosable={false}
      onClose={handleCancel}
      width={1000}
      footer={
        <div className="detailFooter">
          <Button type="primary" style={{ marginRight: '10px' }} onClick={handleSubmit}>
            确认
          </Button>
          <Button onClick={handleCancel}>取消</Button>
        </div>
      }
    >
      <Table columns={columns} dataSource={dataSource} scroll={{ x: true }} pagination={false} />
      <Pagination
        total={total}
        style={{ marginTop: '10px', float: 'right', paddingBottom: '20px' }}
        showTotal={(total) => `共${total}条`}
        showSizeChanger
        pageSizeOptions={['10', '20', '50', '100']}
        onChange={(page, pageSize) => handleChangePage(page, pageSize)}
        onShowSizeChange={(page, pageSize) => handleChangePage(page, pageSize)}
        current={pageNum}
        pageSize={pageSize}
      />
    </Drawer>
  );
};

export default DetailModal;
