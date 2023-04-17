# D3 발표

## React와 D3을 같이 사용하는 방법

D3는 DOM을 직접 제어하고 React는 Virtual DOM으로 제어한다.  
state 등 값을 기반으로 React가 DOM을 조작해야지, 코더가 직접 DOM을 조작하는 것은 (그것이 더 빠르거나 느리거나를 떠나서) React를 바르게 사용하는 방법이 아니다.  
그런데 D3는 React를 기반으로 이루어진 viz 툴이 아니기 때문에 React와 D3를 같이 사용하는 방법에 대해 여러 의견이 있다.  
www.smashingmagazine.com/2018/02/react-d3-ecosystem/  
위 게시물에 따르면 React + D3를 사용하는 방법 4가지가 정리되어 있습니다. 각 방법의 쟁점은 DOM 조작을 D3에게 맡기느냐 , React이 하게 두느냐입니다.  
여기서 가장 일반적으로 사용되는 방법은 DOM은 React에게, 계산은 D3에게하게 두는 것입니다.  
SVG path 계산, scale, layouts, transformations 등의 선/도형등의 모양을 계산하는 것만 D3가 하게하고 나머지는 React에게 맡깁니다.  

이러한 방법은 아래 영상에 따르면 다음과 같은 장점들이 있습니다. 요약하자면 D3 사용이 더 편해진다는 거죠.
https://www.youtube.com/watch?v=Awnz8x8kcE8
Data visualisation chat about D3.js, P5.js, JavaScript, Python with kosamari, sxywu and shiffman

D3 진입 장벽이 높은 이유는 초반에 enter/update/exit 패턴에 대해서 배우는 것 때문 (그래도 배워야 한다. 별도의 포스트에서 다루기로 하겠다)
React 를 사용하면 enter/update/exit 안 쓰고 D3로 계산하는 법만 알면 됨, 이 같은 DOM 조작 기능이 React에 이미 내장되어있기 때문에
때문에 React 를 알면 D3 진입이 오히려 쉬울 수도 있음

useRef로 circle과 같은 svg element를 넣을 DOM을 잡아주고 selection 객체를 만들어 이리저리 사용해주면 됩니다.

jquery랑 비슷

그리고 해당 Ref를 Reactive하게 관리하기 위해 useEffect 내부에 넣어줘서 관리합니다.

```js
import React, { useRef, useEffect, useState } from "react";
import "./App";
import { select } from "d3";

function App() {
  const [data, setData] = useState([24, 30, 45, 70, 26]);
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = select(svgRef.current); // selection 객체

    svg
      .selectAll("circle")
      .data(data)
      .join(
        (enter) => enter.append("circle"),
        (update) => update.attr("class", "updated"),
        (exit) => exit.remove()
      )
      .attr("r", (value) => value)
      .attr("cx", (value) => value * 2)
      .attr("cy", (value) => value * 2)
      .attr("stroke", "red");
  }, [data]);

  return (
    <>
      <svg ref={svgRef}></svg>
      <button onClick={() => {setData(data.map(el => el + 5))}}>increase + 5</button>
      <button onClick={() => {setData(data.filter(el => el > 35))}}>filter circle r should gt 35</button>
    </>
  );
}
```

결론적으론, 아래처럼 직접 React 컴포넌트 상에서 Dom을 지정한 것과 같은 결과를 보여줍니다.

단지 계산을 D3에 맡겼을 뿐.

```js
<svg ref={svgRef}>
  {data.map((el, i) => (
    <circle r={el} key={i}>
      {el}
    </circle>
  ))}
</svg>
```

## 문제점
https://cmichel.io/how-to-use-d3js-in-react

React와 D3.js를 함께 사용할 때의 문제점은 두 라이브러리 모두 DOM의 렌더링을 장악/통제하려 한다는 것이다. D3.js 는 선택과 하위 항목의 첨부 + 업데이트를 통해 DOM을 수정하고, React는 요소의 성질이나 상태가 변할 때마다 렌더 함수의 렌더링 요소를 통해 DOM을 수정한다. 이 접근법들을 보고 그 방법들을 결합시킬 방법도 살펴 보자.

```js
d3.csv('data.csv', (err, data) => {
    if (err) {
        console.log(err)
        return
    }
    ReactDOM.render(
        <App width={960} height={640} data={data} />,
        document.getElementById('root'),
    )
})

function App({width, height, data}) {
    return (
        <svg width={width} height={height}>
            <Bubbles data={data} />
        </svg>
    )
}

function Bubbles({data}) {
    const bubbles = data.map( ({id,x,y,r}) => <Bubble key={id} x={x} y={y} r={r} />)
    return (
        <g className="bubbles">
            {
                bubbles
            }
        </g>
    )
}

function Bubble({x,y,r}) {
    return (
        <circle cx={x} cy={y} r={r} />
    )
}
```

### 장점
- 차트의 더 나은 구조
- 더 읽기 쉬운

### 단점
- DOM을 직접 수정하는 d3.transition 및 기타 d3 함수를 사용할 수 없습니다.
- 요소의 소품과 재 렌더링에 애니메이션 효과를 주는 것이 D3의 애니메이션을 사용하는 것보다 느립니다.
- React와 순수한 D3 간의 비교를 [참조]((https://gist.github.com/JMStewart/f0dc27409658ab04d1c8))하십시오.


## D3사용하여 렌더링하기
D3가 svg elements를 만들도록 하는 것이다. 우리는 단일 svg 컨테이너를 렌더링하는 하나의 React 컴포넌트를 만들고, constructor (props)와 componentWillReceiveProps (nextProps) 함수에서 주어진 데이터 변화에 따라 D3가 DOM을 만드는 것을 처리하도록 한다. 애니메이션은 주로 외부 이벤트에 의해 작동된다. 예를 들어, 버튼 클릭은 React 컴포넌트 트리를 통해 전파되고, D3 요소의 componentWillReceiveProps를 불러내고, 그것은 D3의 업데이트 선택을 사용하여 트렌지션 효과를 작동시킨다.

### 장점
- d3.transition으로 애니메이션과 같은 D3의 모든 기능을 사용할 수 있습니다.

### 단점
- 전체 차트를 하나의 구성 요소에 넣어 구조를 줄입니다.
- 강한 결합으로 인해 유연성과 코드의 재사용성을 줄어든다.
- 가독성이 떨어짐

## The Hybrid Approach
eact 컴포넌트를 사용하면서 얻게되는 구조와 가독성을 선호하지만, DOM 요소에서 직접 전환 효과를 사용하는 것 또한 좋아한다. 그래서 필자는 두 가지 접근법을 결합한다. React가 대부분의 모든 고정 요소 (컨테이너, 타이틀, 축, 범례) 를 렌더링 하도록하고 D3가 애니메이션화 해야하는 모든 것들을 (데이터 시리즈) 렌더링 하도록 한다. 예를 들어, 이 방법의 실행을 내 [Bubble Chart on GitHub](https://github.com/MrToph/react-d3-bubblechart) 에서 볼 수 있다 ( 또는 [여기에서 실행](https://cmichel.io/projects/react-d3-bubblechart/)할 수 있다.)

### 장점
- 좋은 독립적 차트 구조
- 적절한 곳(애니메이션)에 D3를 직접적으로 사용할 수 있음
