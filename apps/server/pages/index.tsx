import tw, { css } from 'twin.macro';
import { Button } from 'ui';

export const divStyle = css`
  ${tw`leading-none text-gray-900 align-middle text-body-13R`}
`;

export default function Server() {
  return (
    <div
      css={css({
        backgroundColor: 'yellow',
      })}
    >
      <h1 className="text-3xl text-blue-500">Server</h1>
      <h2 css={[divStyle]}>test</h2>
      <h2 css={tw`flex flex-row justify-center gap-x-[16px]`}>
        이 부분은 단순히 tailwind config에 등록한 예약어 사용을 보여주기 위한 예제로, <br />
        기존 Storybook의 의도와는 조금 다를 수 있습니다. <br />
        때문에 storybook에서만 보지 않고 해당 파일의 코드를 읽어보시면 더 빠른 이해가 가능합니다.
      </h2>
      <div css={tw`flex flex-col mb-2`}>
        <h3 css={tw`text-body-18R`}>Body-18R</h3>
        <h3 css={tw`text-body-18M`}>Body-18M</h3>
        <h3 css={tw`text-body-18B`}>Body-18B</h3>
      </div>
      <div css={tw`bg-blueGray-700`}>
        제가 최근에 여행을 다녀왔는데 거기서 찍었던 사진을 가지고 몽환적인 이미지를 만들어봤습니다.
      </div>
      <div css={tw`flex mt-5`}>
        <Button>Test2</Button>
        <Button />
      </div>
    </div>
  );
}
