import { format } from 'd3';

export const formatPriceUSD = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export const formatPercent = (percent: number) => {
  let result = '0.00%';
  const isNumber = typeof percent === 'number';
  const isString = typeof percent === 'string';

  const isNotNaN = !Number.isNaN(parseFloat(percent.toString()));
  // 값의 유형이 Number이고 값이 NaN 이면 true, 아니면 false

  if ((isNumber || isString) && isNotNaN) {
    result = `${parseFloat(percent.toString()) > 0 ? '+' : ''}${format('.2%')(percent / 100)}`;
  }
  return result;
};
