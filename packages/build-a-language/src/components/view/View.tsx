import React from 'react';
import classNames from 'classnames';

import Color from '../color';

import viewStyles from './View.module.scss';

import justifyContentStyles from '../../styles/justifyContent.module.scss';
import alignItemsStyles from '../../styles/alignItems.module.scss';
import paddingStyles from '../../styles/padding.module.scss';
import backgroundColorStyles from '../../styles/backgroundColor.module.scss';
import borderRadiusStyles from '../../styles/borderRadius.module.scss';

type ViewProps = {
  tag?: string | React.ComponentType<any>;
  disabled?: boolean;
  children?: undefined | false | React.ReactElement | (undefined | false | React.ReactElement)[];
  className?: string;
  flex?: boolean;
  horizontal?: boolean;
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  padding?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  background?: Color;
  borderRadius?: boolean | 'xsmall';
};

const View = ({
  tag = 'div',
  disabled,
  children,
  className,
  flex,
  horizontal,
  justifyContent,
  alignItems,
  padding,
  background,
  borderRadius,
  ...props
}: ViewProps) => {
  const Component = tag;

  const containerClassName = classNames(
    viewStyles.container,
    flex && viewStyles.flex,
    horizontal && viewStyles.horizontal,
    justifyContent && justifyContentStyles[justifyContent],
    alignItems && alignItemsStyles[alignItems],
    padding && paddingStyles[padding],
    background && backgroundColorStyles[background],
    (typeof borderRadius === 'string' && borderRadiusStyles[borderRadius]) || (borderRadius && borderRadiusStyles.xsmall),
    className,
  );

  return (
    <Component className={containerClassName} disabled={disabled} {...props}>
      {children}
    </Component>
  );
};

export default View;

export type {
  ViewProps
};