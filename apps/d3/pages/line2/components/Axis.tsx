import { axisBottom, axisLeft, easeLinear, select } from 'd3';
import { useEffect, useRef } from 'react';

const Axis = ({ type, scale, ticks, transform, tickFormat, disableAnimation, ...props }) => {
  const ref = useRef(null);
  useEffect(() => {
    const axisGenerator = type === 'left' ? axisLeft : axisBottom;
    const axis = axisGenerator(scale).ticks(ticks).tickFormat(tickFormat);
    const axisGroup = select(ref.current);
    if (disableAnimation) {
      axisGroup.call(axis);
    } else {
      axisGroup.transition().duration(750).ease(easeLinear).call(axis);
    }
    axisGroup.select('.domain').remove();
    axisGroup.selectAll('line').remove();
    axisGroup
      .selectAll('text')
      .attr('opacity', 0.5)
      .attr('color', 'white')
      .attr('font-size', '0.75rem');
  }, [scale, ticks, tickFormat, disableAnimation]);

  return <g ref={ref} transform={transform} {...props} />;
};

export default Axis;
