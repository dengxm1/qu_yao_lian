import { action, computed, configure, observable } from 'mobx';

configure({ enforceActions: 'observed' });

class ContentOpera {
  //操作说明
  @observable values = null;

  @action setValue = (index, value) => {
    if (index === 0) {
      this.values = '';
    } else if (value) {
      this.values = value;
    } else {
      this.values = null;
    }
  };
  @computed get getValues() {
    return this.values;
  }
}

const contentOpera = new ContentOpera();

export default contentOpera;
