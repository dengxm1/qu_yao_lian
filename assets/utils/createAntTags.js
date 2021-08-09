import React, { memo } from 'react';
import { Input, Radio, DatePicker, Tabs, Button, Descriptions, Select } from 'antd';

const { Option } = Select;

export const createTags = (item) => {
  return {
    Input: <Input {...item.tagProps} />,
    InputPwd: <Input.Password {...item.tagProps} />,
    Radio: (
      <Radio.Group {...item.tagProps}>
        {item.dataSourse &&
          item.dataSourse.map((r) => (
            <Radio key={r.value} value={r.value}>
              {r.label}
            </Radio>
          ))}
      </Radio.Group>
    ),
    'DatePicker.RangePicker': <DatePicker.RangePicker />,
    Button: (
      <Button key={item.tagText} {...item.tagProps}>
        {item.tagText}
      </Button>
    )
  }[item.tagType];
};

export const ByTabs = (props) => {
  const { data, onChange, keys = { l: 'label', k: 'key' }, operations = null } = props;

  return (
    !!data.length && (
      <Tabs defaultActiveKey={data[0][keys.k]} onChange={onChange} tabBarExtraContent={operations}>
        {data.map((tab) => (
          <Tabs.TabPane tab={tab[keys.l]} key={tab[keys.k]} />
        ))}
      </Tabs>
    )
  );
};

export const ByDescriptions = memo((props) => {
  const { data = [], column } = props;

  return (
    !!data.length && (
      <Descriptions column={column}>
        {data.map((des) => (
          <Descriptions.Item label={des.label} key={des.label}>
            {des.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    )
  );
});

export const BySelect = memo((props) => {
  const { data, onChange, style = { width: 120 }, keys = { l: 'label', k: 'key' } } = props;
  return (
    !!data.length && (
      <Select style={style} defaultValue={data[0][keys.k]} onChange={onChange}>
        {data.map((select) => (
          <Option value={select[keys.k]} key={select[keys.k]}>
            {select[keys.l]}
          </Option>
        ))}
      </Select>
    )
  );
});
