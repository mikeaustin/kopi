import React, { useRef, useState } from 'react';

import styles from './App.module.scss';
import { View, Text, Button, Spacer, Divider, List, Window } from './components';

const FontSizes = () => {
  return (
    <View flex justifyContent="center" alignItems="center">
      <Spacer size="small" background="gray-1" />
      <Text fontSize="xlarge">XLarge (36px)</Text>
      <Spacer size="small" background="gray-1" />
      <Text fontSize="large">Large (24px)</Text>
      <Spacer size="small" background="gray-1" />
      <Text fontSize="medium">Medium (18px)</Text>
      <Spacer size="small" background="gray-1" />
      <Text fontSize="small">Small (14px)</Text>
      <Spacer size="small" background="gray-1" />
      <Text fontSize="xsmall">XSmall (12px)</Text>
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
        <Button title="Default" borderRadius="max" />
        <Spacer size="small" />
        <Button solid title="Solid" borderRadius="max" />
        <Spacer size="small" />
        <Button primary title="Primary" borderRadius="max" />
        <Spacer size="small" />
        <Button primary solid title="Primary Solid" borderRadius="max" />
      </View>
    </View>
  );
};

function App() {
  const windowElementRef = useRef<HTMLElement>();
  const firstMouseRef = useRef<{ clientX: number, clientY: number; }>();

  const handleWindowStartDrag = (windowElement: HTMLElement, firstMouse: { clientX: number, clientY: number; }) => {
    windowElementRef.current = windowElement;
    firstMouseRef.current = firstMouse;
  };

  const handlePointerMove = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (windowElementRef.current && firstMouseRef.current) {
      windowElementRef.current.style.left = `${event.nativeEvent.clientX - firstMouseRef.current.clientX}px`;
      windowElementRef.current.style.top = `${event.nativeEvent.clientY - firstMouseRef.current.clientY}px`;
    }
  };

  const handleWindowEndDrag = (windowElement: HTMLElement) => {
    windowElementRef.current = undefined;
  };

  return (
    <View className={styles.App}>
      <View background="gray-8" alignItems="center" padding="medium">
        <Text fontSize="xlarge" fontWeight="bold">
          Header{' '}
          <Text textColor="red-7">Header</Text>
        </Text>
      </View>
      <View flex onPointerMove={handlePointerMove}>
        <Spacer size="large" />
        <Window
          style={{ left: 16, top: 78 }}
          onWindowStartDrag={handleWindowStartDrag}
          onWindowEndDrag={handleWindowEndDrag}
        >
          <View justifyContent="center" padding="medium">
            <View horizontal>
              <FontSizes />
              <Divider spacerSize="medium" />
              <Buttons />
            </View>
            <Divider spacerSize="medium" />
            <View>
              <Text style={{ maxWidth: 'fit-content' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                eu fugiat nulla pariatur.
              </Text>
            </View>
            <Divider spacerSize="medium" />
            <View horizontal>
              <Text fontSize="large" style={{ flex: 1, maxWidth: 'fit-content' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
              </Text>
              <Spacer size="medium" />
              <Text fontSize="medium" style={{ flex: 1, maxWidth: 'fit-content' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...
              </Text>
              <Spacer size="medium" />
              <Text style={{ flex: 1, maxWidth: 'fit-content' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...
              </Text>
            </View>
          </View>
        </Window>
      </View>
    </View>
  );
}

export default App;
