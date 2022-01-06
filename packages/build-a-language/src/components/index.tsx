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

const Text = ({
  children,
  textParent,
  fontWeight,
  textColor,
}: {
  children: React.ReactNode;
  textParent?: boolean;
  fontWeight?: 'bold';
  textColor?: 'red';
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
