import React, { useRef, useEffect, useState } from 'react'
import { select, geoPath, geoMercator, min, max, scaleLinear } from 'd3'
import useResizeObserver from './useResizeObserver'

/**
 * Component that renders a map of Germany.
 */

function GeoChart({ data, property }: any) {
  const svgRef = useRef<any>()
  const wrapperRef = useRef<any>()
  const dimensions = useResizeObserver(wrapperRef)
  const [selectedCountry, setSelectedCountry] = useState<any>(null)

  // will be called initially and on every data change
  useEffect(() => {
    if (svgRef && svgRef.current) {
      const svg = select(svgRef.current)

      const minProp = min(data.features, (feature) => feature.properties[property])
      const maxProp = max(data.features, (feature) => feature.properties[property])
      const colorScale = scaleLinear().domain([minProp, maxProp]).range(['#ccc', 'red'])

      // use resized dimensions
      // but fall back to getBoundingClientRect, if no dimensions yet.
      const { width, height } = dimensions || (wrapperRef.current as any).getBoundingClientRect()

      // projects geo-coordinates on a 2D plane
      const projection = geoMercator()
        .fitSize([width, height], selectedCountry || data)
        .precision(100)
      const pathGenerator = geoPath().projection(projection)

      const paths = svg.selectAll('.country').data(data.features)

      paths
        .join('path')
        .attr('class', 'country')
        .transition()
        .delay(function (_, i) {
          return 5 * i
        })
        .duration(200)
        .attr('d', (feature) => pathGenerator(feature))
        .attr('fill', (feature) => colorScale(feature.properties[property]))
        .attr('opacity', (feature) => {
          if (!selectedCountry?.properties?.name) return 1
          return feature?.properties?.name === selectedCountry?.properties?.name ? 1 : 0.2
        })

      paths.on('click', (event, feature) => {
        return setSelectedCountry(selectedCountry === feature ? null : feature)
      })

      // render text
      svg
        .selectAll('.label')
        .data([selectedCountry])
        .join('text')
        .attr('class', 'label')
        .text((feature) => {
          return (
            feature &&
            feature.properties.name + ': ' + feature.properties[property].toLocaleString()
          )
        })
        .attr('x', 10)
        .attr('y', 25)
    }
  }, [data, dimensions, property, selectedCountry])

  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem', height: '600px' }}>
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default GeoChart
