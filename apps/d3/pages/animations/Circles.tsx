import { useEffect, useRef, useState } from 'react';
import { select } from 'd3';
import debounce from 'lodash/debounce';

export default function Circles({ data }: { data: number[] }) {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    function updateWidth() {
      setWidth(containerRef.current!.clientWidth / (data.length + 1));
    }
    const handleResize = debounce(updateWidth, 500);
    updateWidth();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data.length]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const update = select('g').selectAll<SVGCircleElement, number[]>('circle').data<number>(data);

      update
        .enter()
        .append('circle')
        .merge(update)
        .attr('r', (d) => d)
        .attr('cx', (_, i) => width * (i + 1))
        .attr('cy', () => Math.random() * 100)
        .attr('stroke', (_, i) => (i % 2 === 0 ? '#f80' : '#aaf'))
        .attr('fill', (_, i) => (i % 2 === 0 ? 'orange' : '#44f'));

      update.exit().remove();
    }
  }, [data, width]);

  return (
    <svg
      width="100%"
      height="350"
      ref={containerRef}
      style={{ overflow: 'visible', background: 'yellow' }}
    >
      <g transform="translate(0, 100)" />
    </svg>
  );
}
