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

  const NUM_OF_LEVEL = 5;
  const maxValue = max(data, (d) => d.value) as number;
  // const minValue = min(data, (d) => d.value) as number;
  const dataLength = data.length;
  const r = (0.8 * height) / 2;
  const polyangle = (Math.PI * 2) / dataLength;
  const offset = Math.PI;
  const step = maxValue / NUM_OF_LEVEL;
  const scale = scaleLinear().domain([0, maxValue]).range([0, r]).nice();

  const memoizedDrawCallback = useCallback(() => {
    // resize가 안 일어나면 여기 안들어옴
    // 데이터만 바뀌는 경우 여기 안들어옴
    select('#radarChart').selectAll('g').exit().remove();
  }, []);

  const generatePoint = useMemo(
    () =>
      ({ length, angle }: any) => {
        const point = [
          width / 2 + length * Math.sin(offset - angle),
          height / 2 + length * Math.cos(offset - angle),
        ];
        return point;
      },
    [width, height, offset],
  );

  const lineGroup = (_: any, i: number) => {
    const hyp = ((i + 1) / NUM_OF_LEVEL) * r;
    const points = Array.from(Array(dataLength).keys()).reduce((a, index): any => {
      const theta = index * polyangle;
      const b = generatePoint({ length: hyp, angle: theta });
      return [...a, b];
    }, []);
    return line()([...points, points[0]]);
  };

  const gridGroup = (_: any, i: number) => {
    const theta = (i + 1) * polyangle;
    const point = generatePoint({ length: r, angle: theta });
    // @ts-ignore
    return line()([[width / 2, height / 2], point]);
  };

  const tickLine = () => {
    const point = generatePoint({ length: r, angle: 0 });
    // @ts-ignore
    return line()([[width / 2, height / 2], point]);
  };

  const tick = (_: any, i: number) => {
    const q = (i / NUM_OF_LEVEL) * r;
    const p = generatePoint({ length: q, angle: 0 });
    const points = [p, [p[0] - 6, p[1]]];
    // @ts-ignore
    return line()(points);
  };

  const tickLabelPosition = (d: any, i: number) => {
    const len = scale(d.value as number);
    const theta = i * ((2 * Math.PI) / dataLength);
    const p = generatePoint({ length: len, angle: theta });
    return `translate(${p[0]},${p[1]})`;
  };

  const tickLabels = (i: number) => {
    const ticks = [];
    const num = step * i;
    if (Number.isInteger(step)) {
      ticks.push(num);
    } else {
      ticks.push(num.toFixed(2));
    }
    return ticks;
  };

  const shapeDraw = useMemo(
    () => () => {
      const points = Array.from(data).reduce((acc, cur, index): any => {
        const len = scale(cur.value as number);
        const theta = index * ((2 * Math.PI) / dataLength);
        const p = generatePoint({ length: len, angle: theta });
        // value 안 더함
        // console.log(cur.value);
        return [...acc, p];
      }, []);
      return line()([...points, points[0]]);
    },
    [data, dataLength, scale],
  );

  const linePointPosition = (d: any, i: number, c: number) => {
    const len = scale(d.value as number);
    const theta = i * ((2 * Math.PI) / dataLength);
    const point = generatePoint({ length: len, angle: theta });
    return point[c];
  };

  const pointLabels = (i: number, c: number) => {
    const angle = i * polyangle;
    const point = generatePoint({ length: 0.9 * (height / 2), angle });
    return point[c];
  };

  const labelPosion = (_: any, i: number) => {
    const theta = i * polyangle;
    const point = generatePoint({ length: r, angle: theta });
    if (Math.floor(point[0]) === width / 2) return 'middle';
    return Math.floor(point[0]) >= width / 2 ? 'start' : 'end';
  };

  const memoizedUpdateCallback = useCallback(() => {
    const pattern = select('#pattern');

    const barSvg = pattern
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const pointGroup = barSvg.select('.point');

    const groups = pointGroup.selectAll('g').data(data);

    const groupsEnter = groups.enter().append('g');

    groupsEnter
      .style('opacity', 0)
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      //@ts-ignore
      .merge(groups)
      .transition()
      .ease(easeLinear)
      .style('opacity', 1)
      .attr('transform', (d, i) => tickLabelPosition(d, i));

    groups.exit().transition().ease(easeLinear).style('opacity', 0).remove();

    groupsEnter
      .append('circle')
      .attr('r', 5)
      .merge(groups.select('circle'))
      .attr('fill', ({ value }) => (value! > 5 ? 'red' : 'yellow'));

    groupsEnter
      .append('text')
      .merge(groups.select('text'))
      .attr('y', -12)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(({ value }) => value!);

    // const main = barSvg.select('.test2');
    // const groups = main.selectAll('g');
    // const s = groups.data(data);

    // s.attr('transform', (d, i) => tickLabelPosition(d, i));

    // const l = s
    //   .enter()
    //   .append('g')
    //   .attr('transform', (d, i) => tickLabelPosition(d, i));

    // l.append('circle').attr('r', '5').attr('fill', 'red');
    // l.append('text').text((d: any) => {
    //   console.log(d.value);
    //   return d.value;
    // });

    // s.exit().remove();
  }, [NUM_OF_LEVEL, data, width, height, marginTop, marginRight, marginBottom, marginLeft]);

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
