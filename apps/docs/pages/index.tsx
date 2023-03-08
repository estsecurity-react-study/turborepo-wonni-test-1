import tw, { css } from 'twin.macro';

export default function Web() {
  return (
    <div
      css={css({
        backgroundColor: 'yellow',
      })}
    >
      <h1 className="text-3xl text-blue-500">Docs</h1>
    </div>
  );
}
