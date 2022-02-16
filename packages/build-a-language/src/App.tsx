/* eslint-disable @typescript-eslint/no-unused-vars */

import './sandbox';

import React, { useEffect, useRef, useState, useCallback } from 'react';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from './components';

import Desktop from './components/desktop';
import Window from './components/window';

import styles from './App.module.scss';

function App() {
  return (
    <View horizontal className={styles.App}>
      <Desktop id="light">
        <Window title="About" padding="large" style={{ left: 15, top: 15 }}>
          <Text style={{ whiteSpace: 'nowrap' }}>React Desktop — 2022 Mike Austin</Text>
        </Window>
      </Desktop>
      <Desktop id="dark" className={styles.dark}>
      </Desktop>
    </View>
  );
}

export default App;
