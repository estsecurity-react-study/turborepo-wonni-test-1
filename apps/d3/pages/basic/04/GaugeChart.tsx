import { useEffect, useRef } from 'react'
import { select, arc, pie, interpolate } from 'd3'
import { useResizeObserver } from './useResizeObserver'

function GaugeChart({ data }) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const dimensions: any = useResizeObserver(wrapperRef)

  useEffect(() => {
    const svg = select(svgRef.current)
    if (!dimensions) return

    const arcGenerator = arc().innerRadius(75).outerRadius(150)

    const pieGenerator = pie()
      .startAngle(-0.5 * Math.PI)
      .endAngle(0.5 * Math.PI)
      .sort(null)

    const instructions = pieGenerator(data)

    svg
      .selectAll('.slice')
      .data(instructions)
      .join('path')
      .attr('class', 'slice')
      .attr('fill', (instruction, index) => (index === 0 ? '#ffcc00' : '#999'))
      .style('transform', `translate(${dimensions.width / 2}px, ${dimensions.height}px)`)
      .transition()
      .attrTween('d', function (nextInstruction, index) {
        const initialInstruction = pieGenerator([0, 1])[index]
        const interpolator = interpolate(
          this.lastInstruction || initialInstruction,
          nextInstruction,
        )
        this.lastInstruction = interpolator(1)
        return function (t) {
          return arcGenerator(interpolator(t))
        }
      })
  }, [data, dimensions])

  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default GaugeChart
