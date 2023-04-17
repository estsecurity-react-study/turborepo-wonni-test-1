import { useEffect } from 'react';
// import data from './data';
import { BaseType, ValueFn, select } from 'd3';

const EX3 = () => {
  function getData() {
    let data = [];
    let numItems = Math.ceil(Math.random() * 5);

    for (let i = 0; i < numItems; i++) {
      data.push(40);
    }

    return data;
  }

  function update(
    data: Iterable<unknown> | ValueFn<BaseType, unknown, unknown[] | Iterable<unknown>>,
  ) {
    select('.chart')
      .selectAll('circle')
      .data(data)
      .join(
        function (enter) {
          return enter.append('circle').style('opacity', 0.25);
        },
        function (update) {
          return update.style('opacity', 1);
        },
      )
      .attr('cx', function (d, i) {
        return i * 100;
      })
      .attr('cy', 50)
      .attr('r', function (d) {
        return 0.5 * d;
      })
      .style('fill', 'orange');
  }

  function updateAll() {
    let myData = getData();
    console.log('myData', myData);
    update(myData);
  }

  useEffect(() => {
    updateAll();
    select('button').on('click', updateAll);
  }, []);

  return (
    <>
      <svg style={{ overflow: 'visible', background: 'black', width: '600px', height: '100px' }}>
        <g className="chart"></g>
      </svg>
      <button>Update</button>
    </>
  );
};

export default EX3;
