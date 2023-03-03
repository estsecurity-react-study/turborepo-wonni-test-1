import { Button } from "ui";
import tw, { css } from "twin.macro";

export const buttonStyle = css`
  ${tw`inline-flex items-center justify-center content-center flex-[0_0_auto]`}
  ${tw`box-border cursor-pointer`}
  ${tw`bg-transparent text-inherit`}
  ${tw`border border-gray-400 border-solid rounded`}
  ${tw`leading-none text-gray-900 align-middle`}
  ${tw`w-8 h-8 px-3 min-w-max`}

  &:hover:enabled {
    ${tw`bg-slate-800/5`}
  }
  &:active:enabled {
    ${tw`bg-slate-800/10`}
  }
  &:focus {
    ${tw`bg-slate-800`}
  }
  &:hover {
    ${tw`border-gray-400`}
  }
  &:disabled {
    ${tw`cursor-not-allowed`}
    ${tw`opacity-30`}
  }
`;

export default function Web() {
  return (
    <div
      css={css({
        backgroundColor: "yellow",
      })}
    >
      <h1 className="text-red-500">Web</h1>
      <h2>test</h2>
      <div css={[buttonStyle]}>
        제가 최근에 여행을 다녀왔는데 거기서 찍었던 사진을 가지고 몽환적인
        이미지를 만들어봤습니다.
      </div>
      <Button />
    </div>
  );
}
