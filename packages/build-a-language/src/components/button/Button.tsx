import React from 'react';
import classNames from 'classnames';

import View, { type ViewProps } from '../view';
import Text from '../text';
import Spacer from '../spacer';

import styles from './Button.module.scss';

const Button = ({
  title,
  size = 'small',
  primary,
  solid,
  link,
  rounded,
  leftIcon,
  rightIcon,
  ...props
}: {
  title: string;
  size?: 'xsmall' | 'small' | 'medium';
  primary?: boolean;
  solid?: boolean;
  link?: boolean;
  rounded?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & ViewProps) => {
  const containerClassName = classNames(
    styles.container,
    primary && styles.primary,
    solid && styles.solid,
    link && styles.link,
    rounded && styles.rounded,
  );

  const textColor = primary && solid
    ? 'gray-0'
    : primary || link
      ? 'primary'
      : undefined;

  return (
    <View
      tag="button"
      horizontal
      justifyContent="center"
      horizontalPadding={size === 'xsmall' ? 'small' : 'medium'}
      verticalPadding={'small'}
      borderRadius={rounded ? 'max' : true}
      className={containerClassName}
      {...props}
    >
      {leftIcon && (
        <>
          {leftIcon}
          <Spacer size="small" />
        </>
      )}
      <Text
        fontSize={size}
        fontWeight="bold"
        textColor={textColor}
        noSelect
        style={{ pointerEvents: 'none', textAlign: 'center' }}
      >
        {title}
      </Text>
      {rightIcon && (
        <>
          <Spacer size="small" />
          {rightIcon}
        </>
      )}
    </View>
  );
};

export default Button;
