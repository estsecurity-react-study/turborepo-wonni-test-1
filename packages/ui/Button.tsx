import React from 'react';
import tw, { css } from 'twin.macro';

import { ButtonProps, Button as ESButton } from '@eds/ui';

const buttonStyle = css`
  ${tw`inline-flex items-center justify-center content-center flex-[0_0_auto]`}
  ${tw`box-border cursor-pointer`}
  ${tw`bg-transparent text-inherit`}
  ${tw`w-8 h-8 px-3 min-w-max`}
  ${tw`border-red-500 border mr-5`}

  &:hover:enabled {
    ${tw`bg-slate-800/5`}
  }
  &:active:enabled {
    ${tw`bg-slate-800/10`}
  }
  &:focus {
    ${tw`border-primary`}
  }
  &:hover {
    ${tw`border-gray-400`}
  }
  &:disabled {
    ${tw`cursor-not-allowed`}
    ${tw`opacity-30`}
  }

  // Variant
  &.es-button--primary {
    ${tw`text-white border-none bg-primary`}
    &:hover:enabled {
      ${tw`bg-primary-hover`}
    }
    &:active:enabled {
      ${tw`bg-primary`}
    }
  }

  &.es-button--link {
    ${tw`underline bg-transparent`}
    ${tw`p-0 border-0`}
    &:hover:enabled,
    &:active:enabled {
      ${tw`bg-transparent text-primary`}
    }
  }

  &.es-button--ghost {
    ${tw`text-primary`}
    ${tw`bg-transparent`}
  }

  &.es-button--dashed {
    ${tw`border-dashed`}
  }

  // Icon
  .es-button__icon,
  .es-button__icon-right {
    ${tw`align-middle`}
    line-height: 0;
  }

  .es-button__icon + .es-button__text {
    ${tw`ml-1`}
  }
  .es-button__text + .es-button__icon-right {
    ${tw`ml-1`}
  }

  // Sizes
  &.es-button--sm {
    ${tw`px-3 w-7 h-7 text-caption-12R`}
  }

  &.es-button--lg {
    ${tw`px-4 w-9 h-9 text-body-13M`}
  }
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...rest }, ref) => {
  const isOnlyIcon = !!children;
  const sample = [buttonStyle, !isOnlyIcon && tw`px-0`];
  return (
    <ESButton ref={ref} css={sample} {...rest}>
      {children}
    </ESButton>
  );
});

export type { ButtonProps };
export default Button;

Button.displayName = 'Button';
