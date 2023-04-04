import { forwardRef } from 'react';

const Overlay = forwardRef(({ width, height, children }, ref) => {
  return (
    <g>
      {children}
      <rect
        ref={ref}
        width={width >= 0 ? width : 0}
        height={height >= 0 ? height : 0}
        opacity={0}
      />
    </g>
  );
});

export default Overlay;
