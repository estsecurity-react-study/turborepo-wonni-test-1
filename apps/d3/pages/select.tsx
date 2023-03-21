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
    { date: 'Jun 25 2017', count: 36 },
    { date: 'Jul 2 2017', count: 17 },
    { date: 'Jul 5 2017', count: 23 },
    { date: 'Jul 7 2017', count: 51 },
    { date: 'Jul 10 2017', count: 32 },
    { date: 'Jul 15 2017', count: 13 },
    { date: 'Jul 17 2017', count: 3 },
  ];

  const createBarChart = useCallback(
    (width: number, height: number) => {
      const svg = select(svgRef.current).attr('viewBox', [0, 0, width, height]);

      /** 
      1. 추가로 해서 그리고
      2. 다시 업어서 그린다
       */

      // svg
      //   .selectAll('g') // 2
      //   .data(campaign) // 3
      //   .enter() // 4
      //   .append('g') // 5
      //   .text((d) => d.count);

      // svg
      //   .selectAll('g') // 2
      //   .data(campaign) // 3
      //   .text((d) => d.count);

      // svg
      //   .selectAll('g')
      //   .data(campaign)
      //   .attr('transform', 'translate(20,20)')
      //   .text((d) => d.count);

      // 기존의 데이터 제외하고 업데이트
      // svg
      //   .selectAll('g')
      //   .data(campaign)
      //   .enter()
      //   .append('g')
      //   .attr('transform', 'translate(20,20)')
      //   .text((d) => d.count);

      // 기존의 데이터를 지우고 업데이트
      svg
        .selectAll('text')
        .data(campaign)
        .join('text')
        .attr('fill', 'green')
        .attr('x', (_, i) => i * 20)
        .attr('y', margin.top)
        .text((d) => d.count);
    },
    [campaign, margin],
  );

  useEffect(() => {
    if (!size || !campaign) {
      return;
    }
    const { width } = size;

    createBarChart(width, height);
  }, [createBarChart, campaign.length, size]);

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
