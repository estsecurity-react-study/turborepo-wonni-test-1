import { useState } from 'react';
import { schc } from './SCHC';
import { vcit } from './VCIT';
import { portfolio } from './portfolio';
import MultilineChart from './views/MultilineChart';
import Legend from './Legend';

const portfolioData = {
  name: 'Portfolio',
  color: '#ffffff',
  items: portfolio.map((d) => ({ ...d, date: new Date(d.date) })),
};
const schcData = {
  name: 'SCHC',
  color: '#d53e4f',
  items: schc.map((d) => ({ ...d, date: new Date(d.date) })),
};
const vcitData = {
  name: 'VCIT',
  color: '#5e4fa2',
  items: vcit.map((d) => ({ ...d, date: new Date(d.date) })),
};

const dimensions = {
  width: 600,
  height: 300,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60,
  },
};
export default function D3() {
  const [selectedItems, setSelectedItems] = useState([]);
  const legendData = [portfolioData, schcData, vcitData];
  const chartData = [
    portfolioData,
    ...[schcData, vcitData].filter((d) => selectedItems.includes(d.name)),
  ];
  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };
  return (
    <div className="App" style={{ background: '#000000' }}>
      <Legend data={legendData} selectedItems={selectedItems} onChange={onChangeSelection} />
      <MultilineChart data={chartData} dimensions={dimensions} />
    </div>
  );
}