import React from 'react';
import clsx from 'clsx';

import useStyles from './styles.js';
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

interface ViewProps extends React.ComponentProps<'div'> {
  flex?: boolean,
  horizontal?: boolean,
  fillColor?: Color,
  padding?: CombinedPadding,
  className?: string,
  children?: React.ReactNode,
}

const View = ({
  flex,
  horizontal,
  fillColor,
  padding,
  className,
  children,
  ...props
}: ViewProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const styles = useStyles();
  const paddingVerticalStyles = usePaddingVerticalStyles();
  const paddingHorizontalStyles = usePaddingHorizontalStyles();
  const fillColorStyles = useFillColorStyles();

  const [paddingVertical, paddingHorizontal] = paddingToStyle(padding);

  const viewClassName = clsx(
    styles.View,
    flex && styles.flex,
    horizontal && styles.horizontal,
    fillColor && fillColorStyles[fillColor],
    paddingVertical && paddingVerticalStyles[paddingVertical],
    paddingHorizontal && paddingHorizontalStyles[paddingHorizontal],
    className,
  );

  return (
    <ViewContext.Provider value={{ isHorizontal: horizontal ?? false }}>
      <div ref={ref} className={viewClassName} {...props}>
        {children}
      </div>
    </ViewContext.Provider>
  );
};

export default React.forwardRef(View);
