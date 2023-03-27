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
  line,
  min,
} from 'd3';
import { Data, Dimensions } from './index';

interface IDonutChartProps {
  dimensions: Dimensions;
  data: Data[];
  propertiesNames: string[];
}

const RadarChart = (props: IDonutChartProps) => {
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
    select('#radar').selectAll('g').exit().remove();
  }, []);

  const NUM_OF_LEVEL = 4;

  const maxValue = max(data, (d) => d.value) as number;
  const minValue = min(data, (d) => d.value) as number;
  const dataLength = data.length;

  const r = (0.8 * height) / 2;
  const polyangle = (Math.PI * 2) / dataLength;

  const offset = Math.PI;

  const generatePoint = ({ length, angle }: any) => {
    const point = {
      x: width / 2 + length * Math.sin(offset - angle),
      y: height / 2 + length * Math.cos(offset - angle),
    };
    return point;
  };

  const drawPath = (points: any, parent: any) => {
    const lineGenerator = line()
      .x((d) => d.x)
      .y((d) => d.y);

    parent
      .append('path')
      .attr('d', lineGenerator(points))
      .attr('fill', 'none')
      .attr('stroke', 'black');
  };

  const genTicks = (levels: number) => {
    const ticks = [];
    const step = maxValue / levels;
    for (let i = 0; i <= levels; i++) {
      const num = step * i;
      if (Number.isInteger(step)) {
        ticks.push(num);
      } else {
        ticks.push(num.toFixed(2));
      }
    }

    return ticks;
  };

  const ticks = genTicks(NUM_OF_LEVEL);

  const drawText = (text, point, isAxis, group) => {
    // console.log(text, point);
    if (isAxis) {
      const xSpacing = text.toString().includes('.') ? 30 : 22;
      group
        .append('text')
        .attr('x', point.x - xSpacing)
        .attr('y', point.y + 5)
        .html(text)
        .style('text-anchor', 'middle')
        .attr('fill', 'darkgrey')
        .style('font-size', '12px')
        .style('font-family', 'sans-serif');
    } else {
      group
        .append('text')
        .attr('x', point.x)
        .attr('y', point.y)
        .html(text)
        .style('text-anchor', 'middle')
        .attr('fill', 'darkgrey')
        .style('font-size', '12px')
        .style('font-family', 'sans-serif');
    }
  };

  const memoizedUpdateCallback = useCallback(() => {
    const radar = select('#radar');

    const scale = scaleLinear().domain([0, maxValue]).range([0, r]).nice();

    const barSvg = radar
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    for (let level = 1; level <= NUM_OF_LEVEL; level++) {
      const hyp = (level / NUM_OF_LEVEL) * r;
      const points = [];
      for (let vertex = 0; vertex < dataLength; vertex++) {
        const theta = vertex * polyangle;
        points.push(generatePoint({ length: hyp, angle: theta }));
      }
      const group = barSvg.select('.levels');
      drawPath([...points, points[0]], group);
    }

    const group = barSvg.select('.grid-lines');
    for (let vertex = 1; vertex <= dataLength; vertex++) {
      const theta = vertex * polyangle;
      const point = generatePoint({ length: r, angle: theta });
      drawPath(
        [
          {
            x: width / 2,
            y: height / 2,
          },
          point,
        ],
        group,
      );
    }

    const groupL = barSvg.select('.tick-lines');
    const point = generatePoint({ length: r, angle: 0 });
    drawPath(
      [
        {
          x: width / 2,
          y: height / 2,
        },
        point,
      ],
      groupL,
    );

    const groupT = barSvg.select('.ticks');
    ticks.forEach((d, i) => {
      const q = (i / NUM_OF_LEVEL) * r;
      const p = generatePoint({ length: q, angle: 0 });
      const points = [
        p,
        {
          ...p,
          x: p.x - 10,
        },
      ];
      drawPath(points, groupL);
      drawText(d, p, true, groupT);
    });

    const points: any[] = [];
    data.forEach((d, i) => {
      const len = scale(d.value);
      const theta = i * ((2 * Math.PI) / dataLength);
      points.push({
        ...generatePoint({ length: len, angle: theta }),
        value: d.value,
      });
    });

    console.log(points);

    const groups = barSvg.select('.shape');
    drawPath([...points, points[0]], groups);

    const groupsP = barSvg.select('.indic');
    groupsP
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 8);

    const groupLabels = barSvg.select('.labels');
    for (let vertex = 0; vertex < dataLength; vertex++) {
      const angle = vertex * polyangle;
      const label = data[vertex].name;
      const point = generatePoint({ length: 0.9 * (height / 2), angle });

      drawText(label, point, false, groupLabels);
    }
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
      id="radar"
      width={width}
      height={height}
      style={{
        overflow: 'visible',
        background: 'yellow',
      }}
    >
      <g className="levels" />
      <g className="grid-lines" />
      <g className="tick-lines" />
      <g className="ticks" />
      <g className="shape" />
      <g className="indic" />
      <g className="labels" />
    </svg>
  );
};

export default RadarChart;
