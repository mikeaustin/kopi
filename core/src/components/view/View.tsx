import React from 'react';
import clsx from 'clsx';

import useStyles from './styles.js';
import { useBorderColorStyles } from '../../styles/borderColorStyles.js';
import { useAlignVerticalStyles, useAlignHorizontalStyles } from '../../styles/alignStyles.js';
import { usePaddingVerticalStyles, usePaddingHorizontalStyles } from '../../styles/paddingStyles.js';
import useFillColorStyles from '../../styles/fillColorStyles.js';

import ViewContext from './ViewContext.js';

import Color from '../../types/Color';
import Padding, { CombinedPadding } from '../../types/Padding';

function paddingToStyle(padding: CombinedPadding | undefined): [Padding | undefined, Padding | undefined] {
  switch (padding) {
    case 'small':
      return ['small', 'small'];
    case 'medium':
      return ['medium', 'medium'];
    case 'large':
      return ['large', 'large'];
    case 'small medium':
      return ['small', 'medium'];
    case 'small large':
      return ['small', 'large'];
    case 'medium small':
      return ['medium', 'small'];
    default:
      return [undefined, undefined];
  }
}

type ShorthandAlign =
  | 'top left' | 'top' | 'top right'
  | 'left' | 'center' | 'right'
  | 'bottom left' | 'bottom' | 'bottom right'
  ;

type Align = 'start' | 'center' | 'end';

function alignToStyle(align: ShorthandAlign | undefined): [Align | undefined, Align | undefined] {
  switch (align) {
    case 'top left':
      return ['start', 'start'];
    case 'top':
      return ['start', 'center'];
    case 'top right':
      return ['start', 'end'];
    case 'left':
      return ['center', 'start'];
    case 'center':
      return ['center', 'center'];
    case 'right':
      return ['center', 'end'];
    case 'bottom left':
      return ['end', 'start'];
    case 'bottom':
      return ['end', 'center'];
    case 'bottom right':
      return ['end', 'end'];
    default:
      return [undefined, undefined];
  }
}

interface ViewProps extends React.ComponentProps<'div'> {
  as?: React.ElementType,
  flex?: boolean,
  horizontal?: boolean,
  align?: 'center',
  fillColor?: Color,
  padding?: CombinedPadding,
  border?: boolean,
  borderColor?: Color,
  className?: string,
  children?: React.ReactNode,
}

const View = ({
  as: Component = 'div',
  flex,
  horizontal,
  align,
  fillColor,
  padding,
  border,
  borderColor,
  className,
  children,
  ...props
}: ViewProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const styles = useStyles();
  const borderColorStyles = useBorderColorStyles();
  const alignVerticalStyles = useAlignVerticalStyles();
  const alignHorizontalStyles = useAlignHorizontalStyles();
  const paddingVerticalStyles = usePaddingVerticalStyles();
  const paddingHorizontalStyles = usePaddingHorizontalStyles();
  const fillColorStyles = useFillColorStyles();

  const [paddingVertical, paddingHorizontal] = paddingToStyle(padding);
  const [alignVertical, alignHorizontal] = alignToStyle(align);

  const viewClassName = clsx(
    styles.View,
    flex && styles.flex,
    horizontal && styles.horizontal,
    fillColor && fillColorStyles[fillColor],
    border && borderColorStyles[borderColor ?? 'gray-3'],
    alignVertical && alignVerticalStyles[alignVertical],
    alignHorizontal && alignHorizontalStyles[alignHorizontal],
    paddingVertical && paddingVerticalStyles[paddingVertical],
    paddingHorizontal && paddingHorizontalStyles[paddingHorizontal],
    className,
  );

  return (
    <ViewContext.Provider value={{ isHorizontal: horizontal ?? false }}>
      <Component ref={ref} className={viewClassName} {...props}>
        {children}
      </Component>
    </ViewContext.Provider>
  );
};

export default React.forwardRef(View);
