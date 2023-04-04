import { useEffect, useRef, useMemo, useState } from 'react';

import useWindowDimensions from '../WindowDimensions';
import Bar2 from './Bar2';

export type Data = {
  date: string;
  count: number;
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
  { date: 'May 5 2017', count: 100 },
  { date: 'May 7 2017', count: 26 },
  { date: 'Jun 11 2017', count: 31 },
  { date: 'Jun 25 2017', count: 36 },
  { date: 'Jul 2 2017', count: 17 },
  { date: 'Jul 5 2017', count: 23 },
  { date: 'Jul 7 2017', count: 41 },
  { date: 'Jul 10 2017', count: 32 },
  { date: 'Jul 15 2017', count: 14 },
];

export default function D3() {
  const [data, setData] = useState<Data[]>([]);
  const [propertiesNames] = useState(['name', 'value']);
  const { width, height } = useWindowDimensions();

  const [childrenWidth, setChildrenWidth] = useState<number>(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (childrenRef.current) {
      setChildrenWidth(childrenRef.current.offsetWidth);
    }
  }, [childrenRef, width]);

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
  dimensions.current = getDimensions(childrenWidth * 1, 600, 30, 30, 30, 30);

  // resize
  useEffect(() => {
    (dimensions as unknown as { current: Dimensions }).current = getDimensions(
      childrenWidth * 1,
      600 * 1,
      30,
      30,
      30,
      30,
    );
  }, [childrenRef, width, height, dimensions]);

  useEffect(() => {
    setData(campaign as unknown as Data[]);
  }, [campaign]);

  return (
    <div ref={rootRef} className="grid grid-flow-col grid-rows-2 grid-cols-2 gap-8">
      <div ref={childrenRef}>
        {data.length > 1 ? (
          <>
            <h3>Bar Chart 2</h3>
            <Bar2
              name="Bar2"
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
  );
}
