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
  hover,
  rounded,
  leftIcon,
  rightIcon,
  ...props
}: {
  title: React.ReactNode;
  size?: 'xsmall' | 'small' | 'medium';
  primary?: boolean;
  solid?: boolean;
  link?: boolean;
  hover?: boolean;
  rounded?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & ViewProps) => {
  const containerClassName = classNames(
    styles.container,
    primary && styles.primary,
    solid && styles.solid,
    link && styles.link,
    hover && styles.hover,
    rounded && styles.rounded,
  );

  const textColor = primary && solid
    ? 'gray-0'
    : primary
      ? 'primary'
      : undefined;

  const titleText = typeof title === 'string' ? (
    <Text
      fontSize={size}
      fontWeight="bold"
      textColor={textColor}
      noSelect
      style={{ pointerEvents: 'none', textAlign: 'center', whiteSpace: 'nowrap' }}
    >
      {title}
    </Text>
  ) : React.isValidElement(title) && React.cloneElement(title, {
    style: {
      ...(title as any).props.style,
      fill: 'var(--theme-text-color)'
    }
  });
  console.log(titleText);
  return (
    <View
      tag="button"
      horizontal
      justifyContent="center"
      horizontalPadding={size === 'xsmall' ? 'small' : 'medium'}
      verticalPadding={size === 'xsmall' ? 'small' : 'small'}
      borderRadius={rounded ? 'max' : 'tiny'}
      className={containerClassName}
      {...props}
    >
      {leftIcon && (
        <>
          {leftIcon}
          <Spacer size="small" />
        </>
      )}
      {titleText}
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
