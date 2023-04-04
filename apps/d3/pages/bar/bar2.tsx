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
  transition,
} from 'd3';
import { useResize } from '../useResize';
import { campaign, margin } from './data';

export default function D3() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const size = useResize(rootRef);
  const height = 400;

  const xScale = useMemo(
    () =>
      scaleBand<string>()
        .domain(campaign.map((d) => d.date))
        .round(true)
        .rangeRound([margin.left, size.width - margin.right])
        .padding(0.2),
    [campaign, size, margin],
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>()
        .domain([0, Number(max(campaign, (d) => d.count)) + 10])
        .range([height - margin.bottom, margin.top]),

    [campaign, margin, height],
  );

  const xAxis = axisBottom(xScale) as any;

  const yAxis = (axisLeft(yScale) as any).ticks(campaign.length).tickSizeInner(0).tickSizeOuter(0);

  const colorScale = scaleOrdinal(schemePaired);

  const createBarChart = useCallback(
    (width: number, height: number) => {
      const svg = select(svgRef.current).attr('width', width).attr('height', height);

      const container = svg
        .append('g')
        .classed('container', true)
        .attr('transform', `translate(${margin.top}, ${margin.left})`);

      const labelsGroup = container.append('g').classed('bar-labels', true);

      const xAxisGroup = container
        .append('g')
        .classed('axis', true)
        .style('transform', `translateY(${height}px)`);

      const barsGroup = container.append('g').classed('bars', true);
    },
    [campaign, size, margin],
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
