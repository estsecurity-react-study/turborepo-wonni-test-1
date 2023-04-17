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
  axisTop,
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

  const xAxis = axisBottom(xScale) as any;

  const createBarChart = useCallback(
    (width: number, height: number) => {
      const svg = select(svgRef.current).attr('width', width).attr('height', height);

      const container = svg
        .selectAll('g')
        .data([null])
        .join('g')
        .attr('id', 'group')
        .attr('transform', `translate(${margin.top}, ${margin.left})`);

      // container
      //   .selectAll('rect')
      //   .data(campaign, (d) => {
      //     return d.count;
      //   })
      //   .join(
      //     function (enter) {
      //       return enter.append('rect');
      //     },
      //     function (update) {
      //       return update;
      //     },
      //     function (exit) {
      //       return exit.remove();
      //     },
      //   );

      svg
        .select('.x-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .transition()
        .duration(1000)
        .call(xAxis);
      // .call((g) =>
      //   g
      //     .selectAll('.tick line')
      //     .attr('stroke-opacity', 0.1)
      //     .attr('y2', -height + margin.top + margin.bottom),
      // );
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
        <g className="x-axis" />
      </svg>
    </div>
  );
}
