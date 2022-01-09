import React from 'react';
import classNames from 'classnames';

import Color from '../color';

import dividerStyles from './Divider.module.scss';

import View from '../view';
import Spacer from '../spacer';

const Divider = ({
  spacerSize,
  color,
}: {
  spacerSize?: 'small' | 'medium' | 'large';
  color?: Color;
}) => {
  const containerClassName = classNames(
    dividerStyles.container,
  );

  return (
    <>
      {spacerSize && (<Spacer size={spacerSize} />)}
      <View background={color ?? 'gray-3'} className={containerClassName} />
      {spacerSize && (<Spacer size={spacerSize} />)}
    </>
  );
};

export default Divider;
