import tw, { css } from 'twin.macro';
import { useEffect, useRef } from 'react';
import { axisBottom, axisLeft, scaleBand, scaleLinear, select, max, local, pointer } from 'd3';
import { useResize } from './useResize';

interface campaignProps {
  date: string;
  count: number;
}

export default function D3() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const size = useResize(rootRef);
  const height = 400;

  const margin = { top: 25, right: 25, bottom: 25, left: 25 };

  const yLabel = 'testtest';
  const campaign: campaignProps[] = [
    { date: 'May 5 2017', count: 19 },
    { date: 'May 7 2017', count: 26 },
    { date: 'Jun 11 2017', count: 31 },
    { date: 'Jun 25 2017', count: 36 },
    { date: 'Jul 2 2017', count: 17 },
    { date: 'Jul 5 2017', count: 23 },
    { date: 'Jul 7 2017', count: 41 },
    { date: 'Jul 10 2017', count: 32 },
    { date: 'Jul 15 2017', count: 14 },
  ];

  useEffect(() => {
    if (!size || !campaign) {
      return;
    }
    const { width } = size;

    const xScale = scaleBand()
      .domain(campaign.map((d) => d.date))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, Number(max(campaign, (d) => d.count)) + 10])
      .range([height - margin.bottom, margin.top]);

    const svg = select(svgRef.current).attr('viewBox', [0, 0, width, height]);

    const xAxis = axisBottom(xScale) as any;
    svg
      .select('.x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    const yAxis = (axisLeft(yScale) as any).ticks(10);
    svg
      .select('.y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis)
      .call((g) =>
        g
          .selectAll('.tick line')
          .attr('stroke-opacity', 0.2)
          .attr('x2', width - margin.left - margin.right),
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', -margin.left)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(yLabel),
      );

    const rects = svg.selectAll('rect').data(campaign);

    rects.exit().transition().duration(400).attr('height', 0).attr('y', height).remove();

    rects
      .attr('x', (d) => xScale(d.date) || null)
      .transition()
      .delay(300)
      .attr('y', (d) => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.count))
      .attr('fill', 'orange');

    rects
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.date) || null)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('y', height)
      .transition()
      .delay(400)
      .duration(500)
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.count))
      .attr('y', (d) => yScale(d.count))
      .attr('fill', 'orange');

    rects
      .on('mouseenter', (event, value) => {
        svg
          .selectAll('.tooltip')
          .data([value])
          .join((enter) => enter.append('text').attr('y', yScale(value.count) - 4))
          .attr('class', 'tooltip')
          .text(value.count)
          .attr('x', (d) => (xScale(d.date) as any) + xScale.bandwidth() / 2 || null)
          .attr('text-anchor', 'middle') // svg에서 텍스트 정렬
          .transition()
          .attr('y', yScale(value.count) - 10)
          .attr('opacity', 1);
      })
      .on('mouseleave', () => svg.select('.tooltip').remove());

    // svg
    //   .selectAll('rect')
    //   .data(campaign)
    //   .enter()
    //   .append('rect')
    //   .attr('class', 'bar')
    //   .attr('x', (d) => xScale(d.date) || null)
    //   .attr('y', (d) => yScale(d.count))
    //   .attr('width', xScale.bandwidth())
    //   .attr('height', (d) => yScale(0) - yScale(d.count))
    //   .attr('fill', '#fd4d61');
    // .on('mouseenter', (event, value) => {
    //   // console.log(value);
    //   // const index = svg.selectAll('.bar').nodes().indexOf(event.target);
    //   // let index = campaign.indexOf(value);
    //   // console.log(index, value);
    //   // console.log(pointer(event));
    //   // const index = svg.selectAll('.bar').nodes().indexOf(event.currentTarget);
    //   // console.log(index, value);

    //   svg
    //     .selectAll('.tooltip')
    //     .data([value])
    //     .join((enter) => enter.append('text').attr('y', yScale(value.count) - 4))
    //     .attr('class', 'tooltip')
    //     .text(value.count)
    //     .attr('x', (d) => (xScale(d.date) as any) + xScale.bandwidth() / 2 || null)
    //     .attr('text-anchor', 'middle') // svg에서 텍스트 정렬
    //     .transition()
    //     .attr('y', yScale(value.count) - 10)
    //     .attr('opacity', 1);
    // })
    // .on('mouseleave', () => svg.select('.tooltip').remove());
  }, [campaign, size]);

  return (
    <div ref={rootRef}>
      <svg
        ref={svgRef}
        width={size.width}
        height={height}
        style={{ overflow: 'visible', background: 'yellow' }}
      >
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}
