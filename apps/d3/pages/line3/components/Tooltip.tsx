import { bisector, max, pointer, select, selectAll, timeFormat } from 'd3';
import { Key, useCallback, useEffect, useRef } from 'react';
import { formatPercent, formatPriceUSD } from '../utils/commonUtils';

const Tooltip = ({
  xScale,
  yScale,
  width = 0,
  height = 0,
  data,
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  anchorEl,
  ...props
}: any) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const drawLine = useCallback(
    (x: number) => {
      select(ref.current)
        .select('.tooltipLine')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', -margin.top)
        .attr('y2', height);
    },
    [ref, height, margin],
  );

  const drawContent = useCallback(
    (x: number) => {
      const tooltipContent = select(ref.current).select('.tooltipContent');
      tooltipContent.attr('transform', (_, i, nodes) => {
        const nodeWidth = (nodes[i] as HTMLElement)?.getBoundingClientRect()?.width || 0;
        const translateX = nodeWidth + x > width ? x - nodeWidth - 12 : x + 8;
        return `translate(${translateX}, ${-margin.top})`;
      });
      tooltipContent.select('.contentTitle').text(timeFormat('%b %d, %Y')(xScale.invert(x)));
    },
    [xScale, margin, width],
  );

  const drawBackground = useCallback(() => {
    // reset background size to defaults
    const contentBackground = select(ref.current).select('.contentBackground');
    contentBackground.attr('width', 200).attr('height', 40);

    // calculate new background size
    const tooltipContentElement = select(ref.current).select('.tooltipContent').node();
    if (!tooltipContentElement) return;

    const contentSize = (tooltipContentElement as HTMLElement).getBoundingClientRect();
    contentBackground.attr('width', contentSize.width + 8).attr('height', contentSize.height + 4);
  }, []);

  const onChangePosition = useCallback(
    (d: { date: Date; marketvalue: number; value: number }, i: number, isVisible: boolean) => {
      selectAll('.performanceItemValue')
        .filter((_, tIndex) => tIndex === i)
        .text(isVisible ? formatPercent(d.value) : '');
      selectAll('.performanceItemMarketValue')
        .filter((_, tIndex) => tIndex === i)
        .text(d.marketvalue && !isVisible ? 'No data' : formatPriceUSD(d.marketvalue));

      const maxNameWidth = max(
        selectAll('.performanceItemName').nodes(),
        (node) => (node as HTMLElement).getBoundingClientRect().width,
      );
      selectAll('.performanceItemValue').attr(
        'transform',
        (_, index, nodes) =>
          `translate(${
            (nodes[index] as any)?.previousSibling.getBoundingClientRect().width + 14
          },4)`,
      );

      selectAll('.performanceItemMarketValue').attr(
        'transform',
        `translate(${maxNameWidth! + 60},4)`,
      );
    },
    [],
  );

  const followPoints = useCallback(() => {
    const [x] = pointer(event, anchorEl);
    const xDate = xScale.invert(x);
    const bisectDate = bisector(({ date }) => date).left;
    let baseXPos = 0;

    // draw circles on line
    select(ref.current)
      .selectAll('.tooltipLinePoint')
      .attr('transform', (_, i) => {
        const index = bisectDate(data[i].items, xDate, 1);
        const d0 = data[i].items[index - 1];
        const d1 = data[i].items[index];

        const d = xDate - d0?.date > d1?.date - xDate ? d1 : d0;
        if (d.date === undefined && d.value === undefined) {
          // move point out of container
          return 'translate(-100,-100)';
        }
        const xPos = xScale(d.date);
        if (i === 0) {
          baseXPos = xPos;
        }

        let isVisible = true;
        if (xPos !== baseXPos) {
          isVisible = false;
        }
        const yPos = yScale(d.value);

        onChangePosition(d, i, isVisible);

        return isVisible ? `translate(${xPos}, ${yPos})` : 'translate(-100,-100)';
      });

    drawLine(baseXPos);
    drawContent(baseXPos);
    drawBackground();
  }, [anchorEl, drawLine, drawContent, drawBackground, xScale, yScale, data, onChangePosition]);

  useEffect(() => {
    select(anchorEl)
      .on('mouseout.tooltip', () => {
        select(ref.current).attr('opacity', 0);
      })
      .on('mouseover.tooltip', () => {
        select(ref.current).attr('opacity', 1);
      })
      .on('mousemove.tooltip', () => {
        select(ref.current).selectAll('.tooltipLinePoint').attr('opacity', 1);
        followPoints();
      });
  }, [anchorEl, followPoints]);

  if (!data.length) return null;

  return (
    <g ref={ref} opacity={0} {...props}>
      <line className="tooltipLine" stroke="#ff007a" strokeWidth="1px" />
      <g className="tooltipContent">
        <rect className="contentBackground" rx={4} ry={4} opacity={0.2} />
        <text className="contentTitle" transform="translate(4,14)" fill="#fff" />
        <g className="content" transform="translate(4,32)">
          {data.map(
            (
              { name, color }: { name: 'VCIT' | 'SCHC' | 'Portfolio'; color: string },
              i: number,
            ) => {
              return (
                <g key={name} transform={`translate(6,${22 * i})`}>
                  <circle r={6} fill={color} />
                  <text className="performanceItemName" transform="translate(10,4)" fill="#fff">
                    {name}
                  </text>
                  <text className="performanceItemValue" opacity={0.5} fontSize={10} fill="#fff" />
                  <text className="performanceItemMarketValue" fill="#fff" />
                </g>
              );
            },
          )}
        </g>
      </g>
      {data.map((d: { name: 'VCIT' | 'SCHC' | 'Portfolio'; color: string }) => {
        return (
          <circle className="tooltipLinePoint" r={5} key={d.name} opacity={0} fill={d.color} />
        );
      })}
    </g>
  );
};

export default Tooltip;