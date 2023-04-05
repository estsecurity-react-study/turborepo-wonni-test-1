import { forwardRef, ReactNode } from 'react';

const Overlay = forwardRef(
  (
    { width, height, children }: { width: number; height: number; children: ReactNode },
    ref: any,
  ) => {
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
  },
);

export default Overlay;
