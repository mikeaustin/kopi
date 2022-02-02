import React from 'react';
import { View, Text, Spacer, List } from '../index';
import classNames from 'classnames';

import { type ViewProps } from '../view';

import styles from './Menu.module.scss';

const MenuItem = ({
  title,
  parentHorizontal,
  children,
  onClick,
}: {
  title: string;
  parentHorizontal?: boolean;
  children?: React.ReactElement | React.ReactElement[];
  onClick?: () => void;
}) => {
  return (
    <View className={styles.menuItem}>
      <View flex horizontal padding="small" horizontalPadding="medium" onClick={onClick}>
        <Text flex fontWeight="medium" className={styles.text}>
          {title}
        </Text>
        {!parentHorizontal && (
          <>
            <Spacer size="small" />
            <Text className={styles.text} style={{ visibility: children ? 'visible' : 'hidden' }}>❯</Text>
          </>
        )}
      </View>
      {children && (
        <View className={styles.items}>
          <Menu >{children}</Menu>
        </View>
      )}
    </View>
  );
};

const Menu = ({
  children,
  horizontal,
  ...props
}: {
  children?: React.ReactElement | React.ReactElement[],
  horizontal?: boolean;
} & ViewProps) => {
  const containerProps: ViewProps = {
    horizontal: horizontal,
    verticalPadding: !horizontal ? 'xsmall' : undefined,
    dropShadow: !horizontal,
    ...props,
  };

  return (
    <List background="white" className={classNames(styles.menu, !horizontal && styles.vertical)} {...containerProps}>
      {React.Children.map(children, (child) => React.isValidElement(child) && React.cloneElement(child, {
        parentHorizontal: horizontal,
      }))}
    </List>
  );
};

const MenuBar = () => {
  const handlePreferencesClick = () => {
    alert('here');
  };

  return (
    <Menu horizontal>
      <MenuItem title="React Desktop">
        <MenuItem title="Desktop Preferences" onClick={handlePreferencesClick} />
      </MenuItem>
      <MenuItem title="Tutorials">
        <MenuItem title="Let's Build a Programming Language" />
        <MenuItem title="Learn to Code using JavaScript" />
        <MenuItem title="MenuItem with Submenu">
          <MenuItem title="MenuItem" />
          <MenuItem title="MenuItem with Submenu">
            <MenuItem title="Submenu" />
            <MenuItem title="Submenu" />
          </MenuItem>
        </MenuItem>
      </MenuItem>
    </Menu>
  );
};

export default MenuBar;

export {
  MenuBar
};
