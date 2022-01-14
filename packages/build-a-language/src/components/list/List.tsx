import React from 'react';

import View, { type ViewProps } from '../view';
import Spacer from '../spacer';
import Divider from '../divider';

import type Color from '../color';

import styles from './List.module.scss';

const List = ({
  children,
  divider,
  spacerSize,
  spacerColor,
  ...props
}: {
  children?: Exclude<React.ReactNode, React.ReactText>;
  divider?: boolean;
  spacerSize?: 'small' | 'medium' | 'large';
  spacerColor?: Color;
} & ViewProps) => {
  return (
    <View className={styles.container} {...props}>
      {React.Children.map(children, (child, index) => (
        <>
          {divider && index > 0 && (
            <Divider />
          )}
          {spacerSize && index > 0 && (
            <Spacer size={spacerSize} background={spacerColor} />
          )}
          {child}
        </>
      ))}
    </View>
  );
};

export default List;
