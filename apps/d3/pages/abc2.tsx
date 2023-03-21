import { useCallback, useEffect, useRef } from 'react';
import { axisBottom, axisLeft, scaleBand, scaleLinear, select, max, pointer, shuffle } from 'd3';
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
    { date: 'Jun 25 2017', count: 36 },
    { date: 'Jul 2 2017', count: 17 },
    { date: 'Jul 5 2017', count: 23 },
    { date: 'Jul 7 2017', count: 51 },
    { date: 'Jul 10 2017', count: 32 },
    { date: 'Jul 15 2017', count: 13 },
    { date: 'Jul 17 2017', count: 3 },
    { date: 'Jul 21 2017', count: 14 },
    { date: 'Jul 25 2017', count: 39 },
  ];

  const createBarChart = useCallback(
    (width: number, height: number) => {
      const svg = select(svgRef.current).attr('viewBox', [0, 0, width, height]);

      const t = svg.transition().delay(400).duration(500);

      svg
        .selectAll('text')
        .data(campaign)
        .join((enter) =>
          enter
            .append('g')
            .attr('transform', (_, i) => `translate(${10},${350})`)
            .style('opacity', 0)
            .call((g) =>
              g
                .transition()
                .duration(1000)
                .attr('transform', (_, i) => `translate(${10},${10 + i * 30})`)
                .style('opacity', 1),
            )
            .call((g) =>
              g
                .append('rect')
                .attr('width', 280)
                .attr('height', 25)
                .style('fill', 'gold')
                .style('opacity', 0.7)
                .attr('rx', 10),
            )
            .call((g) =>
              g
                .append('text')
                .attr('x', 5)
                .attr('dy', '1.2em')
                .style('font-size', 14)
                .style('font-family', 'sans-serif')
                .text((d) => `${d.date} - ${d.count}`)
                .raise(),
            ),
        );
    },
    [campaign, margin],
  );

  useEffect(() => {
    if (!size || !campaign) {
      return;
    }
    const { width } = size;

    createBarChart(width, height);
  }, [createBarChart, campaign, size]);

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
