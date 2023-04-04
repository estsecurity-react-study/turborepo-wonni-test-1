import {
  extent,
  scaleLinear,
  scaleTime,
  min,
  max,
  axisBottom,
  axisLeft,
  line,
  select,
  easeLinear,
} from 'd3';

export const getXScale = (data: any, width: number) =>
  scaleTime()
    .domain(extent(data, (d) => d.date))
    .range([0, width]);

export const getYScale = (data: any, height: number, intention: number) =>
  scaleLinear()
    .domain([min(data, (d) => d.value) - intention, max(data, (d) => d.value) + intention])
    .range([height, 0]);

const applyAxisStyles = (container: any) => {
  container.select('.domain').remove();
  container.selectAll('line').attr('stroke', 'rgba(255, 255, 255, 0.2)');
  return container
    .selectAll('text')
    .attr('opacity', 0.5)
    .attr('color', 'white')
    .attr('font-size', '0.75rem');
};

export const drawAxis = ({ container, xScale, yScale, ticks, tickSize, tickFormat, transform }) => {
  const scale = xScale || yScale;
  const axisType = xScale ? axisBottom : axisLeft;
  const axis = axisType(scale).ticks(ticks).tickSize(tickSize).tickFormat(tickFormat);
  const axisGroup = container
    .append('g')
    .attr('class', 'axis')
    .attr('transform', transform)
    .call(axis);
  return applyAxisStyles(axisGroup);
};

export const drawLine = ({ container, data, xScale, yScale }) => {
  const lines = line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));
  return container
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', (d) => d.color)
    .attr('stroke-width', 3)
    .attr('d', (d) => lines(d.items));
};

export const animateLine = ({ element }) => {
  const length = element?.getTotalLength();
  return select(element)
    .attr('stroke-dasharray', `${length},${length}`)
    .attr('stroke-dashoffset', length)
    .transition()
    .duration(750)
    .ease(easeLinear)
    .attr('stroke-dashoffset', 0);
};
