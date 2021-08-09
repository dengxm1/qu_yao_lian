import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

class UI {
  // 左侧展示隐藏
  @observable collapsed = false;
  @observable modulesData = [];
  @action toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
  @action reset() {
    this.collapsed = false;
  }
  @action handleModulesData(data) {
    this.modulesData = data;
  }
}

const ui = new UI();

export default ui;
