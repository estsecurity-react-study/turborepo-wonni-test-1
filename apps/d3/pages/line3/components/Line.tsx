import { easeLinear, select, line } from 'd3';
import { useCallback, useEffect, useRef } from 'react';

const Line = ({
  xScale,
  yScale,
  color = 'white',
  data,
  isSmooth,
  animation = 'left',
  ...props
}: any) => {
  const ref = useRef<SVGGeometryElement | null>(null);

  const animateLeft = useCallback(() => {
    const totalLength = ref.current?.getTotalLength();

    select(ref.current)
      .attr('opacity', 1)
      .attr('stroke-dasharray', `${totalLength}, ${totalLength}`)
      .attr('stroke-dashoffset', totalLength!)
      .transition()
      .duration(750)
      .ease(easeLinear)
      .attr('stroke-dashoffset', 0);
  }, []);

  const animateFadeIn = useCallback(() => {
    select(ref.current).transition().duration(750).ease(easeLinear).attr('opacity', 1);
  }, []);

  const noneAnimation = useCallback(() => {
    select(ref.current).attr('opacity', 1);
  }, []);

  useEffect(() => {
    switch (animation) {
      case 'left':
        animateLeft();
        break;
      case 'fadeIn':
        animateFadeIn();
        break;
      case 'none':
      default:
        noneAnimation();
        break;
    }
  }, [animateLeft, animateFadeIn, noneAnimation, animation]);

  // Recalculate line length if scale has changed
  useEffect(() => {
    if (animation === 'left') {
      const totalLength = ref.current?.getTotalLength();
      select(ref.current).attr('stroke-dasharray', `${totalLength},${totalLength}`);
    }
  }, [xScale, yScale, animation]);

  const gLine = line()
    // @ts-ignore
    .x((d) => xScale(d.date))
    // @ts-ignore
    .y((d) => yScale(d.value));

  const d = gLine(data);

  return <path ref={ref} d={d} stroke={color} strokeWidth={3} fill="none" opacity={0} {...props} />;
};

export default Line;
