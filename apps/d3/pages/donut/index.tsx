import { useEffect, useRef, useMemo, useState } from 'react';

import useWindowDimensions from '../WindowDimensions';
import DonutChart from './DonutChart';

export type Data = {
  name?: string;
  value?: number;
};

export type Dimensions = {
  width: number;
  height: number;
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  boundedWidth: number;
  boundedHeight: number;
};

const campaign: Data[] = [
  { name: 'May 5 2017', value: 20 },
  { name: 'May 7 2017', value: 55 },
  { name: 'Jun 11 2017', value: 11 },
  { name: 'Jun 25 2017', value: 23 },
  { name: 'Jul 2 2017', value: 24 },
  { name: 'Jul 5 2017', value: 102 },
  { name: 'Jul 7 2017', value: 34 },
  { name: 'Jul 10 2017', value: 52 },
  { name: 'Jul 15 2017', value: 45 },
];

export default function D3() {
  const [data, setData] = useState<Data[]>([]);
  const [propertiesNames] = useState(['name', 'value']);
  const { width, height } = useWindowDimensions();

  const rootRef = useRef<HTMLDivElement>(null);

  const getDimensions = useMemo(
    () =>
      (width: number, height: number, left: number, right: number, top: number, bottom: number) => {
        const dimensions = {
          width,
          height,
          margin: {
            left,
            right,
            top,
            bottom,
          },
          boundedWidth: 0,
          boundedHeight: 0,
        };
        dimensions.boundedWidth =
          dimensions.width - dimensions.margin.left - dimensions.margin.right;
        dimensions.boundedHeight =
          dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

        return dimensions;
      },
    [width, height],
  );

  const dimensions = useRef() as { current: Dimensions };
  dimensions.current = getDimensions(width * 1, height * 0.9, 0, 0, 0, 0);
  0;

  // resize
  useEffect(() => {
    (dimensions as unknown as { current: Dimensions }).current = getDimensions(
      width * 1,
      height * 0.9,
      0,
      0,
      0,
      0,
    );
  }, [width, height, dimensions]);

  const loadData = () => {
    setData(campaign as unknown as Data[]);
  };

  useEffect(() => {
    loadData();
  }, [campaign]);

  return (
    <div ref={rootRef}>
      <>
        {data.length > 1 ? (
          <>
            <h3>Donut Pie Chart</h3>
            <DonutChart
              dimensions={dimensions.current}
              data={data}
              propertiesNames={propertiesNames}
            />
          </>
        ) : (
          <>Loading</>
        )}
      </>
    </div>
  );
}
