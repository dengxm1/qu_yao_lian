import React from 'react';

import Content from 'components/Content';
import ProCityLetCode from 'bundle-loader?lazy&name=proCityLetCode!./proCityLetCode';
import './index.less';

const pageComponents = [ProCityLetCode];

const Privacy = () => {
  return <Content name="privacy" pageComponents={pageComponents} />;
};

export default Privacy;
