import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

class InventoryManage {
  // 左侧展示隐藏
  @observable searchDatas = {};
  @observable searchPage = 1;
  @action saveSearchData = (data) => {
    this.searchDatas = data;
  };
  @action handleSearchPage = (data) => {
    this.searchPage = data;
  };
}

const inventoryManage = new InventoryManage();

export default inventoryManage;
