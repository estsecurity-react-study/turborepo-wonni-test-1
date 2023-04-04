import { useEffect, useCallback, useState, useMemo } from 'react';
import { scaleLinear, select, max, pointer, line, transition, easeLinear } from 'd3';
import { Data, Dimensions } from './index';

interface IDonutChartProps {
  name: string;
  dimensions: Dimensions;
  data: Data[];
  propertiesNames: string[];
}

const RadarChart = (props: IDonutChartProps) => {
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

  const NUM_OF_LEVEL = 5;
  const maxValue = max(data, (d) => d.value) as number;
  // const minValue = min(data, (d) => d.value) as number;
  const dataLength = data.length;
  const r = (0.8 * height) / 2;
  const polyangle = (Math.PI * 2) / dataLength;
  const offset = Math.PI;
  const step = maxValue / NUM_OF_LEVEL;
  const scale = scaleLinear().domain([0, maxValue]).range([0, r]).nice();

  function t() {
    return transition().duration(1000).ease(easeLinear);
  }

  const memoizedDrawCallback = useCallback(() => {
    // resize가 안 일어나면 여기 안들어옴
    // 데이터만 바뀌는 경우 여기 안들어옴
    select(name).selectAll('g').exit().remove();
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

  const tickLabelPosition = (i: number, c: number) => {
    const q = (i / NUM_OF_LEVEL) * r;
    const p = generatePoint({ length: q, angle: 0 });
    return c === 0 ? p[c] - 10 : p[1] + 5;
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

  const linePointPosition = (d: any, i: number) => {
    const len = scale(d.value as number);
    const theta = i * ((2 * Math.PI) / dataLength);
    const p = generatePoint({ length: len, angle: theta });
    return `translate(${p[0]},${p[1]})`;
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
    const radar = select(`#${name}`);

    const barSvg = radar
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const levelLine = barSvg
      .select('.levels')
      .selectAll('path')
      .data(Array.from(Array(NUM_OF_LEVEL).keys()));

    levelLine.join(
      (enter) => {
        return enter
          .append('path')
          .attr('class', 'line')
          .attr('d', lineGroup)
          .attr('fill', 'none')
          .attr('stroke', '#ddd')
          .style('opacity', 0)
          .attr('stroke-width', '0px')
          .transition(t)
          .style('opacity', 1)
          .attr('stroke-width', '1px')
          .selection();
      },
      (update) => {
        return update
          .transition(t)
          .attr('d', lineGroup)
          .style('opacity', 1)
          .attr('stroke-width', '1px')
          .selection();
      },
      (exit) => {
        return exit
          .transition(t)
          .attr('d', lineGroup)
          .style('opacity', 0)
          .attr('stroke-width', '0')
          .remove();
      },
    );

    const grid = barSvg.select('.grid-lines').selectAll('path').data(data);
    grid.join(
      (enter) => {
        return enter
          .append('path')
          .attr('class', 'grid')
          .attr('d', gridGroup)
          .attr('fill', 'none')
          .style('opacity', 0)
          .attr('stroke', '#ddd')
          .attr('stroke-width', '0px')
          .transition(t)
          .style('opacity', 1)
          .attr('stroke-width', '1px')
          .selection();
      },
      (update) => {
        return update
          .transition(t)
          .attr('d', gridGroup)
          .style('opacity', 1)
          .attr('stroke-width', '1px')
          .selection();
      },
      (exit) => {
        return exit.transition(t).style('opacity', 0).attr('stroke-width', '0px').remove();
      },
    );

    const tickLines = barSvg.select('.ticks-lines').selectAll('path').data([null]);
    tickLines.join(
      (enter) => {
        return enter
          .append('path')
          .attr('class', 'tick_line')
          .attr('d', tickLine)
          .attr('fill', 'none')
          .style('opacity', '0')
          .transition(t)
          .attr('stroke', 'rgb(244, 117, 96)')
          .style('opacity', '1')
          .selection();
      },
      (update) => {
        return update.attr('d', tickLine).transition(t).style('opacity', '1').selection();
      },
      (exit) => {
        return exit.transition(t).style('opacity', 0).remove();
      },
    );

    const ticks = barSvg
      .select('.ticks')
      .selectAll('path')
      .data(Array.from(Array(NUM_OF_LEVEL + 1).keys()));

    ticks.join(
      (enter) => {
        return enter
          .append('path')
          .attr('class', 'tick')
          .style('opacity', 0)
          .transition(t)
          .attr('d', tick)
          .attr('fill', 'none')
          .style('opacity', '1')
          .attr('stroke', 'rgb(244, 117, 96)')
          .selection();
      },
      (update) => {
        return update.attr('d', tick).transition(t).style('opacity', 1).selection();
      },
      (exit) => {
        return exit.transition(t).style('opacity', 0).remove();
      },
    );

    const tickLabel = barSvg
      .select('.ticks-labels')
      .selectAll('text')
      .data(Array.from(Array(NUM_OF_LEVEL + 1).keys()));

    tickLabel.join(
      (enter) => {
        return enter
          .append('text')
          .attr('class', 'tickLabel')
          .attr('x', (_, i) => tickLabelPosition(i, 0))
          .attr('y', (_, i) => tickLabelPosition(i, 1))
          .style('opacity', 0)
          .transition(t)
          .style('opacity', 1)
          .attr('fill', 'rgb(133, 154, 168)')
          .attr('text-anchor', 'end')
          .attr('font-size', '11px')
          .text(tickLabels as unknown as string)
          .selection();
      },
      (update) => {
        return update
          .attr('x', (_, i) => tickLabelPosition(i, 0))
          .attr('y', (_, i) => tickLabelPosition(i, 1))
          .style('opacity', 0)
          .transition(t)
          .style('opacity', 1)
          .text(tickLabels as unknown as string)
          .selection();
      },
      (exit) => {
        return exit.transition(t).remove();
      },
    );

    const tickShape = barSvg.select('.shape').selectAll('path').data([null]);

    tickShape.join(
      (enter) => {
        return enter
          .append('path')
          .attr('class', 'shape')
          .attr('d', shapeDraw)
          .style('stroke', 'rgba(232, 193, 160, 0)')
          .style('fill', 'rgba(232, 193, 160, 0)')
          .attr('stroke-width', 2)
          .style('fill-opacity', 0)
          .transition(t)
          .style('stroke', 'rgba(232, 193, 160, 1)')
          .style('fill', 'rgba(232, 193, 160,1)')
          .style('fill-opacity', 0.25)
          .selection();
      },
      (update) => {
        return update.transition(t).attr('d', shapeDraw).style('fill-opacity', 0.25).selection();
      },
      (exit) => {
        return exit.transition(t).style('fill-opacity', 0).remove();
      },
    );

    const groups = barSvg.select('.indic').selectAll('g').data(data);

    const groupsEnter = groups.enter().append('g');

    groupsEnter
      .style('opacity', 0)
      .attr('transform', (d, i) => linePointPosition(d, i))
      //@ts-ignore
      .merge(groups)
      .transition(t)
      .style('opacity', 1)
      .attr('transform', (d, i) => linePointPosition(d, i));

    groups.exit().transition(t).style('opacity', 0).remove();

    groupsEnter
      .append('circle')
      .merge(groups.select('circle'))
      .attr('r', 5)
      .attr('fill', 'white')
      .style('stroke', 'rgb(244, 117, 96)')
      .style('stroke-width', 2);

    groupsEnter
      .append('text')
      .merge(groups.select('text'))
      .attr('y', -12)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('stroke-width', '3px')
      .attr('stroke', 'white')
      .attr('paint-order', 'stroke')
      .attr('stroke-linecap', 'butt')
      .attr('stroke-linejoin', 'miter')
      .text(({ value }) => value!);

    const labels = barSvg.select('.labels').selectAll('text').data(data);
    labels.join(
      (enter) => {
        return (
          enter
            .append('text')
            .attr('class', 'label')
            .attr('text-anchor', labelPosion)
            .attr('font-size', '11px')
            //@ts-ignore
            .text((d) => d.name)
            .attr('x', (_, i) => pointLabels(i, 0))
            .attr('y', (_, i) => pointLabels(i, 1))
            .attr('fill', 'rgb(73, 85, 93)')
            .style('opacity', 0)
            .transition(t)
            .style('opacity', 1)
            .selection()
        );
      },
      (update) => {
        return (
          update
            // .style('opacity', 0)
            //@ts-ignore
            .text((d) => d.name)
            .attr('text-anchor', labelPosion)
            .transition(t)
            .style('opacity', 1)
            .attr('x', (_, i) => pointLabels(i, 0))
            .attr('y', (_, i) => pointLabels(i, 1))
            .selection()
        );
      },
      (exit) => {
        return (
          exit
            //@ts-ignore
            .text((d) => d.name)
            .transition(t)
            .attr('text-anchor', labelPosion)
            .attr('x', (_, i) => pointLabels(i, 0))
            .attr('y', (_, i) => pointLabels(i, 1))
            .style('opacity', 0)
            .remove()
        );
      },
    );
  }, [NUM_OF_LEVEL, data, width, height, marginTop, marginRight, marginBottom, marginLeft]);

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
      }}
    >
      <g className="levels" />
      <g className="grid-lines" />
      <g className="ticks-lines" />
      <g className="ticks" />
      <g className="ticks-labels" />
      <g className="shape" />
      <g className="indic" />
      <g className="labels" />
    </svg>
  );
};

export default RadarChart;
