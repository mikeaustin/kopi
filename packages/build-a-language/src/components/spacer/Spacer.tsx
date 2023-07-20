import React from 'react';
import classNames from 'classnames';

import View, { type ViewProps } from '../view';

import styles from './Spacer.module.scss';

type SpacerProps = {
  size?: 'tiny' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
};

const Spacer = ({
  size,
  ...props
}: SpacerProps & ViewProps) => {
  const containerClassName = classNames(
    styles.container,
    size && styles[size],
  );

  return (
    <View className={containerClassName} {...props} />
  );
};

export default Spacer;
