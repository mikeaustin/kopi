import React from 'react';
import classNames from 'classnames';

// import { View, Text } from '../index';
import View, { type ViewProps } from '../view';
import Text from '../text';

import styles from './Button.module.scss';

const Button = ({
  title,
  primary,
  solid,
  link,
  ...props
}: {
  title: string;
  primary?: boolean;
  solid?: boolean;
  link?: boolean;
} & ViewProps) => {
  const containerClassName = classNames(
    styles.container,
    primary && styles.primary,
    solid && styles.solid,
    link && styles.link,
  );

  const textColor = primary && solid
    ? 'gray-0'
    : primary || link
      ? 'primary'
      : undefined;

  return (
    <View tag="button" borderRadius className={containerClassName} {...props}>
      <Text fontWeight="bold" textColor={textColor}>{title}</Text>
    </View>
  );
};

export default Button;
