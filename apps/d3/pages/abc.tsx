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

      // svg.attr('width', 960).attr('height', 500);

      // svg
      //   .selectAll('text')
      //   .data(campaign)
      //   .join(
      //     (enter) =>
      //       enter
      //         .append('text')
      //         .attr('fill', 'green')
      //         .attr('x', (d, i) => i * 20)
      //         .attr('y', 0)
      //         .text((d) => d.count)
      //         .call((enter) => {
      //           console.log(enter);
      //           return enter.transition(t).attr('y', 0);
      //         }),
      //     (update) =>
      //       update
      //         .attr('fill', 'red')
      //         .attr('y', 30)
      //         .call((update) => update.transition(t).attr('x', (d, i) => i * 30)),
      //     (exit) =>
      //       exit.attr('fill', 'brown').call((exit) => exit.transition(t).attr('y', 30).remove()),
      //   );

      // svg
      //   .selectAll('text')
      //   .data(campaign)
      //   .join(
      //     (enter) =>
      //       enter
      //         .append('text')
      //         .attr('fill', 'green')
      //         .attr('x', (d, i) => i * 20)
      //         .attr('y', 0)
      //         .text((d) => d.count)
      //         .call((enter) => {
      //           return enter.transition(t).attr('y', margin.top);
      //         }),
      //     (update) =>
      //       update
      //         .attr('fill', 'red')
      //         .attr('y', margin.top)
      //         .call((update) => update.transition(t).attr('x', (d, i) => i * 30)),
      //     (exit) =>
      //       exit.attr('fill', 'brown').call((exit) => exit.transition(t).attr('y', 0).remove()),
      //   );

      svg
        .selectAll('text')
        .data(campaign)
        .join(
          (enter) =>
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
                  .style('fill', (_, i) => {
                    if (i == 0) return 'gold';
                    else if (i == 1) return 'silver';
                    else if (i == 2) return '#cd7f32';
                    else return 'white';
                  })
                  .style('opacity', 0.8)
                  .attr('rx', 3),
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
          (update) =>
            update
              .call(
                (g) => g.transition().duration(1000),
                // .attr('transform', (_, i) => `translate(${10},${10 + i * 30})`),
              )
              .call((g) => g.select('text').text((d) => `${d.date} - ${d.count}`))
              .call((g) =>
                g
                  .select('rect')
                  .transition()
                  .duration(1000)
                  .style('fill', (_, i) => {
                    if (i == 0) return 'gold';
                    else if (i == 1) return 'silver';
                    else if (i == 2) return '#cd7f32';
                    else return 'white';
                  }),
              ),
          (exit) =>
            exit.call((g) =>
              g
                .transition()
                .duration(1000)
                .attr('transform', (_, i) => `translate(${10},${350})`)
                .style('opacity', 0)
                .remove(),
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
