import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

class NavTabs {
  @observable dataList = [];
  @observable activeKey = '';
  @action setDataList = (data) => {
    if (!this.dataList.length) {
      this.dataList = [data];
    } else {
      const flag = this.dataList.some((item) => item.path === data.path);
      !flag && this.dataList.push(data);
    }
    this.activeKey = data.path;
  };
  @action setActiveKey = (data) => {
    this.activeKey = data;
  };
  @action removeActiveKey = (path) => {
    this.dataList = this.dataList.filter((item) => item.path !== path);
  };
}

export default new NavTabs();
