import { format } from 'd3';

export const formatPriceUSD = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export const formatPercent = (percent = 0) => {
  let result = '0.00%';
  const isNumber = typeof percent === 'number';
  const isString = typeof percent === 'string';
  const isNotNaN = !Number.isNaN(parseFloat(percent));

  if ((isNumber || isString) && isNotNaN) {
    result = `${parseFloat(percent) > 0 ? '+' : ''}${format('.2%')(percent / 100)}`;
  }
  return result;
};
