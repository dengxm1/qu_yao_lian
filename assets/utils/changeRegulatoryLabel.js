const changeRegulatoryLabel = (data) => {
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      data[i].label = data[i].regulatoryName;
      data[i].value = data[i].regulatoryName;
      data[i].code = data[i].regulatoryCode;
      data[i].children = data[i].childrens || [];
      if (data[i].children.length == 0) {
        delete data[i].children;
      }
      if (data[i].children) {
        changeRegulatoryLabel(data[i].children);
      }
    }
  }
  return data;
};

export default changeRegulatoryLabel;
