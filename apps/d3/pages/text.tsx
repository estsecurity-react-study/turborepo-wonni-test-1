import { useCallback, useEffect, useRef } from 'react';
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

  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  const yLabel = 'y축 제목이 나오는 곳';
  const campaign: campaignProps[] = [
    { date: 'May 5 2017', count: 19 },
    { date: 'May 7 2017', count: 26 },
    { date: 'Jun 11 2017', count: 9 },
    // { date: 'Jun 25 2017', count: 36 },
    { date: 'Jul 2 2017', count: 17 },
    { date: 'Jul 5 2017', count: 23 },
    { date: 'Jul 7 2017', count: 51 },
    { date: 'Jul 10 2017', count: 32 },
    { date: 'Jul 15 2017', count: 5 },
    { date: 'Jul 17 2017', count: 13 },
  ];

  const createBarChart = useCallback(
    (width: number, height: number) => {
      const svg = select(svgRef.current).attr('viewBox', [0, 0, width, height]);

      const xScale = scaleBand()
        .domain(campaign.map((d) => d.date))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.2);

      const yScale = scaleLinear()
        .domain([0, Number(max(campaign, (d) => d.count)) + 10])
        .range([height - margin.bottom, margin.top]);

      const xAxis = axisBottom(xScale) as any;

      const yAxis = (axisLeft(yScale) as any)
        .ticks(campaign.length)
        .tickSizeInner(0)
        .tickSizeOuter(0);

      svg
        .select('.y-axis')
        .attr('transform', `translate(${margin.left}, 0)`)
        .transition()
        .call(yAxis)
        .call((g) =>
          g
            .selectAll('.tick line')
            .attr('stroke-opacity', 0.1)
            .attr('x2', width - (margin.left + margin.right)),
        );

      svg
        .select('.y-text')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .attr('y', 30)
        .attr('x', -margin.top)
        .text(yLabel);

      svg
        .select('.x-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .transition()
        .call(xAxis);

      const rects = svg.selectAll('rect').data(campaign);

      rects
        .exit()
        .transition()
        .attr('height', 0)
        .attr('y', height - margin.bottom)
        .remove();

      rects
        .transition()
        .attr('x', (d) => xScale(d.date) || null)
        .attr('height', (d) => yScale(0) - yScale(d.count))
        .attr('y', (d) => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('fill', 'orange');

      rects
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.date) || null)
        .attr('width', xScale.bandwidth())
        .attr('y', height - margin.bottom)
        .attr('height', 0)
        .attr('fill', 'orange');
    },
    [campaign, margin],
  );

  useEffect(() => {
    if (!size || !campaign) {
      return;
    }
    const { width } = size;

    createBarChart(width, height);
    return () => {
      createBarChart(width, height);
    };
  }, [createBarChart, campaign.length, size]);

  return (
    <div ref={rootRef}>
      <svg
        ref={svgRef}
        width={size.width}
        height={height}
        style={{ overflow: 'visible', background: 'yellow' }}
      >
        <text className="y-text" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}
