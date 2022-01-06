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
            <Button title="Press Me" />
            <Spacer size="medium" />
            <Button title="Press Me" />
          </List>
          <Text>Hello</Text>
          <List horizontal>
            <Button title="Press Me" />
            <Spacer size="medium" />
            <Button title="Press Me" />
          </List>
          <List divider>
            <Text fontSize="large">One</Text>
            <Text fontSize="large">Two</Text>
            <Text fontSize="large">Three</Text>
          </List>
        </View>
        <Divider />
        <View flex justifyContent="center" alignItems="center" padding="medium">
          <Spacer size="small" background="gray-7" />
          <Text fontSize="xsmall">Extra Small</Text>
          <Spacer size="small" background="gray-7" />
          <Text fontSize="small">Small</Text>
          <Spacer size="small" background="gray-7" />
          <Text fontSize="medium">Medium</Text>
          <Spacer size="small" background="gray-7" />
          <Text fontSize="large">Large</Text>
          <Spacer size="small" background="gray-7" />
          <Text fontSize="xlarge">Extra Large</Text>
          <Spacer size="small" background="gray-7" />
        </View>
      </View>
    </View>
  );
}

export default App;
