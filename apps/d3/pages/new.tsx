import { useEffect, useRef } from 'react';
import { axisBottom, axisLeft, scaleBand, scaleLinear, select, max, pointer } from 'd3';
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

  const yLabel = 'y축 제목이 나오는 곳';
  const campaign: campaignProps[] = [
    { date: 'May 5 2017', count: 19 },
    { date: 'May 7 2017', count: 26 },
    { date: 'Jun 11 2017', count: 9 },
    { date: 'Jun 25 2017', count: 36 },
    { date: 'Jul 2 2017', count: 17 },
    { date: 'Jul 5 2017', count: 23 },
    { date: 'Jul 7 2017', count: 51 },
    { date: 'Jul 10 2017', count: 32 },
    { date: 'Jul 15 2017', count: 13 },
    { date: 'Jul 17 2017', count: 3 },
  ];

  useEffect(() => {
    if (!size || !campaign) {
      return;
    }
    const { width } = size;

    const svg = select(svgRef.current).attr('viewBox', [0, 0, width, height]);

    const everything = svg.selectAll('*');
    everything.remove();

    const container = svg
      .append('g')
      .classed('container', true)
      .attr('transform', `translate(${margin.top}, ${margin.left})`);

    const xScale = scaleBand()
      .domain(campaign.map((d) => d.date))
      .rangeRound([margin.left, width - margin.right - margin.left])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, Number(max(campaign, (d) => d.count)) + 10])
      .range([height - margin.top - margin.bottom, margin.top]);

    const xAxis = axisBottom(xScale) as any;

    const yAxis = (axisLeft(yScale) as any).ticks(10);

    container
      .append('g')
      .classed('yAxis', true)
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis)
      .call((g) =>
        g
          .selectAll('.tick line')
          .attr('stroke-opacity', 0.1)
          .attr('x2', width - margin.left - (margin.left + margin.right)),
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', -margin.left)
          .attr('y', margin.top - margin.top)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(yLabel),
      );

    container
      .append('g')
      .classed('xAxis', true)
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .call(xAxis);

    const rects = container
      .append('g')
      .classed('rect', true)
      .attr('transform', `translate(0, 0)`)
      .selectAll('rect')
      .data(campaign);

    rects
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.date) || null)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('y', height - (margin.top + margin.bottom))
      .transition()
      .duration(300)
      .attr('height', (d) => height - (margin.top + margin.bottom) - yScale(d.count))
      .attr('y', (d) => yScale(d.count))
      .attr('fill', 'orange');

    rects.on('mouseenter', (event, value) => {
      console.log(value);
      // container
      //   .selectAll('.tooltip')
      //   .data([value])
      //   .join((enter) => enter.append('text').attr('y', yScale(value.count) - 4))
      //   .attr('class', 'tooltip')
      //   .text(value.count + '건')
      //   .attr('x', (d) => (xScale(d.date) as any) + xScale.bandwidth() / 2 || null)
      //   .attr('text-anchor', 'middle') // svg에서 텍스트 정렬
      //   .transition()
      //   .attr('y', yScale(value.count) - 10)
      //   .attr('opacity', 1);
    });
    // .on('mouseleave', () =>
    //   container.select('.tooltip').transition().attr('y', 0).attr('opacity', 0).remove(),
    // );
  }, [campaign, size]);

  return (
    <div ref={rootRef}>
      <svg
        ref={svgRef}
        width={size.width}
        height={height}
        style={{ overflow: 'visible', background: 'yellow' }}
      ></svg>
    </div>
  );
}
