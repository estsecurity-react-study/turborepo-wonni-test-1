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

  const createBarChart = useCallback(
    (width: number, height: number) => {
      const svg = select(svgRef.current).attr('viewBox', [0, 0, width, height]);

      // const data = getRandomData();

      const colorScale = scaleOrdinal(schemePaired);

      svg
        .select('.y-axis')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call((g) =>
          g
            .selectAll('.tick line')
            .attr('stroke-opacity', 0.3)
            .attr('x2', width - (margin.left + margin.right)),
        )
        .transition()
        .call(yAxis)
        .call((g) =>
          g
            .selectAll('.tick line')
            .attr('stroke-opacity', 0.3)
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
          return (
            enter
              .append('rect')
              // .attr('x', (d) => xScale(d.date) || null)
              // .attr('width', xScale.bandwidth())
              .attr('y', height - margin.bottom)
              .attr('height', 0)
            // .attr('fill', 'orange')
          );
        },
        (update) => {
          return update
            .attr('x', (d) => xScale(d.date) || null)
            .attr('width', xScale.bandwidth())
            .attr('fill', (_, i) => colorScale(String(i)))
            .transition()
            .attr('height', (d) => yScale(0) - yScale(d.count))
            .attr('y', (d) => yScale(d.count));
        },
        (exit) => {
          return exit.remove();
        },
      );
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
      >
        <text className="y-text" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}
