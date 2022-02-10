import React from 'react';
import classNames from 'classnames';

import Color from '../color';

import dividerStyles from './Divider.module.scss';

import View, { ViewProps } from '../view';
import Spacer from '../spacer';

const Divider = ({
  spacerSize,
  color,
  ...props
}: {
  spacerSize?: 'small' | 'medium' | 'large';
  color?: Color;
} & ViewProps) => {
  const containerClassName = classNames(
    dividerStyles.container,
  );

  return (
    <>
      {spacerSize && (<Spacer size={spacerSize} />)}
      <View background={color ?? 'theme-divider'} className={containerClassName} {...props} />
      {spacerSize && (<Spacer size={spacerSize} />)}
    </>
  );
};

export default Divider;
