/* eslint-disable @typescript-eslint/no-unused-vars */

import './sandbox';

import React, { useEffect, useRef, useState, useCallback } from 'react';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from './components';

import BuildALanguageTutorial from './applications/build-a-language-tutorial';
import LearnToCodeTutorial from './applications/learn-to-code-tutorial';

import Desktop from './components/desktop';
import Window from './components/window';
import Calendar from './components/calendar';
import Preferences from './applications/preferences';
import MugShot from './applications/mug-shot';
import Music from './applications/music';

import { AnalogClock } from './components/clock';

import styles from './App.module.scss';

function App() {
  return (
    <View horizontal className={styles.App}>
      <Desktop>
        <Window title="About" padding="large">
          <Text style={{ whiteSpace: 'nowrap' }}>React Desktop — 2022 Mike Austin</Text>
        </Window>
      </Desktop>
      <Desktop className={styles.dark}>
        <Window title="About" padding="large">
          <Text style={{ whiteSpace: 'nowrap' }}>React Desktop — 2022 Mike Austin</Text>
        </Window>
      </Desktop>
    </View>
  );
}

export default App;
