import { useEffect, useCallback, useState, useMemo } from 'react';
import { scaleLinear, select, max, pointer, line, min, range, easeLinear } from 'd3';
import { Data, Dimensions } from './index';

interface IDonutChartProps {
  dimensions: Dimensions;
  data: Data[];
  propertiesNames: string[];
}

const GeneralUpdatePattern = (props: IDonutChartProps) => {
  const {
    data,
    dimensions: {
      width,
      height,
      margin: { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft },
    },
  } = props;

  const [loaded, setLoaded] = useState(false);

  const dataLength = data.length;

  const memoizedDrawCallback = useCallback(() => {
    // resize가 안 일어나면 여기 안들어옴
    // 데이터만 바뀌는 경우 여기 안들어옴
    select('#radarChart').selectAll('g').exit().remove();
  }, []);

  const memoizedUpdateCallback = useCallback(() => {
    const pattern = select('#pattern');

    const barSvg = pattern
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    barSvg
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .style('stroke', 'rgba(232, 193, 160,1)')
      .attr('d', (d) => d.value);
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
      id="pattern"
      width={width}
      height={height}
      style={{
        overflow: 'visible',
        background: 'white',
      }}
    >
      <g className="point" />
    </svg>
  );
};

export default GeneralUpdatePattern;
