import React from 'react';
import classNames from 'classnames';

import dividerStyles from './Divider.module.scss';

import View from '../view';
import Spacer from '../spacer';

const Divider = ({
  spacerSize
}: {
  spacerSize?: 'small' | 'medium' | 'large';
}) => {
  const containerClassName = classNames(
    dividerStyles.container,
  );

  return (
    <>
      {spacerSize && (<Spacer size={spacerSize} />)}
      <View className={containerClassName} />
      {spacerSize && (<Spacer size={spacerSize} />)}
    </>
  );
};

export default Divider;
