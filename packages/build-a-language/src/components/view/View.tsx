import React, { KeyboardEventHandler, PointerEventHandler } from 'react';
import classNames from 'classnames';

import Color from '../color';

import styles from './View.module.scss';

import justifyContentStyles from '../../styles/justifyContent.module.scss';
import alignItemsStyles from '../../styles/alignItems.module.scss';
import paddingStyles from '../../styles/padding.module.scss';
import verticalPaddingStyles from '../../styles/verticalPadding.module.scss';
import horizontalPaddingStyles from '../../styles/horizontalPadding.module.scss';
import topPaddingStyles from '../../styles/topPadding.module.scss';
import bottomPaddingStyles from '../../styles/bottomPadding.module.scss';
import backgroundColorStyles from '../../styles/backgroundColor.module.scss';
import borderRadiusStyles from '../../styles/borderRadius.module.scss';
import scrollSnapAlignStyles from '../../styles/scrollSnapAlign.module.scss';

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
  topPadding?: 'none' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  bottomPadding?: 'none' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  verticalPadding?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  horizontalPadding?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  background?: Color;
  borderRadius?: 'tiny' | 'xsmall' | 'small' | 'medium' | 'max';
  hidden?: boolean;
  scrollX?: boolean;
  scrollY?: boolean;
  scrollSnapX?: boolean;
  scrollSnapY?: boolean;
  scrollSnapAlign?: 'start' | 'center' | 'end';
  border?: boolean;
  dropShadow?: boolean;
  viewBox?: string;
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
  topPadding,
  bottomPadding,
  verticalPadding,
  horizontalPadding,
  background,
  borderRadius,
  hidden,
  scrollX,
  scrollY,
  scrollSnapX,
  scrollSnapY,
  scrollSnapAlign,
  border,
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
    topPadding && topPaddingStyles[topPadding],
    bottomPadding && bottomPaddingStyles[bottomPadding],
    verticalPadding && verticalPaddingStyles[verticalPadding],
    horizontalPadding && horizontalPaddingStyles[horizontalPadding],
    background && backgroundColorStyles[background],
    (typeof borderRadius === 'string' && borderRadiusStyles[borderRadius]) || (borderRadius && borderRadiusStyles.xsmall),
    hidden && styles.hidden,
    scrollX && styles.scrollX,
    scrollY && styles.scrollY,
    scrollSnapX && styles.scrollSnapX,
    scrollSnapY && styles.scrollSnapY,
    scrollSnapAlign && scrollSnapAlignStyles[scrollSnapAlign],
    border && styles.border,
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
