import { useRef } from 'react';
import useResize from './useResize';

const useDimensions = ({ maxHeight, margin }: { maxHeight: number; margin: any }) => {
  const ref = useRef(null);
  const { width } = useResize(ref);
  const scaleCoef = 0.5;

  const height = !maxHeight || width * scaleCoef < maxHeight ? width * scaleCoef : maxHeight;
  const innerWidth = width - (margin.left || 0) - (margin.right || 0);
  const innerHeight = height - (margin.top || 0) - (margin.bottom || 0);

  return [
    ref,
    {
      svgWidth: width,
      svgHeight: height,
      width: innerWidth,
      height: innerHeight,
    },
  ];
};

export default useDimensions;
