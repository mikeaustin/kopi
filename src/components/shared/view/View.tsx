import React from 'react';
import clsx from 'clsx';

import Color from '../../../types/Color';
import Padding from '../../../types/Padding';

import styles from './View.module.scss';
import backgroundColorStyles from '../../../styles/backgroundColor.module.scss';
import paddingStyles from '../../../styles/padding.module.scss';

interface ViewProps extends React.ComponentProps<'div'> {
  fill?: boolean,
  backgroundColor?: Color,
  padding?: Padding,
  className?: string,
  children?: React.ReactNode,
}

const View = ({
  fill,
  backgroundColor,
  padding,
  className,
  children,
  ...props
}: ViewProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const viewClassName = clsx(
    styles.View,
    fill && styles.fill,
    backgroundColor && backgroundColorStyles[backgroundColor],
    padding && paddingStyles[padding],
    className,
  );

  return (
    <div ref={ref} className={viewClassName} {...props}>
      {children}
    </div>
  );
};

export default React.forwardRef(View);
