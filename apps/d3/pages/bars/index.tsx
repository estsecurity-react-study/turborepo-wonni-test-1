import { useEffect, useRef, useMemo, useState } from 'react';

import useWindowDimensions from '../WindowDimensions';
import BarChart from './BarChart';
import { campaign, Data, Dimensions } from './data';

export default function D3() {
  const { width, height } = useWindowDimensions();

  const [data, setData] = useState<Data[]>([]);
  const [propertiesNames] = useState(['name', 'value']);

  const [childrenWidth, setChildrenWidth] = useState<number>(0);
  const [childrenHeight, setChildrenHeight] = useState<number>(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (childrenRef.current) {
      setChildrenWidth(childrenRef.current.offsetWidth);
      setChildrenHeight(childrenRef.current.offsetHeight);
    }
  }, [childrenRef, width, height]);

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
  dimensions.current = getDimensions(childrenWidth * 1, childrenHeight * 1, 20, 10, 30, 60);

  // console.log('width', width);
  // console.log('dimensions.current', dimensions.current.width);

  // resize
  useEffect(() => {
    (dimensions as unknown as { current: Dimensions }).current = getDimensions(
      childrenWidth * 1,
      childrenHeight * 1,
      20,
      10,
      30,
      60,
    );
  }, [childrenRef, width, height, dimensions]);

  useEffect(() => {
    setData(campaign as unknown as Data[]);
  }, [campaign]);

  console.log(dimensions.current);

  return (
    <div ref={rootRef} className="grid grid-flow-col grid-rows-2 grid-cols-2 gap-8">
      <div ref={childrenRef} style={{ height: 400 }}>
        {data.length > 1 ? (
          <>
            <h3>Bar Chart, Horizontal</h3>
            <BarChart
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
