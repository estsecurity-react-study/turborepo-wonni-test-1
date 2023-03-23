import { useEffect, useCallback, useState, useMemo } from 'react';
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
import { Data, Dimensions } from './index';

interface IDonutChartProps {
  dimensions: Dimensions;
  data: Data[];
  propertiesNames: string[];
}

const HorizontalBarChart = (props: IDonutChartProps) => {
  const {
    data,
    dimensions: {
      width,
      height,
      margin: { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft },
    },
  } = props;

  const [loaded, setLoaded] = useState(false);

  const memoizedDrawCallback = useCallback(() => {
    // resize가 안 일어나면 여기 안들어옴
    // 데이터만 바뀌는 경우 여기 안들어옴
    select('#wrapper').selectAll('rect').exit().remove();
  }, []);

  // const xScale = useMemo(
  //   () =>
  //     scaleBand()
  //       // @ts-ignore
  //       .domain(data.map((d) => d.name))
  //       .round(true)
  //       .rangeRound([marginLeft, width - marginRight])
  //       .padding(0.2),
  //   [data, width, marginLeft, marginRight],
  // );

  // const yScale = useMemo(
  //   () =>
  //     scaleLinear()
  //       // @ts-ignore
  //       .domain([0, Number(max(data, (d) => d.value)) + 10])
  //       .range([height - marginBottom, marginTop]),

  //   [data],
  // );

  // const enterRects = (enter: any) => {
  //   enter
  //     .append('rect')
  //     // @ts-ignore
  //     .attr('x', (d) => xScale(d.date) || null)
  //     .attr('width', xScale.bandwidth())
  //     .attr('y', height - marginBottom)
  //     .attr('height', 0)
  //     .attr('fill', 'orange')
  //     .selection();
  // };

  const wrap = useMemo(
    () => (text: any) => {
      text.each(function (_: any, i: number, n: any) {
        let text = select(n[i]);
        let words = text.text().split(/\s+/).reverse();
        let lineHeight = 16;
        let width = parseFloat(text.attr('width'));
        let y = parseFloat(text.attr('y'));
        let x = text.attr('x');
        let anchor = text.attr('text-anchor');

        let tspan = text
          .text(null)
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('text-anchor', anchor);
        let lineNumber = 0;
        let line: string[] = [];
        let word = words.pop();

        while (word) {
          line.push(word);
          tspan.text(line.join(' '));
          // @ts-ignore
          if (tspan.node().getComputedTextLength() > width) {
            lineNumber += 1;
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text
              .append('tspan')
              .attr('x', x)
              .attr('y', y + lineNumber * lineHeight)
              .attr('anchor', anchor)
              .text(word);
          }
          word = words.pop();
        }
      });
    },
    [data],
  );

  const mouseover = (event, d) => {
    const mousePosition = pointer(event);
    console.log(mousePosition, d);
  };

  const memoizedUpdateCallback = useCallback(() => {
    const bar = select('#wrapper');

    const xMaxValue = max(data, (d) => d.value);

    const xScale = scaleLinear()
      // @ts-ignore
      .domain([0, xMaxValue])
      .range([marginLeft, width - marginRight]);

    const yScale = scaleBand()
      // @ts-ignore
      .domain(data.map((d) => d.name))
      .round(true)
      .rangeRound([marginTop, height - marginBottom])
      .padding(0.2);

    const barSvg = bar
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const xAxis = axisBottom(xScale).ticks(10) as any;

    const yAxis = (axisLeft(yScale) as any).ticks(data.length).tickSizeInner(0).tickSizeOuter(0);

    barSvg.select('.y-axis').attr('transform', `translate(${marginLeft}, 0)`).call(yAxis);

    barSvg
      .select('.x-axis')
      .attr('transform', `translate(0, ${height - marginBottom})`)
      .transition()
      .call(xAxis)
      .call((g) =>
        g
          .selectAll('.tick line')
          .attr('stroke-opacity', 0.1)
          .attr('y2', -height + marginTop + marginBottom),
      );

    barSvg.select('.title').remove();

    barSvg
      .append('text')
      .attr('class', 'title')
      .attr('x', width - marginRight)
      .attr('y', marginTop)
      .attr('font-size', '12px')
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'end')
      .text('d3 horizontal bar');

    barSvg.selectAll('.y-axis text').attr('width', `${marginLeft}`).attr('y', 0).call(wrap);

    const rects = barSvg.selectAll('rect').data(data);

    rects
      .join('rect')
      .attr('class', 'bar')
      .attr('x', marginLeft)
      // @ts-ignore
      .attr('y', (d) => yScale(d.name))
      .attr('height', yScale.bandwidth())
      .transition()
      .duration(500)
      // @ts-ignore
      .attr('width', ({ value }) => xScale(value) - marginLeft)
      .attr('fill', 'orange');

    rects.on('mouseover', mouseover);

    // rects.join(
    //   (enter) => {
    //     return (
    //       enter
    //         .append('rect')
    //         .attr('class', 'bar')
    //         // @ts-ignore
    //         .attr('x', xScale(0) || null)
    //         // @ts-ignore
    //         .attr('y', (d) => yScale(d.name))
    //         // @ts-ignore
    //         .attr('width', (d) => xScale(d.value))
    //         .attr('height', yScale.bandwidth())
    //     );
    //   },
    // (update) => {
    //   return (
    //     update
    //       .transition()
    //       // @ts-ignore
    //       .attr('x', (d) => xScale(d.name) || null)
    //       // @ts-ignore
    //       .attr('height', (d) => yScale(0) - yScale(d.value))
    //       // @ts-ignore
    //       .attr('y', (d) => yScale(d.value))
    //       .attr('width', xScale.bandwidth())
    //       .attr('fill', 'orange')
    //       .selection()
    //   );
    // },
    // (exit) => {
    //   return exit
    //     .transition()
    //     .attr('height', 0)
    //     .attr('y', height - marginBottom)
    //     .remove();
    // },
    // );
  }, [data, width, height, marginTop, marginRight, marginBottom, marginLeft]);

  useEffect(() => {
    // 데이터만 바뀌는 경우 true
    if (!loaded) {
      setLoaded(true);
      console.log('여기');
      memoizedDrawCallback();
    } else {
      console.log('저기');
      memoizedUpdateCallback();
    }
  }, [loaded, memoizedDrawCallback, memoizedUpdateCallback]);

  useEffect(() => {
    // 리사이즈 일 때
    memoizedDrawCallback();
    memoizedUpdateCallback();
  }, [width, height]);

  return (
    <svg
      id="wrapper"
      width={width}
      height={height}
      style={{
        overflow: 'visible',
        background: 'yellow',
      }}
    >
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
};

export default HorizontalBarChart;
