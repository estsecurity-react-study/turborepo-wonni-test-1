import { useEffect, useRef, useMemo, useState } from 'react'

import useWindowDimensions from '../WindowDimensions'
import HorizontalBarChart from './HorizontalBarChart'

export type Data = {
  name?: string
  value?: number
}

export type Dimensions = {
  width: number
  height: number
  margin: {
    left: number
    right: number
    top: number
    bottom: number
  }
  boundedWidth: number
  boundedHeight: number
}

const campaign: Data[] = [
  { name: '운영체제 최신보안 패치', value: 54300 },
  { name: '보안센터 서비스 실행', value: 15457 },
  { name: 'Windows 방화벽 사용', value: 545 },
  { name: '윈도우 로그인 패스워드', value: 34567 },
  { name: '기타', value: 24567 },
  { name: '바이러스 백신 설치 및 실행', value: 45675 },
]

export default function D3() {
  const [data, setData] = useState<Data[]>([])
  const [propertiesNames] = useState(['name', 'value'])
  const { width, height } = useWindowDimensions()

  const [childrenWidth, setChildrenWidth] = useState<number>(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (childrenRef.current) {
      setChildrenWidth(childrenRef.current.offsetWidth)
    }
  }, [childrenRef, width])

  const getDimensions = useMemo(
    () =>
      (width: number, height: number, top: number, right: number, bottom: number, left: number) => {
        const dimensions = {
          width,
          height,
          margin: {
            top,
            right,
            bottom,
            left,
          },
          boundedWidth: 0,
          boundedHeight: 0,
        }
        dimensions.boundedWidth =
          dimensions.width - dimensions.margin.left - dimensions.margin.right
        dimensions.boundedHeight =
          dimensions.height - dimensions.margin.top - dimensions.margin.bottom

        return dimensions
      },
    [width, height],
  )

  const dimensions = useRef() as { current: Dimensions }
  dimensions.current = getDimensions(childrenWidth * 1, 400, 20, 10, 30, 60)

  // console.log('width', width);
  // console.log('dimensions.current', dimensions.current.width);

  // resize
  useEffect(() => {
    ;(dimensions as unknown as { current: Dimensions }).current = getDimensions(
      childrenWidth * 1,
      400 * 1,
      20,
      10,
      30,
      60,
    )
  }, [childrenRef, width, height, dimensions])

  useEffect(() => {
    setData(campaign as unknown as Data[])
  }, [campaign])

  return (
    <div ref={rootRef} className="grid grid-flow-col grid-rows-2 grid-cols-2 gap-8">
      <div ref={childrenRef}>
        {data.length > 1 ? (
          <>
            <h3>Bar Chart, Horizontal</h3>
            <HorizontalBarChart
              dimensions={dimensions.current}
              data={data}
              propertiesNames={propertiesNames}
            />
          </>
        ) : (
          <>Loading</>
        )}
      </div>
      <div>3</div>
      <div>2</div>
      <div>4</div>
    </div>
  )
}
