# D3

> D3.js는 브라우저에서 html, css, svg, canvas등을 사용하여 데이터 시각화를 도와주는 라이브러리이다. 데이터에 어떠한 그래프가 적합할지 잘 생각해야 한다.

## Data Join
- 데이터와 데이터를 그릴 DOM 요소를 서로 연결한다.
- Object Consistancy(오브젝트 불변성)를 위해서 각각의 데이터에 유니크한 key를 저장하는 것이 좋다.

### enter()
- 데이터 > DOM elements
- 데이터가 DOM elements보다 많을 때 추가로 dom을 생성하고 데이터를 그린다.
```js
svg.selectAll('circle')
  .data(fruits)
  .enter()
  .append('circle')  
```

### exit()
- 데이터 < DOM elements
- DOM elements가 데이터보다 많을 때, 그 부분을 지운다.

```js
svg.selectAll('circle')
    .data(fruits)
    .exit()
    .remove() 
```

### update()
- 변화한 데이터에 따라서 DOM elements를 업데이트함
- selection.data() 자체가 update()이다.

```js
var rects = d3.select('svg')
    .selectAll('rect')
    .data(data)

var newrects = rects.enter()
    .append('rect')
    .style('fill', 'red')

rects.merge(newrects)
    .attr('width', d => d.value)
    .attr('height', 20)
    .attr('y', (d, i) => i*20)

rects.exit()
    .remove()
```

### selection.join()

- 새롭게 소개된 selection.join()을 사용하면, 업데이트가 필요할 때 enter, update, exit을 일일히 설정하지 않아도 된다.
- [The new D3.js Join method is awesome for teaching](https://fabiofranchino.github.io/blog/the-new-d3.js-join-method-is-awesome-for-t/) 예제 참고

```js
// The same above example
d3.select('svg')
    .selectAll('rect')
    .data(data)
    .join('rect') // (*)
    .style('fill', 'red')
    .attr('width', d => d.value)
    .attr('height', 20)
    .attr('y', (d, i) => i*20)
```

## General Update Pattern

> 다이나믹한 그래프 혹은 재사용가능한 컴포넌트를 만들 때 사용되는 패턴이다. (변화하는 데이터에 따라서 DOM element도 업데이트 됨)
>
>- Listen event ➡️ change state/data ➡️ update DOM
>- General Update Pattern 대신 selection.join() 사용하기

### merge()

- 두개의 요소를 합쳐서 반복되는 로직을 줄인다. (enter와 update를 합침)
- 데이터의 변화에 따라서, 업데이트 되어야하는 attribute는 merge아래에 위치 시킨다.
- 위의 예시를 merge를 사용해서 다시 refactoring 한다면 아래와 같다.

```js
// The same above example
// General Update Pattern
const render = (selection, props) => {
  const { fruits } = props;
  
  // (*) circles itself is an update selection
  const circles = selection.selectAll('circle').data(fruits);

  circles
    .enter()
    .append('circle')
      .attr('cx', (d, i) => i * 120 + 60)
      .attr('cy', height / 2)
    .merge(circles) selection. // (*) merge (enter and update)
      .attr('r', d => radiusScale(d.type))
      .attr('fill', d => colorScale(d.type));

  // exit
  circles.exit().remove();
};
```

## Nested Element(Group)

- Nested Element를 그룹으로 묶지 않은 경우 (반복되는 로직)

```js
const circles = selection.selectAll('circle').data(fruits); 
const text = selection.selectAll('text').data(fruits); 

circles // (*)
  .enter().append('circle')
    .attr('cx', (d, i) => i * 120 + 60)
    .attr('cy', height / 2)
  .merge(circles)
    .attr('r', d => radiusScale(d.type))
    .attr('fill', d => colorScale(d.type));
circles.exit().remove();

text // (*)
  .enter().append('text')
    .attr('x', (d, i) => i * 120 + 60)
    .attr('y', height / 2)
  .merge(text)
  .text(d => d.type)
text.exit().remove();
```

- 위의 예시를 그룹으로 묶어서 리팩토링 한 경우

```js
const groups = selection.selectAll('g').data(fruits);
const groupsEnter = groups.enter().append('g');

groupsEnter
  .merge(groups)
    .attr('transform', (d, i) =>
      `translate(${i * 180 + 100},${height / 2})`
    );
groups.exit().remove();

groupsEnter.append('circle')
  .merge(groups.select('circle'))
    .attr('r', d => radiusScale(d.type))
    .attr('fill', d => colorScale(d.type));

groupsEnter.append('text')
  .merge(groups.select('text'))
    .text(d => d.type)
    .attr('y', 120);
```

- DOM Structure

```js
<g>
  <circlr />
  <text />
</g>
<g>
  <circlr />
  <text />
</g>
...
```

## selection.data

- 일반 업데이트 패턴은 selection.data를 사용하여 새 데이터를 기반으로 DOM을 업데이트
- The general update pattern is a deprecated
- 기억하기 쉽고 간결하며 기본 동작이 더 좋기 때문이다
- 메서드 체인이 끊기는 것을 방지하기 위해 위의 코드는 selection.call을 사용하여 전환을 만듭니다.


### Singular Element

- Single Element를 다뤄야 하는 경우, 아래와 같이 작성한다.

```js
const renderBowl = selection.selectAll('rect')
  .data([null]) // (*)
  .enter().append('rect')
    .attr('y', 110)
    .attr('width', 920)
    .attr('height', 300)
    .attr('rx', 300 / 2);

/* 이렇게 작성한다면, 렌더링마다 "rect"가 생성된다.
  const renderBowl = selection.append('rect')
      .attr('y', 110)
      .attr('width', 920)
      .attr('height', 300)
      .attr('rx', 300 / 2);
*/
```

## Component

> D3.js에서도 재사용 가능한 컴포넌트를 만들 수 있다. 구조는 리액트와 비슷하다.

```js
// (*) index.js
render(svg, {
  fruits, 
  height: +svg.attr('height')
});

// (*) fruitBowl.js
const render = (selection, props) => {
  const { fruits, height } = props;
  const circles = selection.selectAll('circle').data(fruits); 

  // General Update Pattern
  circles
    .enter()
    .append('circle')
    .attr('cx', (d, i) => i * 120 + 60)
    .attr('cy', height / 2)
    .merge(circles)
    .attr('r', d => radiusScale(d.type))
    .attr('fill', d => colorScale(d.type));

  circles.exit().remove();
};
```

## Animated Transition

- selection.transition()

```js
// (*) index.js
render(svg, {
  fruits, 
  height: +svg.attr('height')
});

// (*) fruitBowl.js
d3.select("body")
  .transition()
    .style("background-color", "red");

// Transition function
const t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

d3.selectAll(".apple").transition(t)
    .style("fill", "red");

d3.selectAll(".orange").transition(t)
    .style("fill", "orange");
```

## Methods

> 자주 사용하는 method 정리

### select() / selectAll

DOM에 있는 element를 선택함

- const svg = select('svg')
- const svg = selectAll('rect')

### attr()

Attribute를 추가하거나 업데이트 함
d3.selectAll('rect').attr('width', 10)

- attr('x', 10)/(attr('y', 10)) xPosition, yPosition
- attr('width', 10)/(attr('height', 10)) 높이, 너비
- attr('cx', 100)/(attr('cy', 200)) position the x-centre, position the - Y-centre of circle
- attr('r', 50) radius
- attr('transform', `translate(0, 100)`) Transform(translate, scale, rotate)

아래처럼 function과 함께 사용할 수 있음

```js
d3.selectAll('circle')
  .attr('cx', function(d, i) {
    return i * 100;
  });
```

### Scale()

domain() 범위의 입력값이 들어오면 range() 범위의 결과값으로 바꿔주는 함수를 만든다. scale 종류는 총 12개가 있다.

- domain([min, max]): Set of values of data
- range([min, max]): set of resulting values of a function
- D3.js Tutorial(참고)
- d3.scaleLinear(참고)

domain은 데이터의 최소, 최대값으로, range는 그 데이터를 사용하여 표출할 범위의 너비, 높이 픽셀값으로 설정한다. (svg의 너비등)

```js
const xScale = scaleLinear()
  .domain([0, max(data, d => d.population)])
  .range([0, innerWidth]);

const yScale = scaleBand()
  .domain(data.map(d.country))
  .range([0, innerHeight])
  .padding(0.1);
```

### Classed

- 조건적으로 클래스를 추가한다.

### selection.call()

- Call에 정의된 함수를 단 한번만 실행한다.

```js
mapG.call(choroplethMap, {
  features,
  colorScale,
  colorValue
});
```

## D3.js와 React 함께 사용하기

> D3.js와 리액트를 함께 사용할 경우, 두 라이브러이 모두 DOM을 핸들링하려고 하기 때문에 적절하게 믹싱하는 것이 중요하다.

### select

예를 들어, DOM element를 선택해야 할 때, D3.js에서는 select()를 사용하지만 리액트에서는 useRef()을 사용할 수 있다. 따라서 아래와 같이 함께 사용할 수 있다. D3.js에서 제공하는 transition을 사용할 때도 마찬가지이다.

```js
function BarChart() {
  const [data, setData] = useState([...])
  const rectRef = useRef<GroupTag>(null);

  const handleDrawRect = useCallback(
    (group) => {
      group
        .selectAll('rect')
        .data(data)
        .join('rect')
  	//...
    },
    [data]
  );

  useEffect(() => {
    const rectGroup = select(rectRef.current); // (*)
    handleDrawRect(rectGroup);
  }, [handleDrawRect]);

  return (
      <svg width={WIDTH} height={HEIGHT}>
          <g ref={rectRef} />
        </Group>
      </svg>
  );
}
```


## 참고

- [x] [그래프 스타일링](http://urbaninstitute.github.io/graphics-styleguide/)
- [x] [JS-D3.js-알아보기](https://velog.io/@suyeonme/JS-D3.js-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0)
- [ ] [The General Update Pattern of D3.js](https://www.youtube.com/watch?v=IyIAR65G-GQ)
- [ ] [Curran Kelleher](https://www.youtube.com/@currankelleher/videos)
- [x] [general-update-pattern](https://observablehq.com/@d3/general-update-pattern)
- [x] [Input data transition for d3.js line chart](https://d3-graph-gallery.com/graph/line_change_data.html)
- [x] [d3-historical-prices-data-joins join 사용법 참고 예제](https://github.com/wentjun/d3-historical-prices-data-joins/blob/master/docs/chart.js)
- [x] [변하는 챠트 예제](https://pyarasid.github.io/D3.js-Animate_MultipleCharts_Button/)
- [ ] [D3 with React](https://ncoughlin.com/posts/d3-react/)
- [ ] [Using D3.js with React.js: An 8-step comprehensive manual](https://blog.griddynamics.com/using-d3-js-with-react-js-an-8-step-comprehensive-manual/)

## D3
- [x] [d3-scaleband](https://observablehq.com/@d3/d3-scaleband)

## MAP

- [map 관련 블로그](https://bekusib.tistory.com/232)
- [react-typescript-datamaps](https://github.com/orenef/react-typescript-datamaps)