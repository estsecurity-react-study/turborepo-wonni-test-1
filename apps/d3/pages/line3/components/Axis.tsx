import { axisBottom, axisRight, bisector, easeLinear, pointer, select } from 'd3';
import { useEffect, useRef } from 'react';

const Axis = ({
  type,
  scale,
  ticks,
  transform,
  tickFormat,
  disableAnimation,
  anchorEl,
  ...props
}: any) => {
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const axisGenerator = type === 'left' ? axisRight : axisBottom;
    const axis = axisGenerator(scale).ticks(ticks).tickFormat(tickFormat);
    const axisGroup = select(ref.current) as any;
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

  useEffect(() => {
    select(anchorEl)
      .on('mouseout.axisX', () => {
        select(ref.current).selectAll('text').attr('opacity', 0.5).style('font-weight', 'normal');
      })
      .on('mousemove.axisX', () => {
        const [x] = pointer(event, anchorEl);
        const xDate = scale.invert(x);
        const textElements = select(ref.current).selectAll('text');
        const data = textElements.data();
        const index = bisector((d) => d).left(data, xDate);
        // console.log(index);
        textElements
          .attr('opacity', (_, i) => (i === index - 1 ? 1 : 0.5))
          .style('font-weight', (_, i) => (i === index - 1 ? 'bold' : 'normal'));
      });
  }, [anchorEl, scale]);

  return <g ref={ref} className="axisText" transform={transform} {...props} />;
};

export default Axis;
