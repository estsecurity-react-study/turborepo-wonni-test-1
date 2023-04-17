# D3 란?

D3.js 는 데이터를 기반으로 문서를 조작하기 위한 JavaScript 라이브러리입니다. 
D3는 HTML, SVG 및 CSS를 사용하여 데이터에 생명을 불어넣도록 도와줍니다. 
웹 표준에 대한 D3의 강조는 강력한 시각화 구성 요소와 DOM 조작에 대한 데이터 중심 접근 방식을 결합하여 독점 프레임워크에 얽매이지 않고 최신 브라우저의 모든 기능을 제공합니다.


## Introduction

D3를 사용하면 임의 데이터를 DOM(Document Object Model)에 바인딩한 다음 데이터 중심 변환을 document에 적용할 수 있습니다.
예를 들어 D3을 사용하여 숫자 배열에서 HTML 테이블을 생성할 수 있습니다. 또는 동일한 데이터를 사용하여 부드러운 전환과 인터랙션이 있는 SVG 막대 차트를 만들 수 있습니다.
D3는 상상할 수 있는 모든 특징을 제공하고자 하는 모놀리식 프레임워크가 아닙니다.
대신 D3는 데이터 기반의 효율적인 문서 조작이라는 문제의 핵심을 해결합니다.
따라서 독점적 표현을 피하고 뛰어난 유연성을 제공하므로 HTML, SVG 및 CSS와 같은 웹 표준의 모든 기능이 노출됩니다.
최소한의 오버헤드로 D3는 상호 작용 및 애니메이션을 위한 대규모 데이터셋과 동적 동작을 지원하므로 매우 빠릅니다.
D3의 기능적 스타일은 다양한 [공식 API](https://www.npmjs.com/search?q=keywords:d3-module) 및 [커뮤니티 개발 모듈](https://github.com/d3/d3/blob/main/API.md)을 통해 코드 재사용이 가능합니다.

## Selections

W3C DOM API를 사용하여 문서를 수정하는 것은 지루합니다. 메서드 이름은 너무 상세하며 명령적 접근 방식이기 때문에 임시 상태를 수동으로 반복하고 기록해야 합니다.

예를 들어,
태그의 텍스트 색상을 변경하려면 아래와 같이 코드를 작성해야 합니다.

```js
var paragraphs = document.getElementsByTagName("p");
for (var i = 0; i < paragraphs.length; i++) {
  var paragraph = paragraphs.item(i);
  paragraph.style.setProperty("color", "blue", null);
}
```

D3은 선언적 접근 방식을 채택하여 selection이라고 하는 임의 노드 집합에서 작동합니다.
예를 들어, 위의 루프를 다음과 같이 다시 작성할 수 있습니다.

```js
d3.selectAll("p").style("color", "blue");
```

그러나 필요에 따라 개별 노드를 조작할 수도 있습니다.

```js
d3.select("body").style("background-color", "black");
```

