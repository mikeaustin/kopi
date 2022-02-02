import React from 'react';
import { View, Text, List } from '../index';

import styles from './Menu.module.scss';

const MenuItem = ({
  title,
  children,
  onClick,
}: {
  title: string;
  children?: React.ReactElement | React.ReactElement[];
  onClick?: () => void;
}) => {
  return (
    <View className={styles.menuItem}>
      <View flex padding="small" horizontalPadding="medium" onClick={onClick}>
        <Text fontWeight="medium" className={styles.text}>
          {title}
        </Text>
      </View>
      {children && (
        <View className={styles.items}>
          <List verticalPadding="xsmall" background="white" dropShadow style={{ position: 'absolute', zIndex: 1000 }}>
            {children}
          </List>
        </View>
      )}
    </View>
  );
};

const MenuBar = ({
  horizontal,
}: {
  horizontal?: boolean;
}) => {
  const handlePreferencesClick = () => {
    alert('here');
  };

  return (
    <List horizontal>
      <MenuItem title="React Desktop">
        <MenuItem title="Desktop Preferences" onClick={handlePreferencesClick} />
      </MenuItem>
      <MenuItem title="Tutorials">
        <MenuItem title="Let's Build a Programming Language" />
        <MenuItem title="Learn to Code using JavaScript" />
      </MenuItem>
    </List>
  );
};

export default MenuBar;

export {
  MenuBar
};
