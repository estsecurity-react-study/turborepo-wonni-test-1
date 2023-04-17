import { useEffect, useRef, useState } from 'react'
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3'
import BarChart from './BarChart'

export default function Basic() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75])
  return (
    <div id="root">
      <BarChart data={data} />
      <button onClick={() => setData(data.map((value) => value + 5))}>Update data</button>
      <button onClick={() => setData(data.filter((value) => value < 35))}>Filter data</button>
      <button onClick={() => setData([...data, Math.round(Math.random() * 100)])}>Add data</button>
    </div>
  )
}
