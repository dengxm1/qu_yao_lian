import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

class Global {
  // 左侧展示隐藏
  @observable userInfo = {
    username: '12312'
  };

  @action setUserInfo = (data) => {
    this.searchDatas = data;
  };
}

const G = new Global();

export default G;
