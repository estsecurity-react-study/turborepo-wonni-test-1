# D3

## 목차
1. D3를 해야 하는 이유
2. D3 데이터 조인

## D3를 해야 하는 이유 
- 웹에서 데이터 시각화는 D3가 표준
- D3를 사용하면 임의 데이터를 DOM(Document Object Model)에 바인딩한 다음 데이터 중심 변환을 document에 적용할 수 있습니다.

## React와 D3
- D3는 DOM을 직접 제어하고 React는 Virtual DOM으로 제어한다.
- state 등 값을 기반으로 React가 DOM을 조작해야지, 코더가 직접 DOM을 조작하는 것은 (그것이 더 빠르거나 느리거나를 떠나서) React를 바르게 사용하는 방법이 아니다.
- D3는 React를 기반으로 이루어진 viz 툴이 아니기 때문에 React와 D3를 같이 사용하는 방법에 대해 여러 의견이 있다.
- D3 진입 장벽이 높은 이유는 초반에 enter/update/exit 패턴에 대해서 배우는 것 때문 (그래도 배워야 한다. 별도의 포스트에서 다루기로 하겠다)
- React 를 사용하면 enter/update/exit 안 쓰고 D3로 계산하는 법만 알면 됨, 이 같은 DOM 조작 기능이 React에 이미 내장되어있기 때문에
- 떄문에 React 를 알면 D3 진입이 오히려 쉬울 수도 있음

## 동작 원리
- D3.js는 데이터를 로드하고 DOM에 첨부합니다. 
- 그런 다음 해당 데이터를 DOM 요소에 바인딩하고 해당 요소를 변환하며 필요한 경우 상태 간에 전환합니다.

## Render 방식으로 비교

### React를 사용하여 렌더링하기 visx
React는 JSX에서 렌더링 svg 요소를 직접 처리할 수 있으므로 D3의 렌더링 기능을 전혀 사용할 필요가 없습니다.  
대신 도우미 기능(d3-scale, d3-request, d3-path 등)에 사용할 것입니다.  
데이터를 쉽게 로드, 조작 및 형식화할 수 있습니다. 그런 다음 렌더링을 처리하는 React 구성 요소를 만들 수 있습니다.

#### 장점
- 차트의 더 나은 구조
- 더 읽기 쉬운

#### 단점
- DOM을 직접 수정하는 d3.transition 및 기타 d3 함수를 사용할 수 없습니다.
- 요소의 소품과 재 렌더링에 애니메이션 효과를 주는 것이 D3의 애니메이션을 사용하는 것보다 느림니다.
- React와 순수한 D3 간의 비교를 [참조]((https://gist.github.com/JMStewart/f0dc27409658ab04d1c8))하십시오.

### D3사용하여 렌더링하기
D3가 svg elements를 만들도록 하는 것이다. 우리는 단일 svg 컨테이너를 렌더링하는 하나의 React 컴포넌트를 만들고, constructor (props)와 componentWillReceiveProps (nextProps) 함수에서 주어진 데이터 변화에 따라 D3가 DOM을 만드는 것을 처리하도록 한다. 애니메이션은 주로 외부 이벤트에 의해 작동된다. 예를 들어, 버튼 클릭은 React 컴포넌트 트리를 통해 전파되고, D3 요소의 componentWillReceiveProps를 불러내고, 그것은 D3의 업데이트 선택을 사용하여 트렌지션 효과를 작동시킨다.

#### 장점
- d3.transition으로 애니메이션과 같은 D3의 모든 기능을 사용할 수 있습니다.

#### 단점
- 전체 차트를 하나의 구성 요소에 넣어 구조를 줄입니다.
- 모듈화가 어렵고 긴밀한 결합이 발생할 수 있습니다.
- 가독성이 떨어짐

### The Hybrid Approach
eact 컴포넌트를 사용하면서 얻게되는 구조와 가독성을 선호하지만, DOM 요소에서 직접 전환 효과를 사용하는 것 또한 좋아한다. 그래서 필자는 두 가지 접근법을 결합한다. React가 대부분의 모든 고정 요소 (컨테이너, 타이틀, 축, 범례) 를 렌더링 하도록하고 D3가 애니메이션화 해야하는 모든 것들을 (데이터 시리즈) 렌더링 하도록 한다. 예를 들어, 이 방법의 실행을 내 [Bubble Chart on GitHub](https://github.com/MrToph/react-d3-bubblechart) 에서 볼 수 있다 ( 또는 [여기에서 실행](https://cmichel.io/projects/react-d3-bubblechart/)할 수 있다.)

#### 장점
- 좋은 독립적 차트 구조
- 적절한 곳(애니메이션)에 D3를 직접적으로 사용할 수 있음

## 참고
- [React + D3.js (1) D3 소개와 React와 접목](https://darrengwon.tistory.com/1140)
- [React에서 D3.js 사용하는 방법](http://52.78.22.201/tutorials/weplanet/how-to-use-d3/)
- [How to use D3.js in React](https://cmichel.io/how-to-use-d3js-in-react)
- [DOM 속도 비교](https://gist.github.com/JMStewart/f0dc27409658ab04d1c8)
- [Bubble Chart on GitHub](https://github.com/MrToph/react-d3-bubblechart)]
- [D3.js Overview](https://velog.io/@dnr6054/D3.js-Overview)
- [Learn D3: Introduction](https://observablehq.com/@d3/learn-d3)
- [D3 Data Joins](https://www.d3indepth.com/datajoins/)
- [D3 tutorialspoint](https://www.tutorialspoint.com/d3js/)
- [D3.js 기초: select()와 enter() 함수 이해하기](https://www.44bits.io/ko/post/d3js-basic-understanding-select-and-enter-api#d3.js-select-api-%EC%8B%9C%EA%B0%81%ED%99%94%ED%95%A0-%EC%9A%94%EC%86%8C-%EC%84%A0%ED%83%9D%ED%95%98%EA%B8%B0)