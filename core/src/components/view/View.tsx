import React from 'react';
import clsx from 'clsx';

import useStyles from './styles.js';
import { usePaddingStyles } from '../../styles/paddingStyles.js';
import useFillColorStyles from '../../styles/fillColorStyles.js';

import TextContext from '../text/TextContext.js';

import Color from '../../types/Color';
import Padding from '../../types/Padding';

interface ViewProps extends React.ComponentProps<'div'> {
  flex?: boolean,
  horizontal?: boolean,
  fillColor?: Color,
  padding?: Padding,
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
  const paddingStyles = usePaddingStyles();
  const fillColorStyles = useFillColorStyles();

  const viewClassName = clsx(
    styles.View,
    flex && styles.flex,
    horizontal && styles.horizontal,
    fillColor && fillColorStyles[fillColor],
    padding && paddingStyles[padding],
    className,
  );

  return (
    <TextContext.Provider value={false}>
      <div ref={ref} className={viewClassName} {...props}>
        {children}
      </div>
    </TextContext.Provider>
  );
};

export default React.forwardRef(View);
