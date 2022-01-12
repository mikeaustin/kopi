import React from 'react';

import View, { type ViewProps } from '../view';
import Divider from '../divider';

import styles from './List.module.scss';

const List = ({
  children,
  divider,
  ...props
}: {
  children?: Exclude<React.ReactNode, React.ReactText>;
  divider?: boolean;
} & ViewProps) => {
  return (
    <View tag="ul" className={styles.container} {...props}>
      {React.Children.map(children, (child, index) => (
        <View tag="li">
          {divider && index > 0 && (
            <Divider />
          )}
          {child}
        </View>
      ))}
    </View>
  );
};

export default List;
