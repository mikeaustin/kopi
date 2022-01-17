import React, { useEffect, useRef, useState, useCallback } from 'react';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from './components';

import Tutorial from './applications/tutorial/Tutorial';

import Desktop from './components/desktop';
import Window from './components/window';

import styles from './App.module.scss';

import * as page1 from './data/page1';
import * as page2 from './data/page2';
import * as page3 from './data/page3';
import * as page4 from './data/page4';

const FontSizes = () => {
  return (
    <View justifyContent="center">
      <Spacer size="small" background="gray-1" />
      <List spacerSize="small" spacerColor="gray-1" alignItems="center">
        <Text fontSize="xlarge" style={{ position: 'relative' }}>XLarge (36px)</Text>
        <Text fontSize="large" style={{ position: 'relative' }}>Large (24px)</Text>
        <Text fontSize="medium" style={{ position: 'relative' }}>Medium (18px)</Text>
        <Text fontSize="small" style={{ position: 'relative' }}>Small (14px)</Text>
        <Text fontSize="xsmall" style={{ position: 'relative' }}>XSmall (12px)</Text>
        <Text fontSize="tiny">TINY (11px)</Text>
      </List>
      <Spacer size="small" background="gray-1" />
    </View>
  );
};

const Buttons = () => {
  return (
    <View>
      <View horizontal justifyContent="center" alignItems="center">
        <Button link title="Link" />
        <Spacer size="small" />
        <Button title="Default" />
        <Spacer size="small" />
        <Button solid title="Solid" />
        <Spacer size="small" />
        <Button primary title="Primary" />
        <Spacer size="small" />
        <Button primary solid title="Primary Solid" />
      </View>
      <Spacer size="small" />
      <View horizontal justifyContent="center" alignItems="center">
        <Button link title="Multiline\nLink" />
        <Spacer size="small" />
        <Button title="Multiline\nDefault" />
        <Spacer size="small" />
        <Button solid title="Multiline\nSolid" />
        <Spacer size="small" />
        <Button primary title="Multiline\nPrimary" />
        <Spacer size="small" />
        <Button primary solid title="Multiline\nPrimary Solid" />
      </View>
      <Spacer size="small" />
      <View horizontal justifyContent="center" alignItems="center">
        <Button disabled link title="Link" />
        <Spacer size="small" />
        <Button disabled title="Default" />
        <Spacer size="small" />
        <Button disabled solid title="Solid" />
        <Spacer size="small" />
        <Button disabled primary title="Primary" />
        <Spacer size="small" />
        <Button disabled primary solid title="Primary Solid" />
      </View>
      <Spacer size="small" />
      <View horizontal justifyContent="center" alignItems="center">
        <Button rounded title="Default" />
        <Spacer size="small" />
        <Button rounded solid title="Solid" />
        <Spacer size="small" />
        <Button rounded primary title="Primary" />
        <Spacer size="small" />
        <Button rounded primary solid title="Primary Solid" />
      </View>
    </View>
  );
};

const Examples = ({ ...props }) => {
  return (
    <>
      <View justifyContent="center" padding="medium">
        <View horizontal>
          <FontSizes />
          <Divider spacerSize="medium" />
          <Buttons />
        </View>
        <Divider spacerSize="medium" />
        <View>
          <Text fitContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur.
          </Text>
        </View>
        <Divider spacerSize="medium" />
        <View horizontal>
          <Text fitContent fontSize="large" style={{ flex: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </Text>
          <Spacer size="medium" />
          <Text fitContent fontSize="medium" style={{ flex: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...
          </Text>
          <Spacer size="medium" />
          <Text fitContent style={{ flex: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...
          </Text>
        </View>
      </View>
    </>
  );
};

const pages = [
  page1,
  page2,
  page3,
  page4,
];

function App() {
  const windowElementRef = useRef<HTMLDivElement>();

  useEffect(() => {
    window.addEventListener('orientationchange', (event) => {
      setTimeout(() => {
        if (windowElementRef.current) {
          windowElementRef.current.style.width = Math.min(window.innerWidth - 16, 1680) + 'px';
          windowElementRef.current.style.height = Math.min(window.innerHeight - 16 - 47, 900) + 'px';
        }
      }, 100);
    });
  }, []);

  return (
    <View className={styles.App}>
      <View horizontal background="white" alignItems="center" padding="medium" dropShadow>
        <Text fontSize="medium" fontWeight="bold">
          Header
        </Text>
      </View>
      <View flex horizontal>
        <Desktop>
          <Window title="Examples" style={{ left: 16, top: 16 }}>
            <Examples />
          </Window>
          <Window
            ref={windowElementRef}
            title="Tutorial: Let’s Build a Programming Language"
            style={{
              left: 8,
              top: 8,
              width: Math.min(window.innerWidth - 16, 1680),
              height: Math.min(window.innerHeight - 16 - 47, 900),
            }}
          >
            <Tutorial pages={pages} />
          </Window>
        </Desktop>
      </View>
    </View>
  );
}

export default App;
