import React from 'react';
import { observer, inject } from 'mobx-react';
import OtherApi from 'api/other';
import './index.less';

@inject('ContentOpera')
@observer
class ContentOperaPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operaDesValues: ''
    };
  }
  componentDidMount() {
    const contentOperaValues = this.props.ContentOpera.getValues;
    OtherApi.getValue({ type: 'operate_explain_type' }).then((res) => {
      if (res?.data?.success) {
        let dataList = res.data.data.dataList;
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].name == contentOperaValues.title) {
            this.setState({
              operaDesValues: dataList[i].value
            });
            break;
          }
        }
      }
    });
  }
  render() {
    let { operaDesValues } = this.state;
    return (
      <div>
        {operaDesValues ? <p className="contentOpera">{'操作说明：' + operaDesValues}</p> : null}
      </div>
    );
  }
}
export default ContentOperaPage;
