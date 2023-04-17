import data from './data';

function Bubbles({ data }: any) {
  const bubbles = data.map(({ id, x, y, val, color }: any) => (
    <circle key={id} cx={x} cy={y} r={val} fill={color} />
  ));
  return <g className="bubbles">{bubbles}</g>;
}

const EX1 = () => {
  return (
    <div>
      <h1>EX 1</h1>
      <h2>React를 사용하여 렌더링하기</h2>
      <svg style={{ overflow: 'visible', background: 'yellow', width: '600px', height: '400px' }}>
        <Bubbles data={data} />
      </svg>
    </div>
  );
};

export default EX1;
