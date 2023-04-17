import { useEffect, useRef } from 'react';
import data from './data';
import { select } from 'd3';

const EX2 = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = select(svgRef.current);

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      })
      .attr('r', function (d) {
        return d.val;
      })
      .attr('fill', function (d) {
        return d.color;
      });
  }, [data]);

  return (
    <div>
      <h1>EX 2</h1>
      <h2>D3사용하여 렌더링하기</h2>
      <svg
        ref={svgRef}
        style={{ overflow: 'visible', background: 'yellow', width: '600px', height: '400px' }}
      ></svg>
    </div>
  );
};

export default EX2;
