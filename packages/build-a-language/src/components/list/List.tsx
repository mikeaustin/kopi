import React from 'react';

import View, { type ViewProps } from '../view';
import Spacer from '../spacer';
import Divider from '../divider';

import type Color from '../color';

import styles from './List.module.scss';

const List = ({
  children,
  wrap,
  divider,
  dividerInset,
  bottomDivider,
  spacerSize,
  spacerColor,
  ...props
}: {
  children: Exclude<React.ReactNode, React.ReactText>;
  wrap?: boolean;
  divider?: boolean;
  dividerInset?: boolean;
  bottomDivider?: boolean;
  spacerSize?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  spacerColor?: Color;
} & ViewProps) => {
  const childrenArray = React.Children.toArray(children);
  const selectedIndex = childrenArray.findIndex((child) => (child as React.ReactElement).props.selected);

  return (
    <View className={styles.container} {...props}>
      {React.Children.map(children, (child, index) => (
        <>
          {divider && index > 0 && (
            <Divider
              style={{ marginLeft: dividerInset ? 15 : 0, marginRight: dividerInset ? 15 : 0, visibility: (index === selectedIndex || index === selectedIndex + 1) ? 'hidden' : 'visible' }}
            />
          )}
          {spacerSize && index > 0 && (
            <Spacer size={spacerSize} background={spacerColor} />
          )}
          {child}
        </>
      ))}
      {bottomDivider && (
        <Divider style={{ visibility: (childrenArray.length - 1 === selectedIndex) ? 'hidden' : 'visible' }} />
      )}
    </View>
  );
};

export default List;
