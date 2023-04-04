import { Line, Axis, GridLine, Overlay, Tooltip, Area } from '../components';
import useController from './MultilineChart.controller';
import useDimensions from '../utils/useDimensions';
import { useRef } from 'react';
import { margin } from '../../bar/data';

const MultilineChart = ({ data, dimensions }: any) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const {
    margin: { top, left, right, bottom },
  } = dimensions;

  const [containerRef, { svgWidth, svgHeight, width, height }]: any = useDimensions({
    maxHeight: 400,
    margin,
  });

  const controller = useController({ data, width, height });

  const { yTickFormat, xTickFormat, xScale, yScale, yScaleForAxis } = controller;

  return (
    <div ref={containerRef}>
      <svg width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <GridLine
            type="vertical"
            scale={xScale}
            ticks={5}
            size={height}
            transform={`translate(0, ${height})`}
          />
          <GridLine type="horizontal" scale={yScaleForAxis} ticks={2} size={width} />
          <GridLine
            type="horizontal"
            className="baseGridLine"
            scale={yScale}
            ticks={1}
            size={width}
            disableAnimation
          />
          {data.map(({ name, items = [], color }) => (
            <Line key={name} data={items} xScale={xScale} yScale={yScale} color={color} />
          ))}
          <Area data={data[0].items} xScale={xScale} yScale={yScale} />
          <Axis
            type="left"
            scale={yScaleForAxis}
            transform="translate(0, -10)"
            ticks={5}
            tickFormat={yTickFormat}
          />
          <Overlay ref={overlayRef} width={width} height={height}>
            <Axis
              type="bottom"
              className="axisX"
              anchorEl={overlayRef.current}
              scale={xScale}
              transform={`translate(10, ${height - height / 6})`}
              ticks={5}
              tickFormat={xTickFormat}
            />
            <Tooltip
              className="tooltip"
              anchorEl={overlayRef.current}
              width={width}
              height={height}
              margin={margin}
              xScale={xScale}
              yScale={yScale}
              data={data}
            />
          </Overlay>
        </g>
      </svg>
    </div>
  );
};

export default MultilineChart;
