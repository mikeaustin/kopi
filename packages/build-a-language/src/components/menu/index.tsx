import React, { useContext } from 'react';
import { View, Text, Spacer, List } from '../index';
import classNames from 'classnames';

import { DesktopContext } from '../../components/desktop';

import { type ViewProps } from '../view';
import Window from '../window';

import BuildALanguageTutorial from '../../applications/build-a-language-tutorial';
import LearnToCodeTutorial from '../../applications/learn-to-code-tutorial';

import Preferences from '../../applications/preferences';
import Calendar from '../../components/calendar';
import Music from '../../applications/music';
import MugShot from '../../applications/mug-shot';
import Examples from '../../applications/examples';
import { AnalogClock } from '../../components/clock';

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
    background: horizontal ? undefined : 'theme-content',
    dropShadow: !horizontal,
    ...props,
  };

  return (
    <List className={classNames(styles.menu, !horizontal && styles.vertical)} {...containerProps}>
      {React.Children.map(children, (child) => React.isValidElement(child) && React.cloneElement(child, {
        parentHorizontal: horizontal,
      }))}
    </List>
  );
};

const MenuBar = () => {
  const { onAddWindow, onSetBackground } = useContext(DesktopContext) ?? { onAddWindow: null, onSetBackground: () => undefined };

  const handleAddPreferencesWindow = () => {
    if (onAddWindow) {
      onAddWindow(
        <Window noDivider title="Preferences" style={{ left: 15, top: 15, width: 500, height: 400 }}>
          <Preferences onSetBackground={onSetBackground} />
        </Window>
      );
    }
  };

  const handleAddTutorialWindow = () => {
    const inset = window.innerWidth < 1440 ? 8 : 15;

    if (onAddWindow) {
      onAddWindow(
        <Window
          title="Tutorial: Let’s Build a Programming Language"
          style={{
            left: inset,
            top: inset,
            width: Math.min(window.innerWidth - (inset * 2), 1920),
            height: Math.min(window.innerHeight - (inset * 2) - 47, 1080),
          }}
        >
          <BuildALanguageTutorial />
        </Window>
      );
    }
  };

  const handleAddTutorial2Window = () => {
    const inset = window.innerWidth < 1440 ? 8 : 15;

    if (onAddWindow) {
      onAddWindow(
        <Window
          title="Tutorial: Learn to Code"
          style={{
            left: 8,
            top: 8,
            width: Math.min(window.innerWidth - 16, 1920),
            height: Math.min(window.innerHeight - 16 - 47, 1080),
          }}
        >
          <LearnToCodeTutorial />
        </Window>
      );
    }
  };

  const handleAddClockWindow = () => {
    if (onAddWindow) {
      onAddWindow(
        <Window borderRadius="max" style={{ left: 15, top: 15, width: 200, height: 200 }}>
          <AnalogClock />
        </Window>
      );
    }
  };

  const handleAddCalendarWindow = () => {
    if (onAddWindow) {
      onAddWindow(
        <Window noDivider title="Calendar" style={{ left: 15, top: 15 }}>
          <Calendar />
        </Window>
      );
    }
  };

  const handleAddMusicWindow = () => {
    if (onAddWindow) {
      onAddWindow(
        <Window title="Music" style={{ left: 15, top: 15, width: 375, height: 365 }}>
          <Music />
        </Window>
      );
    }
  };

  const handleAddMugShotWindow = () => {
    if (onAddWindow) {
      onAddWindow(
        <Window title="MugShot" style={{ left: 15, top: 15, width: 1000 }}>
          <MugShot />
        </Window>
      );
    }
  };

  const handleAddExamplesWindow = () => {
    if (onAddWindow) {
      onAddWindow(
        <Window title="Examples" style={{ left: 15, top: 15 }}>
          <Examples />
        </Window>
      );
    }
  };

  return (
    <Menu horizontal>
      <MenuItem title="React Desktop">
        <MenuItem title="Desktop Preferences" onClick={handleAddPreferencesWindow} />
      </MenuItem>
      <MenuItem title="Tutorials">
        <MenuItem title="Let's Build a Programming Language" onClick={handleAddTutorialWindow} />
        <MenuItem title="Learn to Code using JavaScript" onClick={handleAddTutorial2Window} />
      </MenuItem>
      <MenuItem title="Utilities">
        <MenuItem title="Clock" onClick={handleAddClockWindow} />
        <MenuItem title="Calendar" onClick={handleAddCalendarWindow} />
        <MenuItem title="Music Player" onClick={handleAddMusicWindow} />
      </MenuItem>
      <MenuItem title="Samples">
        <MenuItem title="Text and Buttons" onClick={handleAddExamplesWindow} />
        <MenuItem title="MugShot Example" onClick={handleAddMugShotWindow} />
      </MenuItem>
    </Menu>
  );
};

export default MenuBar;

export {
  MenuBar
};
