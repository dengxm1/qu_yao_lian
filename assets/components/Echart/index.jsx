'use strict';

import React, { useEffect } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';

const Echart = (props) => {
  const { chartId, options, height } = props;
  let chart;
  const initChart = () => {
    const chartDom = document.getElementById(chartId);
    //设置容器高宽
    chartDom.style.height = height;
    chart = echarts.init(chartDom);
    chart.setOption(options);
  };

  // 用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
  const resizeChart = () => {
    const chartDom = document.getElementById(chartId);
    chartDom.style.height = height;
    chart.resize();
  };

  useEffect(() => {
    initChart();
    window.addEventListener('resize', resizeChart());
    return () => {
      window.removeEventListener('resize', resizeChart());
    };
  }, []);

  return <div id={chartId} />;
};
export default Echart;
