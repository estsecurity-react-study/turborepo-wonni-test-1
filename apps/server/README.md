# Server

## 정보

- http://localhost:3002/

## 목표

- [x] tailwindCss 분리
- [x] postcss 분리
- [] emotion 분리
- [] twin.macro 분리

## babel

- Next.js 12 이후 버전에서 SWC 대신 바벨을 사용하도록 설정하는 방법은 매우 간단합니다. 
- 프로젝트에 커스텀 바벨 설정 파일인 .babelrc 파일이 존재하기만 하면 됩니다. 
- 프로젝트 루트 레벨에 .babelrc라는 이름의 파일을 만든 후, 다음과 같이 내용을 채워줍시다.

```js
{
    "presets": ["next/babel"] // Next.js 프로젝트 빌드를 위한 플러그인들이 모여있는 프리셋입니다.
}
```

## 참고
- [] https://fe-developers.kakaoent.com/2022/220217-learn-babel-terser-swc/