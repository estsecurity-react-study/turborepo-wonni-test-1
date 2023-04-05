import { useEffect, useMemo, useRef } from 'react';
import { area, easeBackIn, select } from 'd3';

const Area = ({ xScale, yScale, color = 'white', data, disableAnimation, ...props }: any) => {
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (disableAnimation) {
      select(ref.current).attr('opacity', 1);
      return;
    }
    select(ref.current).transition().duration(750).ease(easeBackIn).attr('opacity', 1);
  }, [disableAnimation]);

  const d = useMemo(() => {
    const areas = area()
      .x(({ date }) => xScale(date))
      .y1(({ value }) => yScale(value))
      .y0(() => yScale(yScale.domain()[0]));
    return areas(data);
  }, [xScale, yScale, data]);

  return (
    <>
      <path ref={ref} d={d} fill={`url(#gradient-${color})`} opacity={0} {...props} />
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
    </>
  );
};

export default Area;
