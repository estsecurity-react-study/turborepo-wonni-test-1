import {
  axisBottom,
  extent,
  max,
  min,
  scaleLinear,
  scaleTime,
  select,
  line,
  axisLeft,
  easeLinear,
} from 'd3';
import { useRef, useEffect, useState } from 'react';

const MultilineChart = ({ data, dimensions }) => {
  const svgRef = useRef(null);
  const [prevItems, setPrevItems] = useState([]);
  const { width, height, margin = {} } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  useEffect(() => {
    const xScale = scaleTime()
      .domain(extent(data[0].items, (d) => d.date))
      .range([0, width]);

    const yScale = scaleLinear()
      .domain([min(data[0].items, (d) => d.value) - 50, max(data[0].items, (d) => d.value) + 50])
      .range([height, 0]);

    const svgEl = select(svgRef.current);

    svgEl.selectAll('*').remove();

    const svg = svgEl.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxis = axisBottom(xScale)
      .ticks(5)
      .tickSize(-height + margin.bottom);

    const xAxisGroup = svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    xAxisGroup.select('.domain').remove();
    xAxisGroup.selectAll('line').attr('stroke', 'rgba(0, 0, 0, 0.2)');
    xAxisGroup
      .selectAll('text')
      .attr('opacity', 0.5)
      .attr('color', 'black')
      .attr('font-size', '0.75rem');

    const yAxis = axisLeft(yScale)
      .ticks(5)
      .tickSize(-width)
      .tickFormat((val) => `${val}%`);
    const yAxisGroup = svg.append('g').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup.selectAll('line').attr('stroke', 'rgba(0, 0, 0, 0.2)');
    yAxisGroup
      .selectAll('text')
      .attr('opacity', 0.5)
      .attr('color', 'black')
      .attr('font-size', '0.75rem');

    const gLine = line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value));

    const lines = svg
      .selectAll('.line')
      .data(data)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 3)
      .attr('d', (d) => gLine(d.items));

    lines.each((d, i, nodes) => {
      const element = nodes[i];
      const length = element.getTotalLength();
      if (!prevItems.includes(d.name)) {
        select(element)
          .attr('stroke-dasharray', `${length},${length}`)
          .attr('stroke-dashoffset', length)
          .transition()
          .duration(750)
          .ease(easeLinear)
          .attr('stroke-dashoffset', 0);
      }
    });

    setPrevItems(data.map(({ name }) => name));
  }, [data]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default MultilineChart;
