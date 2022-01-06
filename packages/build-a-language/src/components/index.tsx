import React from 'react';
import classNames from 'classnames';

import viewStyles from './View.module.scss';
import dividerStyles from './Divider.module.scss';

import justifyContentStyles from '../styles/justifyContent.module.scss';
import alignItemsStyles from '../styles/alignItems.module.scss';
import paddingStyles from '../styles/padding.module.scss';
import textColorStyles from '../styles/textColor.module.scss';
import fontWeightStyles from '../styles/fontWeight.module.scss';

const View = ({
  tag = 'div',
  children,
  className,
  flex,
  horizontal,
  justifyContent,
  alignItems,
  padding,
}: {
  tag?: string | React.ComponentType<any>;
  children?: React.ReactNode;
  className?: string;
  flex?: boolean;
  horizontal?: boolean;
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  padding?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}) => {
  const Component = tag;

  const containerClassName = classNames(
    viewStyles.container,
    flex && viewStyles.flex,
    horizontal && viewStyles.horizontal,
    justifyContent && justifyContentStyles[justifyContent],
    alignItems && alignItemsStyles[alignItems],
    padding && paddingStyles[padding],
    className,
  );

  return (
    <Component className={containerClassName}>
      {children}
    </Component>
  );
};

type Gray = 'gray-0' | 'gray-1' | 'gray-2' | 'gray-3' | 'gray-4' | 'gray-5' | 'gray-6' | 'gray-7' | 'gray-8' | 'gray-9';
type Red = 'red-0' | 'red-1' | 'red-2' | 'red-3' | 'red-4' | 'red-5' | 'red-6' | 'red-7' | 'red-8' | 'red-9';
type Pink = 'pink-0' | 'pink-1' | 'pink-2' | 'pink-3' | 'pink-4' | 'pink-5' | 'pink-6' | 'pink-7' | 'pink-8' | 'pink-9';
type Green = 'green-0' | 'green-1' | 'green-2' | 'green-3' | 'green-4' | 'green-5' | 'green-6' | 'green-7' | 'green-8' | 'green-9';

const Text = ({
  children,
  textParent,
  fontWeight,
  textColor,
  textColor2,
}: {
  children: React.ReactNode;
  textParent?: boolean;
  fontWeight?: 'bold';
  textColor?: Gray | Red | Pink | Green;
  textColor2?: ['red' | 'blue', 1 | 7];
}) => {
  const containerClassName = classNames(
    fontWeight && fontWeightStyles[fontWeight],
    textColor && textColorStyles[textColor],
  );

  const Component = textParent ? 'span' : 'div';

  return (
    <Component className={containerClassName}>
      {React.Children.map(children, child => {
        return React.isValidElement(child) ? React.cloneElement(child, {
          textParent: true,
        }) : child;
      })}
    </Component>
  );
};

const Divider = () => {
  const containerClassName = classNames(
    dividerStyles.container,
  );

  return (
    <View className={containerClassName} />
  );
};

export {
  View,
  Text,
  Divider,
};
