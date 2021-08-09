const changeCityLabel = (data) => {
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      data[i].label = data[i].regionName;
      data[i].value = data[i].regionName;
      data[i].code = data[i].regionCode;
      data[i].children = data[i].regions;
      if (data[i].children) {
        changeCityLabel(data[i].children);
      }
    }
  }
  return data;
};

export default changeCityLabel;
