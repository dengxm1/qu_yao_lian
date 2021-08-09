import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Space, Divider, Collapse, message } from 'antd';
import { ArrowLeftOutlined, LeftCircleOutlined } from '@ant-design/icons';
import creatHistory from 'history/createHashHistory';
const history = creatHistory();
import adminApi from 'api/admin';
import './problem.less';

const { Panel } = Collapse;

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

class Problem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ProblemList: []
    };
  }
  componentDidMount() {
    this.homeProblem();
  }
  //获取问题
  homeProblem = () => {
    adminApi.homeProblem({}).then((res) => {
      const data = res.data;
      if (data.code == '0') {
        if (data.data && data.data.length > 0)
          this.setState({
            ProblemList: data.data
          });
      } else {
        message.error(data.message);
      }
    });
  };
  //返回按钮
  toback = () => {
    history.goBack();
  };
  render() {
    const { ProblemList } = this.state;
    return (
      <div className="problemPage">
        <Row gutter={16} style={{ height: '100%' }}>
          <Col span={24}>
            <Card className="problemCard">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                <ArrowLeftOutlined
                  onClick={this.toback}
                  style={{ marginRight: 10, fontSize: 18 }}
                />
                <h2>常见问题</h2>
              </div>
              <Divider className="line" />
              <Collapse ghost>
                {ProblemList.length > 0 &&
                  ProblemList.map((item, i) => {
                    return (
                      <Panel header={item.type} key={i}>
                        {item.data.length > 0 &&
                          item.data.map((index, j) => {
                            return (
                              <Link
                                to={{
                                  pathname: routerPrefix + '/public/home/detail',
                                  state: index
                                }}
                                key={j}
                              >
                                <p>{index.name}</p>
                              </Link>
                            );
                          })}
                      </Panel>
                    );
                  })}
              </Collapse>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Problem;
