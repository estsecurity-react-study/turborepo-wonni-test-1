import { useEffect, useCallback, useState, useMemo } from 'react';
import { select, scaleOrdinal, pie, arc, extent, schemeCategory10, interpolate } from 'd3';
import { Data, Dimensions } from './index';

interface IDonutChartProps {
  dimensions: Dimensions;
  data: Data[];
  propertiesNames: string[];
}

const getScales = (data: Data[], width: number, height: number, metric: string[]) => {
  return {
    color: scaleOrdinal()
      .domain(
        extent(data, (d) => {
          return d.name;
        }) as unknown as string,
      )
      .range(schemeCategory10),
  };
};

const DonutChart = (props: IDonutChartProps) => {
  const [loaded, setLoaded] = useState(false);

  const [prevHeight, setPrevHeight] = useState(props.dimensions.height);
  const [prevWidth, setPrevWidth] = useState(props.dimensions.width);

  const radius = useMemo(
    () =>
      Math.min(props.dimensions.width, props.dimensions.height) / 2 - props.dimensions.margin.left,
    [props.dimensions],
  );

  const memoizedDrawCallback = useCallback(() => {
    select('#chart-group').selectAll('*').remove();
  }, []);

  const memoizedUpdateCallback = useCallback(() => {
    const scales = getScales(
      props.data,
      props.dimensions.boundedWidth,
      props.dimensions.boundedHeight,
      props.propertiesNames,
    );
    const bounds = select('#bounds');

    const pieSvg = bounds
      .select('#chart-group')
      .append('svg')
      .attr('width', props.dimensions.width)
      .attr('height', props.dimensions.height)
      .append('g')
      .attr('transform', `translate(${props.dimensions.width / 2},${props.dimensions.height / 2})`);

    const pieGenerator = pie<any>()
      .value(({ value }) => value)
      .sort(null);

    const pieData = pieGenerator(props.data);

    const arcGenerator: any = arc()
      .cornerRadius(10)
      .padAngle(0.01)
      .innerRadius(radius * 0.55)
      .outerRadius(radius * 0.75);

    const outerArcForLabelsPosition = arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Draw Chart

    pieSvg
      .selectAll('allSlices')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      // @ts-ignore
      .attr('fill', (d) => {
        return scales.color(d.data.name);
      })

      .transition()
      .duration(700)
      .style('opacity', 0.7)
      .attrTween('d', function (d) {
        const i = interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arcGenerator(d);
        };
      });

    pieSvg
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * 0.55) // should be same as innerRadius value
      .attr('stroke', 'white')
      .attr('fill', 'transparent')
      .transition()
      .duration(700)
      .attr('stroke-width', 10);

    // Peripherals

    pieSvg
      .selectAll('allPolylines')
      .data(pieData)
      .enter()
      .append('polyline')
      .attr('fill', 'none')
      .transition()
      .duration(700)
      // @ts-ignore
      .attr('stroke', (d) => {
        return scales.color(d.data.name);
      })
      .attr('stroke-width', 1)
      // @ts-ignore
      .attr('points', (d) => {
        // @ts-ignore
        const posA = arcGenerator.centroid(d);
        // @ts-ignore
        const posB = outerArcForLabelsPosition.centroid(d);
        // @ts-ignore
        const posC = outerArcForLabelsPosition.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      });

    pieSvg
      .selectAll('allLabels')
      .data(pieData)
      .enter()
      .append('text')
      // @ts-ignore
      .text((d) => {
        return `${d.data.name} (${d.data.value})`;
      })
      .attr('transform', (d) => {
        // @ts-ignore
        const pos = outerArcForLabelsPosition.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('text-anchor', (d) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      })
      // @ts-ignore
      .attr('fill', (d) => {
        return scales.color(d.data.name);
      });
  }, [props.data, props.dimensions, props.propertiesNames]);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      memoizedDrawCallback();
    } else {
      memoizedUpdateCallback();
    }
  }, [loaded, memoizedDrawCallback, memoizedUpdateCallback]);

  useEffect(() => {
    const isNewHeight = prevHeight !== props.dimensions.height;
    const isNewWidth = prevWidth !== props.dimensions.width;
    if (isNewHeight || isNewWidth) {
      setPrevWidth(props.dimensions.height);
      setPrevHeight(props.dimensions.width);
      memoizedDrawCallback();
      memoizedUpdateCallback();
    }
  }, [
    memoizedDrawCallback,
    memoizedUpdateCallback,
    prevHeight,
    prevWidth,
    props.dimensions.height,
    props.dimensions.width,
  ]);

  return (
    <div id="div">
      <svg
        id="wrapper"
        width={props.dimensions.width}
        height={props.dimensions.height}
        style={{ overflow: 'visible', background: 'black' }}
      >
        <g
          id="bounds"
          style={{
            transform: `translate(${props.dimensions.margin.left}px, ${props.dimensions.margin.top}px)`,
          }}
        >
          <g id="chart-group" />
        </g>
      </svg>
    </div>
  );
};

export default DonutChart;
