import { useEffect, useRef, useState } from 'react'
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3'

export default function Basic() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75])
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const svg = select(svgRef.current).attr('width', '500px').attr('height', '300px')

    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, 500])
      .padding(0.5)

    const yScale = scaleLinear().domain([0, 150]).range([300, 0])

    const colorScale = scaleLinear()
      .domain([75, 100, 150])
      .range(['green', 'orange', 'red'])
      .clamp(true)

    const xAxis = axisBottom(xScale).ticks(data.length)
    svg
      .select('.x-axis')
      .style('transform', 'translateY(300px')
      .call(xAxis as any)

    const yAxis = axisRight(yScale)
    svg
      .select('.y-axis')
      .style('transform', 'translateX(500px')
      .call(yAxis as any)

    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .style('transform', 'scale(1,-1)')
      .attr('x', (_, index) => xScale(index))
      .attr('y', -300)
      .attr('width', xScale.bandwidth())
      .on('mouseenter', (event, value) => {
        // events have changed in d3 v6:
        // https://observablehq.com/@d3/d3v6-migration-guide#events
        const index = svg.selectAll('.bar').nodes().indexOf(event.target)
        svg
          .selectAll('.tooltip')
          .data([value])
          .join((enter) => enter.append('text').attr('y', yScale(value) - 4))
          .attr('class', 'tooltip')
          .text(value)
          .attr('x', xScale(index) + xScale.bandwidth() / 2)
          .attr('text-anchor', 'middle')
          .transition()
          .attr('y', yScale(value) - 8)
          .attr('opacity', 1)
      })
      .on('mouseleave', () => svg.select('.tooltip').remove())
      .transition()
      .attr('fill', colorScale)
      .attr('height', (value) => 300 - yScale(value))
  }, [data])
  return (
    <div id="root">
      <svg ref={svgRef} style={{ background: '#eee', overflow: 'visible' }}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <button onClick={() => setData(data.map((value) => value + 5))}>Update data</button>
      <button onClick={() => setData(data.filter((value) => value < 35))}>Filter data</button>
      <button onClick={() => setData([...data, Math.round(Math.random() * 100)])}>Add data</button>
    </div>
  )
}
