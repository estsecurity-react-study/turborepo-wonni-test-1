import React, { useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const useResize = (ref: HTMLDivElement | null) => {
  const [dimensions, setDimensions] = React.useState(null);
  useEffect(() => {
    const element = ref.current;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        return setDimensions(entry.contentRect);
      });
    });
    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      resizeObserver.unobserve(element);
    };
  }, [ref]);
  return (
    dimensions || {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    }
  );
};

export default useResize;
