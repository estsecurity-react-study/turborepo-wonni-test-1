import { useCallback, useEffect, useRef, useMemo } from 'react';
import {
  axisBottom,
  axisLeft,
  scaleBand,
  scaleLinear,
  select,
  max,
  pointer,
  scaleOrdinal,
  schemePaired,
} from 'd3';
import { useResize } from '../useResize';

interface campaignProps {
  score?: number;
  date: string;
  count: number;
}

export default function D3() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const size = useResize(rootRef);
  const height = 400;

  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  const yLabel = 'testtest';

  const campaign: campaignProps[] = [
    { date: 'May 5 2017', count: 20 },
    { date: 'May 7 2017', count: 55 },
    { date: 'Jun 11 2017', count: 11 },
    { date: 'Jun 25 2017', count: 23 },
    { date: 'Jul 2 2017', count: 14 },
    { date: 'Jul 5 2017', count: 25 },
    { date: 'Jul 7 2017', count: 34 },
    { date: 'Jul 10 2017', count: 52 },
    { date: 'Jul 15 2017', count: 45 },
    { date: 'Jul 17 2017', count: 37 },
  ];

  const random = (max: number) => Math.floor(Math.random() * max + 1);

  function getRandomData() {
    const count = random(campaign.length);
    const shuffled = campaign.sort(() => 0.5 - Math.random());
    const data = shuffled.slice(0, count);
    data.sort((f1, f2) => f1.date.localeCompare(f2.date));
    for (const item of data) {
      item.score = random(10);
    }
    return data;
  }

  const xScale = useMemo(
    () =>
      scaleBand<string>()
        .domain(campaign.map((d) => d.date))
        .round(true)
        .rangeRound([margin.left, size.width - margin.right])
        .padding(0.2),
    [campaign],
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>()
        .domain([0, Number(max(campaign, (d) => d.count)) + 10])
        .range([height - margin.bottom, margin.top]),

    [campaign],
  );

  const enterRects = (enter: any) => {
    enter
      .append('rect')
      .attr('x', (d: campaignProps) => xScale(d.date) || null)
      .attr('width', xScale.bandwidth())
      .attr('y', height - margin.bottom)
      .attr('height', 0)
      .attr('fill', 'orange')
      .selection();
  };

  const xAxis = axisBottom(xScale) as any;

  const yAxis = (axisLeft(yScale) as any).ticks(campaign.length).tickSizeInner(0).tickSizeOuter(0);

  const createBarChart = useCallback(
    (width: number, height: number) => {
      const svg = select(svgRef.current).attr('viewBox', [0, 0, width, height]);

      // const data = getRandomData();

      const colorScale = scaleOrdinal(schemePaired);

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
        .select('.x-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .transition()
        .call(xAxis);

      const rects = svg.selectAll('rect').data(campaign);

      rects.join(
        (enter) => {
          console.log('enter');
          return enterRects(enter) as any;
        },
        (update) => {
          console.log('update');
          return update
            .transition()
            .attr('x', (d) => xScale(d.date) || null)
            .attr('height', (d) => yScale(0) - yScale(d.count))
            .attr('y', (d) => yScale(d.count))
            .attr('width', xScale.bandwidth())
            .attr('fill', (_, i) => colorScale(String(i)))
            .selection();
        },
        (exit) => {
          console.log('exit');
          return exit
            .transition()
            .attr('height', 0)
            .attr('y', height - margin.bottom)
            .remove();
        },
      );
    },
    [campaign],
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