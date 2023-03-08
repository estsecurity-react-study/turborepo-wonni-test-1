import React from 'react';
import tw, { css } from 'twin.macro';

import { ButtonProps, Button as ESButton } from '@eds/ui';

export const buttonStyle = css`
  ${tw`inline-flex items-center justify-center content-center flex-[0_0_auto]`}
  ${tw`box-border cursor-pointer`}
  ${tw`bg-transparent text-inherit`}
  ${tw`w-8 h-8 px-3 min-w-max`}
  ${tw`border-red-500 border mr-5`}
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...rest }, ref) => {
  const isOnlyIcon = !!children;
  return (
    <ESButton ref={ref} css={[!isOnlyIcon && tw`px-0`]}>
      {children}
    </ESButton>
  );
});

export type { ButtonProps };
export default Button;

Button.displayName = 'Button';
