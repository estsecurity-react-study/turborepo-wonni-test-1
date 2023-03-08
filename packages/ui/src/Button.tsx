import { forwardRef } from 'react';
import tw, { css } from 'twin.macro';

import { ButtonProps, Button as ESButton } from '@eds/ui';

const buttonStyle = css`
  ${tw`inline-flex items-center justify-center content-center flex-[0_0_auto]`}
  ${tw`box-border cursor-pointer`}
  ${tw`bg-transparent text-inherit`}
  ${tw`w-8 h-8 px-3 min-w-max`}
  ${tw`mr-5 border border-red-500`}
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...rest }, ref) => {
  const isOnlyIcon = !!children;
  return (
    <ESButton ref={ref} tw="text-blue-600" css={[buttonStyle, !isOnlyIcon && tw`px-0`]} {...rest}>
      {children}
    </ESButton>
  );
});
Button.displayName = 'Button';
