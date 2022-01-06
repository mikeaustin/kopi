import React from 'react';
import classNames from 'classnames';

import dividerStyles from './Divider.module.scss';

import View from '../view';

const Divider = () => {
  const containerClassName = classNames(
    dividerStyles.container,
  );

  return (
    <View className={containerClassName} />
  );
};

export default Divider;
