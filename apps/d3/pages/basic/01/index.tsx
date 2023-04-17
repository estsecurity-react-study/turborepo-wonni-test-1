import { useEffect, useRef, useState } from 'react'
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3'

export default function Basic() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75])
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const svg = select(svgRef.current)
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, 300])

    const yScale = scaleLinear().domain([0, 150]).range([150, 0])

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index) => index + 1)
    svg
      .select('.x-axis')
      .style('transform', 'translateY(150px')
      .call(xAxis as any)

    const yAxis = axisRight(yScale)
    svg
      .select('.y-axis')
      .style('transform', 'translateX(300px')
      .call(yAxis as any)

    const myLine = line<number>()
      .x((_, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal)

    svg
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('class', 'line')
      .attr('d', myLine)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
  }, [data])
  return (
    <>
      <svg ref={svgRef} style={{ background: '#eee', overflow: 'visible' }}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <br />
      <br />
      <button onClick={() => setData(data.map((value) => value + 5))}>Update data</button>
      &nbsp;&nbsp;
      <button onClick={() => setData(data.filter((value) => value < 35))}>Filter data</button>
    </>
  )
}
