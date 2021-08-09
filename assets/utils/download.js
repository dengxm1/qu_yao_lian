const download = (res, title) => {
  let str = res.headers['content-disposition'];
  let index = str.indexOf('=');
  let eleLink = document.createElement('a');
  eleLink.download = str.slice(index + 1);
  eleLink.download = title;
  eleLink.style.display = 'none';
  eleLink.setAttribute('href', window.URL.createObjectURL(res.config.url));
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};

export const urlDownload = (link, filename) => {
  let DownloadLink = document.createElement('a');
  DownloadLink.style = 'display: none'; // 创建一个隐藏的a标签
  DownloadLink.download = filename;
  DownloadLink.href = location.origin + link;
  document.body.appendChild(DownloadLink);
  DownloadLink.click(); // 触发a标签的click事件
  document.body.removeChild(DownloadLink);
};

export default download;
