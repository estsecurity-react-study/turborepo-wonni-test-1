import { useEffect, useCallback, useState, useMemo } from 'react';
import { select, scaleOrdinal, pie, arc, extent, schemeCategory10, interpolate } from 'd3';
import { Data, Dimensions } from './index';

interface IDonutChartProps {
  dimensions: Dimensions;
  data: Data[];
  propertiesNames: string[];
}

const DonutChart = (props: IDonutChartProps) => {
  const [loaded, setLoaded] = useState(false);

  const [prevHeight, setPrevHeight] = useState(props.dimensions.height);
  const [prevWidth, setPrevWidth] = useState(props.dimensions.width);

  const getScales = useMemo(
    () => (data: Data[], width: number, height: number, metric: string[]) => {
      return {
        color: scaleOrdinal()
          .domain(
            extent(data, (d) => {
              return d.name;
            }) as unknown as string,
          )
          .range(schemeCategory10),
      };
    },
    [props.data.length],
  );

  const scales = useMemo(
    () =>
      getScales(
        props.data,
        props.dimensions.boundedWidth,
        props.dimensions.boundedHeight,
        props.propertiesNames,
      ),
    [
      props.data,
      props.dimensions.boundedWidth,
      props.dimensions.boundedHeight,
      props.propertiesNames,
    ],
  );

  const radius = useMemo(
    () =>
      Math.min(props.dimensions.width, props.dimensions.height) / 2 - props.dimensions.margin.left,
    [props.dimensions],
  );

  const pieGenerator = useMemo(
    () =>
      pie<any>()
        .value(({ value }) => value)
        .sort(null),
    [props.data],
  );

  const memoizedDrawCallback = useCallback(() => {
    // resize가 안 일어나면 여기 안들어옴
    // 데이터만 바뀌는 경우 여기 안들어옴
    select('#chart-group').selectAll('*').remove();
  }, []);

  const memoizedUpdateCallback = useCallback(() => {
    const bounds = select('#bounds');

    const pieSvg = bounds
      .attr('width', props.dimensions.width)
      .attr('height', props.dimensions.height)
      .attr('transform', `translate(${props.dimensions.width / 2},${props.dimensions.height / 2})`);

    const pieData = pieGenerator(props.data);

    const arcGenerator: any = arc()
      .cornerRadius(10)
      .padAngle(0.01)
      .innerRadius(radius * 0.35)
      .outerRadius(radius * 0.75);

    const outerArcForLabelsPosition = arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Draw Chart

    pieSvg
      .selectAll('path')
      .data(pieData)
      .join(
        (enter) => {
          return (
            enter
              .append('path')
              .attr('d', arcGenerator)
              // @ts-ignore
              .attr('fill', (d) => {
                return scales.color(d.data.name);
              })
              .transition()
              .duration(400)
              .style('opacity', 0.5)
              .attrTween('d', function (d) {
                const i = interpolate(d.startAngle, d.endAngle);
                return function (t) {
                  d.endAngle = i(t);
                  return arcGenerator(d);
                };
              }) as any
          );
        },
        (update) => {
          return update.transition().duration(400).attr('d', arcGenerator).style('opacity', 0.5);
        },
        (exit) => {
          return exit.remove();
        },
      );

    pieSvg
      .selectAll('text')
      .data(pieData)
      .join(
        (enter) => {
          return enter
            .append('text')
            .attr('transform', function (d) {
              return `translate(${arcGenerator.centroid(d)})`;
            })
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', 'white')
            .style('opacity', 0)
            .transition()
            .duration(700)
            .style('opacity', 1)
            .text((d) => {
              return `${d.data.value}`;
            }) as any;
        },
        (update) => {
          return update
            .transition()
            .duration(400)
            .attr('transform', function (d) {
              return `translate(${arcGenerator.centroid(d)})`;
            })
            .style('opacity', 1)
            .text((d) => {
              return `${d.data.value}`;
            }) as any;
        },
        (exit) => {
          return exit.remove();
        },
      );

    // pieSvg
    //   .selectAll('legend')
    //   .data(pieData)
    //   .enter()
    //   .append('text')
    //   .attr('transform', function (d) {
    //     return `translate(${arcGenerator.centroid(d)})`;
    //   })
    //   .attr('text-anchor', 'middle')
    //   .attr('font-size', '14px')
    //   .attr('fill', 'white')
    //   .style('opacity', 0)
    //   .transition()
    //   .duration(700)
    //   .style('opacity', 1)
    //   .text((d) => {
    //     return `${d.data.value}`;
    //   });

    // pieSvg
    //   .append('circle')
    //   .attr('cx', 0)
    //   .attr('cy', 0)
    //   .attr('r', radius * 0.35)
    //   .attr('stroke', 'white')
    //   .attr('fill', 'transparent')
    //   .transition()
    //   .attr('stroke-width', 10);

    // // Peripherals

    // pieSvg
    //   .selectAll('allPolylines')
    //   .data(pieData)
    //   .enter()
    //   .append('polyline')
    //   .attr('fill', 'none')
    //   .transition()
    //   .duration(700)
    //   // @ts-ignore
    //   .attr('stroke', (d) => {
    //     return scales.color(d.data.name);
    //   })
    //   .attr('stroke-width', 1)
    //   // @ts-ignore
    //   .attr('points', (d) => {
    //     // @ts-ignore
    //     const posA = arcGenerator.centroid(d);
    //     // @ts-ignore
    //     const posB = outerArcForLabelsPosition.centroid(d);
    //     // @ts-ignore
    //     const posC = outerArcForLabelsPosition.centroid(d);
    //     const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    //     posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
    //     return [posA, posB, posC];
    //   });

    // pieSvg
    //   .selectAll('allLabels')
    //   .data(pieData)
    //   .enter()
    //   .append('text')
    //   // @ts-ignore
    //   .text((d) => {
    //     return `${d.data.name}`;
    //   })
    //   .attr('transform', (d) => {
    //     // @ts-ignore
    //     const pos = outerArcForLabelsPosition.centroid(d);
    //     const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    //     pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
    //     return `translate(${pos})`;
    //   })
    //   .attr('text-anchor', (d) => {
    //     const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    //     return midAngle < Math.PI ? 'start' : 'end';
    //   })
    //   // @ts-ignore
    //   .attr('fill', (d) => {
    //     return scales.color(d.data.name);
    //   });
  }, [props.data, props.dimensions, props.propertiesNames]);

  // useEffect(() => {
  //   // 데이터만 바뀌는 경우 true
  //   console.log('===============', loaded, '================');
  //   if (!loaded) {
  //     setLoaded(true);
  //     memoizedDrawCallback();
  //   } else {
  //     memoizedUpdateCallback();
  //   }
  // }, [loaded, memoizedDrawCallback, memoizedUpdateCallback]);

  // useEffect(() => {
  //   const isNewHeight = prevHeight !== props.dimensions.height;
  //   const isNewWidth = prevWidth !== props.dimensions.width;
  //   if (isNewHeight || isNewWidth) {
  //     setPrevWidth(props.dimensions.height);
  //     setPrevHeight(props.dimensions.width);
  //     memoizedDrawCallback();
  //     memoizedUpdateCallback();
  //   }
  // }, [
  //   memoizedDrawCallback,
  //   memoizedUpdateCallback,
  //   prevHeight,
  //   prevWidth,
  //   props.dimensions.height,
  //   props.dimensions.width,
  // ]);

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
    const isNewWidth = prevWidth !== props.dimensions.width;
    const isNewHeight = prevHeight !== props.dimensions.height;
    if (isNewHeight || isNewWidth) {
      // 리사이트 일 때
      setPrevWidth(props.dimensions.height);
      setPrevHeight(props.dimensions.width);
      memoizedDrawCallback();
      memoizedUpdateCallback();
    }
  }, [
    memoizedDrawCallback,
    memoizedUpdateCallback,
    props.dimensions.width,
    props.dimensions.height,
    prevHeight,
    prevHeight,
  ]);

  return (
    <div id="div">
      <svg
        id="wrapper"
        width={props.dimensions.width}
        height={props.dimensions.height}
        style={{
          overflow: 'visible',
          background: 'black',
          transform: `translate(${props.dimensions.margin.left}px, ${props.dimensions.margin.top}px)`,
        }}
      >
        <g id="bounds"></g>
      </svg>
    </div>
  );
};

export default DonutChart;