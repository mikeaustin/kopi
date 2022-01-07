import React from 'react';

import styles from './App.module.scss';
import { View, Text, Button, Spacer, Divider, List } from './components';

function App() {
  return (
    <View className={styles.App}>
      <View alignItems="center" padding="medium">
        <Text fontSize="xlarge" fontWeight="bold">
          Header{' '}
          <Text textColor="red-7">Header</Text>
        </Text>
      </View>
      <Divider />
      <View flex horizontal>
        <View flex justifyContent="center" alignItems="center" padding="medium">
          <List>
            <Button title="Multiline\nPrimary Solid" />
            <Spacer size="medium" />
            <Button title="Press Me" />
          </List>
          <Spacer size="small" />
          <Text>Hello</Text>
          <Spacer size="small" />
          <List horizontal>
            <Button title="Press Me" />
            <Spacer size="medium" />
            <Button title="Press Me" />
          </List>
          <Spacer size="small" />
          <List divider>
            <Text fontSize="large">One</Text>
            <Text fontSize="large">Two</Text>
            <Text fontSize="large">Three</Text>
          </List>
        </View>
        <Divider />
        <View justifyContent="center" padding="medium">
          <View horizontal>
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
            <Divider spacerSize="medium" />
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
          </View>
          <Divider spacerSize="medium" />
          <View>
            <Text style={{ maxWidth: 'fit-content' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default App;
