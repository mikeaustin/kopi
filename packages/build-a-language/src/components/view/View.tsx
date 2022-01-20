import React, { KeyboardEventHandler, PointerEventHandler } from 'react';
import classNames from 'classnames';

import Color from '../color';

import styles from './View.module.scss';

import justifyContentStyles from '../../styles/justifyContent.module.scss';
import alignItemsStyles from '../../styles/alignItems.module.scss';
import paddingStyles from '../../styles/padding.module.scss';
import verticalPaddingStyles from '../../styles/verticalPadding.module.scss';
import horizontalPaddingStyles from '../../styles/horizontalPadding.module.scss';
import backgroundColorStyles from '../../styles/backgroundColor.module.scss';
import borderRadiusStyles from '../../styles/borderRadius.module.scss';

type ViewProps = {
  tag?: string | React.ComponentType<any>;
  style?: React.CSSProperties;
  src?: string;
  disabled?: boolean;
  children?: Exclude<React.ReactNode, React.ReactText>;
  foo?: React.ReactChild;
  bar?: React.ReactText;
  className?: string;
  flex?: boolean;
  horizontal?: boolean;
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  padding?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  verticalPadding?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  horizontalPadding?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  background?: Color;
  borderRadius?: boolean | 'xsmall' | 'small' | 'max';
  hidden?: boolean;
  dropShadow?: boolean;
  onPointerDown?: PointerEventHandler;
  onPointerMove?: PointerEventHandler;
  onPointerUp?: PointerEventHandler;
  onKeyDown?: KeyboardEventHandler;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

const View = React.forwardRef(({
  tag = 'div',
  style,
  src,
  disabled,
  children,
  className,
  flex,
  horizontal,
  justifyContent,
  alignItems,
  padding,
  verticalPadding,
  horizontalPadding,
  background,
  borderRadius,
  hidden,
  dropShadow,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  ...props
}: ViewProps, ref) => {
  const Component = tag;

  const containerClassName = classNames(
    styles.container,
    flex && styles.flex,
    horizontal && styles.horizontal,
    justifyContent && justifyContentStyles[justifyContent],
    alignItems && alignItemsStyles[alignItems],
    padding && paddingStyles[padding],
    verticalPadding && verticalPaddingStyles[verticalPadding],
    horizontalPadding && horizontalPaddingStyles[horizontalPadding],
    background && backgroundColorStyles[background],
    (typeof borderRadius === 'string' && borderRadiusStyles[borderRadius]) || (borderRadius && borderRadiusStyles.xsmall),
    hidden && styles.hidden,
    dropShadow && styles.dropShadow,
    className,
  );

  return (
    <Component
      ref={ref}
      className={containerClassName}
      disabled={disabled}
      style={style}
      src={src}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      {...props}
    >
      {children}
    </Component>
  );
});

export default View;

export type {
  ViewProps
};
