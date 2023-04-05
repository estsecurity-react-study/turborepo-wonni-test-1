import { axisBottom, axisLeft, easeLinear, select } from 'd3';
import { useEffect, useRef } from 'react';

/** GridLine.js */
const GridLine = ({
  type,
  scale,
  ticks = 0,
  size = 0,
  transform = '',
  disableAnimation = false,
  ...props
}: any) => {
  const ref = useRef<SVGGeometryElement | null>(null);
  useEffect(() => {
    const axisGenerator = type === 'vertical' ? axisBottom : axisLeft;
    const axis = axisGenerator(scale).ticks(ticks).tickSize(-size);

    const gridGroup = select(ref.current);
    if (disableAnimation) {
      // @ts-ignore
      gridGroup.call(axis);
    } else {
      // @ts-ignore
      gridGroup.transition().duration(750).ease(easeLinear).call(axis);
    }
    gridGroup.select('.domain').remove();
    gridGroup.selectAll('text').remove();
    gridGroup.selectAll('line').attr('stroke', 'rgba(255, 255, 255, 0.2)');
  }, [scale, ticks, size, disableAnimation]);

  return <g ref={ref} transform={transform} {...props} />;
};

export default GridLine;
