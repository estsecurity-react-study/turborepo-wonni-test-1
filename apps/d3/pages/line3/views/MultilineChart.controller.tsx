import { format, max, min, scaleBand, scaleLinear, scaleTime, timeFormat } from 'd3';
import { useMemo } from 'react';
import { DataProps } from '..';

const useController = ({
  data,
  width,
  height,
}: {
  data: DataProps[];
  width: number;
  height: number;
}) => {
  const xMin = useMemo(() => min(data, ({ items }) => min(items, ({ date }) => date)), [data]);

  const xMax = useMemo(() => max(data, ({ items }) => max(items, ({ date }) => date)), [data]);

  const xScale = useMemo(
    () => scaleTime().domain([xMin!, xMax!]).range([0, width]),
    [xMin, xMax, width],
  );

  const yMin = useMemo(() => min(data, ({ items }) => min(items, ({ value }) => value)), [data]);

  const yMax = useMemo(() => max(data, ({ items }) => max(items, ({ value }) => value)), [data]);

  const yScale = useMemo(() => {
    const indention = (yMax! - yMin!) * 0.5;
    return scaleLinear()
      .domain([yMin! - indention, yMax! + indention])
      .range([height, 0]);
  }, [height, yMin, yMax]);

  const yScaleForAxis = useMemo(
    // @ts-ignore
    () => scaleBand().domain([yMin, yMax]).range([height, 0]),
    [height, yMin, yMax],
  );

  const yTickFormat = (d: any) => `${parseFloat(d) > 0 ? '+' : ''}${format('.2%')(d / 100)}`;

  const xTickFormat = (d: Date) => {
    if (timeFormat('%b')(d) === 'Jan') {
      return timeFormat('%Y')(d);
    }
    return timeFormat('%b')(d);
  };

  return {
    yTickFormat,
    xScale,
    yScale,
    yScaleForAxis,
    xTickFormat,
  };
};

export default useController;
