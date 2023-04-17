import { useEffect, useRef, useState } from 'react'
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3'
import GaugeChart from './GaugeChart'
import useInterval from './useInterval'

export default function Basic() {
  const videoRef = useRef()
  const [gaugeData, setGaugeData] = useState([0.5, 0.5])
  const [shouldClassify, setShouldClassify] = useState(false)

  return (
    <div id="root">
      <h1>
        Is Muri there? <br />
        <small>
          [{gaugeData[0].toFixed(2)}, {gaugeData[1].toFixed(2)}]
        </small>
      </h1>
      <GaugeChart data={gaugeData} />
    </div>
  )
}
