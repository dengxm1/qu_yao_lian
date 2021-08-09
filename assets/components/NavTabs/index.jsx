import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Button } from 'antd';
import { inject, observer } from 'mobx-react';
const { TabPane } = Tabs;

@inject('NavTabs')
@observer
class NavTabs extends React.Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    this.state = {
      activeKey: props.NavTabs.activeKey
    };
  }

  onChange = (activeKey) => {
    const { setActiveKey } = this.props.NavTabs;
    setActiveKey(activeKey);
    this.props.history.push(activeKey);
    // this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push({ title: 'New Tab', content: 'New Tab Pane', key: activeKey });
    this.setState({ panes, activeKey });
  };

  remove = (targetKey) => {
    const { removeActiveKey } = this.props.NavTabs;
    removeActiveKey(targetKey);
  };

  render() {
    const { activeKey, dataList } = this.props.NavTabs;
    return (
      <div>
        {/* <div style={{ marginBottom: 16 }}>
          <Button onClick={this.add}>ADD</Button>
        </div> */}
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {dataList.map((pane) => (
            <TabPane tab={pane.title} key={pane.path} />
          ))}
        </Tabs>
      </div>
    );
  }
}
export default withRouter(NavTabs);
