import { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import {
  scaleLinear,
  select,
  max,
  pointer,
  line,
  transition,
  easeLinear,
  scaleOrdinal,
  schemePaired,
} from 'd3'
import { Data } from './data'
import { useResizeObserver } from './useResizeObserver'

const RadarChart = ({ data }: { data: Data[] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const dimensions: any = useResizeObserver(wrapperRef)

  const NUM_OF_LEVEL = 5
  const maxValue = max(data, (d) => d.value) as number
  const dataLength = data.length
  const r = (0.8 * dimensions?.height) / 2
  const polyangle = (Math.PI * 2) / dataLength
  const offset = Math.PI
  const step = maxValue / NUM_OF_LEVEL
  const scale = scaleLinear().domain([0, maxValue]).range([0, r]).nice()
  const lineColor = 'black'

  function t() {
    return transition().duration(1000).ease(easeLinear)
  }

  const colorScale = scaleOrdinal(schemePaired)

  const lineGroup = (_: any, i: number) => {
    const hyp = ((i + 1) / NUM_OF_LEVEL) * r
    const points = Array.from(Array(dataLength).keys()).reduce((a, index): any => {
      const theta = index * polyangle
      const b = generatePoint({ length: hyp, angle: theta })
      return [...a, b]
    }, [])
    return line()([...points, points[0]])
  }

  const generatePoint = useMemo(
    () =>
      ({ length, angle }: any) => {
        const point = [
          dimensions.width / 2 + length * Math.sin(offset - angle),
          dimensions.height / 2 + length * Math.cos(offset - angle),
        ]
        return point
      },
    [dimensions, offset],
  )

  const gridGroup = (_: any, i: number) => {
    const theta = (i + 1) * polyangle
    const point = generatePoint({ length: r, angle: theta })
    // @ts-ignore
    return line()([[dimensions.width / 2, dimensions.height / 2], point])
  }

  const tickLine = () => {
    const point = generatePoint({ length: r, angle: 0 })
    // @ts-ignore
    return line()([[dimensions.width / 2, dimensions.height / 2], point])
  }

  const tick = (_: any, i: number) => {
    const q = (i / NUM_OF_LEVEL) * r
    const p = generatePoint({ length: q, angle: 0 })
    const points = [p, [p[0] - 10, p[1]]]
    // @ts-ignore
    return line()(points)
  }

  const tickLabelPosition = (i: number, c: number) => {
    const q = (i / NUM_OF_LEVEL) * r
    const p = generatePoint({ length: q, angle: 0 })
    return c === 0 ? p[c] - 10 : p[1] + 5
  }

  const tickLabels = (i: number) => {
    const ticks = []
    const num = step * i
    if (Number.isInteger(step)) {
      ticks.push(num)
    } else {
      ticks.push(num.toFixed(2))
    }
    return ticks
  }

  const shapeDraw = useMemo(
    () => () => {
      const points = Array.from(data).reduce((acc, cur, index): any => {
        const len = scale(cur.value as number)
        const theta = index * ((2 * Math.PI) / dataLength)
        const p = generatePoint({ length: len, angle: theta })
        // value 안 더함
        // console.log(cur.value);
        return [...acc, p]
      }, [])
      return line()([...points, points[0]])
    },
    [data, dataLength, scale],
  )

  const linePointPosition = (d: any, i: number) => {
    const len = scale(d.value as number)
    const theta = i * ((2 * Math.PI) / dataLength)
    const p = generatePoint({ length: len, angle: theta })
    return `translate(${p[0]},${p[1]})`
  }

  const labelPosion = (_: any, i: number) => {
    const theta = i * polyangle
    const point = generatePoint({ length: r, angle: theta })
    // console.log(Math.floor(point[0]), Math.floor(width / 2))
    if (Math.floor(point[0]) === Math.floor(dimensions.width / 2)) return 'middle'
    return Math.floor(point[0]) >= dimensions.width / 2 ? 'start' : 'end'
  }

  const pointLabels = (i: number, c: number) => {
    const angle = i * polyangle
    const point = generatePoint({ length: 0.9 * (dimensions.height / 2), angle })
    return point[c]
  }

  useEffect(() => {
    const svg = select(svgRef.current)

    if (!dimensions) return

    const radarSvg = svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('viewBox', [0, 0, dimensions.width, dimensions.height])

    const levelLine = radarSvg
      .selectAll('.levels')
      .data(Array.from(Array(NUM_OF_LEVEL).keys()))
      .join(
        (enter) => {
          return enter
            .append('path')
            .attr('class', 'levels')
            .style('opacity', 0)
            .transition()
            .duration(2000)
            .delay(function (_, i) {
              return 50 * i
            })
            .attr('d', lineGroup)
            .style('opacity', 1)
            .selection()
        },
        (update) => {
          return update
            .attr('d', lineGroup) // 안보이게 해보기
            .transition()
            .duration(1000)
            .attr('d', lineGroup)
            .style('opacity', 1)
        },
        (exit) => {
          return exit.transition().duration(1000).style('opacity', 0).remove()
        },
      )
      .attr('stroke', lineColor)
      .attr('class', 'levels')
      .attr('fill', 'none')
      .attr('stroke-width', '1px')

    const gridLine = radarSvg
      .selectAll('.grids')
      .data(data)
      .join('path')
      .attr('class', 'grids')
      .attr('d', gridGroup)
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', '1px')

    const tickLines = radarSvg
      .selectAll('.ticks-lines')
      .data([null])
      .join('path')
      .attr('class', 'ticks-lines')
      .attr('d', tickLine)
      .attr('stroke-width', '3px')
      .attr('stroke', 'rgb(244, 117, 96)')
      .style('opacity', '1')

    const ticks = radarSvg
      .selectAll('.ticks')
      .data(Array.from(Array(NUM_OF_LEVEL + 1).keys()))
      .join('path')
      .attr('class', 'ticks')
      .attr('d', tick)
      .attr('fill', 'none')
      .style('opacity', '1')
      .attr('stroke-width', '3px')
      .attr('stroke', 'rgb(244, 117, 96)')

    const tickLabel = radarSvg
      .selectAll('.ticks-labels')
      .data(Array.from(Array(NUM_OF_LEVEL + 1).keys()))
      .join('text')
      .attr('class', 'ticks-labels')
      .attr('x', (_, i) => tickLabelPosition(i, 0) - 4)
      .attr('y', (_, i) => tickLabelPosition(i, 1))
      .attr('fill', 'black')
      .attr('text-anchor', 'end')
      .attr('font-size', '14px')
      .text(tickLabels as unknown as string)

    const tickShape = radarSvg
      .selectAll('.shape')
      .data([null])
      .join('path')
      .attr('class', 'shape')
      .attr('d', shapeDraw)
      .style('stroke', 'rgba(232, 193, 160, 1)')
      .attr('stroke-width', 2)
      .style('fill', 'rgba(232, 193, 160,1)')
      .style('fill-opacity', 0.5)

    const groups = radarSvg
      .selectAll('.dataes')
      .data(data)
      .join('g')
      .attr('class', 'dataes')
      .attr('transform', (d, i) => linePointPosition(d, i))

    groups
      .selectAll('circle')
      .data([null])
      .join('circle')
      .attr('class', 'circle')
      .attr('r', 5)
      .attr('fill', 'white')
      .style('stroke', 'red')
      .style('stroke-width', 3)

    groups
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .attr('class', 'text')
      .attr('y', -12)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('stroke-width', '3px')
      .attr('stroke', 'white')
      .attr('paint-order', 'stroke')
      .attr('stroke-linecap', 'butt')
      .attr('stroke-linejoin', 'miter')
      .text(({ value }) => value)

    const labels = radarSvg
      .selectAll('.labels')
      .data(data)
      .join('text')
      .attr('class', 'labels')
      .attr('text-anchor', labelPosion)
      .attr('font-size', '13px')
      //@ts-ignore
      .text((d) => d.name)
      .attr('x', (_, i) => pointLabels(i, 0))
      .attr('y', (_, i) => pointLabels(i, 1))
      .attr('fill', 'rgb(73, 85, 93)')
  }, [data, dimensions])

  // .attr('stroke', (_, i) => colorScale(String(i)))

  // .delay(function (_, i) {
  //   return 5 * i;
  // })

  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem', height: '600px' }}>
      <svg ref={svgRef} className="radar"></svg>
      <div id="legend"></div>
    </div>
  )
}

export default RadarChart
