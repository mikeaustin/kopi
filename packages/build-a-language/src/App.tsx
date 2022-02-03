/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState, useCallback } from 'react';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from './components';

import BuildALanguageTutorial from './applications/build-a-language-tutorial';
import LearnToCodeTutorial from './applications/learn-to-code-tutorial';

import Desktop from './components/desktop';
import Window from './components/window';
import Calendar from './components/calendar';
import Preferences from './applications/preferences';

import { DigitalClock } from './components/clock';
import { MenuBar } from './components/menu';

import styles from './App.module.scss';


const FontSizes = () => {
  return (
    <View justifyContent="center">
      <Spacer size="small" background="gray-1" />
      <List spacerSize="small" spacerColor="gray-1" alignItems="center">
        <Text fontSize="xlarge" style={{ position: 'relative', whiteSpace: 'nowrap' }}>XLarge (30px)</Text>
        <Text fontSize="large" style={{ position: 'relative', whiteSpace: 'nowrap' }}>Large (24px)</Text>
        <Text fontSize="medium" style={{ position: 'relative', whiteSpace: 'nowrap' }}>Medium (18px)</Text>
        <Text fontSize="small" style={{ position: 'relative', whiteSpace: 'nowrap' }}>Small (14px)</Text>
        <Text fontSize="xsmall" style={{ position: 'relative', whiteSpace: 'nowrap' }}>XSmall (12px)</Text>
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

const Examples = () => {
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

function App() {
  const [backgroundUrl, setBackgroundUrl] = useState('./images/d1e91a4058a8a1082da711095b4e0163.jpg');

  const handleSetBackground = (url: string) => {
    setBackgroundUrl(url);
  };

  const inset = window.innerWidth < 1440 ? 8 : 15;

  return (
    <View className={styles.App} style={{ backgroundImage: `url(${backgroundUrl})` }}>
      <View horizontal background="white" alignItems="center" dropShadow /* style={{ background: 'hsla(210, 100%, 98%, 0.9)' }} */>
        <MenuBar />
        <Spacer flex />
        <DigitalClock horizontalPadding="medium" />
      </View>
      <View flex horizontal>
        <Desktop>
          <Window title="Examples" style={{ left: 30, top: 30 }}>
            <Examples />
          </Window>
          <Window title="Preferences" style={{ left: 45, top: 45, width: 500 }}>
            <Preferences onSetBackground={handleSetBackground} />
          </Window>
          <Window title="Calendar" style={{ left: 60, top: 60 }}>
            <Calendar />
          </Window>
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
          {/* <Window
            title="Tutorial: Learn to Code"
            style={{
              left: 8,
              top: 8,
              width: Math.min(window.innerWidth - 16, 1920),
              height: Math.min(window.innerHeight - 16 - 47, 1080),
            }}
          >
            <LearnToCodeTutorial />
          </Window> */}
          <Window title="MugShot" style={{ left: 1000, top: 400, width: 1000 }}>
            <View flex padding="large" alignItems="center" background="gray-1">
              <View border borderRadius="small" style={{ width: '100%', maxWidth: 800 }}>
                <View padding="medium" background="white">
                  <Text fontWeight="bold">Weyland-Yutani Corporation</Text>
                  <Spacer size="small" />
                  <Text fontSize="xsmall" textColor="gray-6">
                    <Text fontWeight="medium">Magnus C. Christian</Text> – 23h
                  </Text>
                </View>
                <Divider />
                <View style={{ height: 100 }} />
                <Divider />
                <View padding="medium" background="white">
                  <View horizontal>
                    <Text>591</Text>
                    <Spacer flex />
                    <Text>87 Comments</Text>
                  </View>
                  <Spacer size="medium" />
                  <Divider />
                  <Spacer size="xsmall" />
                  <View horizontal>
                    <Button flex title="Like" />
                    <Spacer size="small" />
                    <Button flex title="Comment" />
                    <Spacer size="small" />
                    <Button flex title="Share" />
                  </View>
                  <Spacer size="xsmall" />
                  <Divider />
                  <Spacer size="medium" />
                  <View>
                    <View padding="medium" background="gray-1" borderRadius="max">
                      <Text>Add a comment...</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Window>
        </Desktop>
      </View>
    </View>
  );
}

export default App;
