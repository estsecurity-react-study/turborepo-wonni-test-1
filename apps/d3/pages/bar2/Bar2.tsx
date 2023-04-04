import { useEffect, useCallback, useState, useMemo } from 'react';
import {
  scaleLinear,
  select,
  map,
  InternSet,
  max,
  pointer,
  line,
  transition,
  easeLinear,
  axisBottom,
  scaleBand,
  range,
  axisLeft,
} from 'd3';
import { Data, Dimensions } from './index';

interface IDonutChartProps {
  name: string;
  dimensions: Dimensions;
  data: Data[];
  propertiesNames: string[];
}

const Bar2 = (props: IDonutChartProps) => {
  const {
    name,
    data,
    dimensions: {
      width,
      height,
      margin: { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft },
    },
  } = props;

  const [loaded, setLoaded] = useState(false);

  function t() {
    return transition().duration(1000).ease(easeLinear);
  }

  const xDomain = new InternSet(map(data, (d) => d.date));

  const xRange = [marginLeft, width - marginRight];
  const xPadding = 0.1;

  const xScale = scaleBand(xDomain, xRange).padding(xPadding);
  const xAxis = axisBottom(xScale).tickSizeOuter(0);

  const yScale = scaleLinear()
    .domain([0, Number(max(data, (d) => d.count)) + 10])
    .range([height - marginBottom, marginTop]);

  const yAxis = axisLeft(yScale).ticks(data.length);

  function grid(tick: any) {
    return tick
      .append('line')
      .attr('class', 'grid')
      .attr('x2', width - marginLeft - marginRight)
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.1);
  }

  const memoizedDrawCallback = useCallback(() => {
    // resize가 안 일어나면 여기 안들어옴
    // 데이터만 바뀌는 경우 여기 안들어옴
    select(name).exit().remove();
  }, []);

  const memoizedUpdateCallback = useCallback(() => {
    const radar = select(`#${name}`);

    const barSvg = radar
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const xGroup = barSvg
      .append('g')
      .attr('transform', `translate(0, ${height - marginBottom})`)
      .call(xAxis);

    const yGroup = barSvg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(yAxis)
      // .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick').call(grid))
      .call((g) =>
        g
          .append('text')
          .attr('x', -marginLeft)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text('test'),
      );
  }, [data, width, height, marginTop, marginRight, marginBottom, marginLeft]);

  // useEffect(() => {
  //   // 데이터만 바뀌는 경우 true
  //   if (!loaded) {
  //     setLoaded(true);
  //     console.log('여기');
  //     memoizedDrawCallback();
  //   } else {
  //     console.log('저기');
  //     memoizedUpdateCallback();
  //   }
  // }, [loaded, memoizedDrawCallback, memoizedUpdateCallback]);

  // useEffect(() => {
  //   // 리사이즈 일 때
  //   memoizedDrawCallback();
  //   memoizedUpdateCallback();
  // }, [width, height]);

  useEffect(() => {
    memoizedDrawCallback();
    memoizedUpdateCallback();
  }, [data]);

  return (
    <svg
      id={name}
      width={width}
      height={height}
      style={{
        overflow: 'visible',
        background: 'white',
        border: '1px',
        borderColor: '#ccc',
        borderStyle: 'solid',
      }}
    ></svg>
  );
};

export default Bar2;
