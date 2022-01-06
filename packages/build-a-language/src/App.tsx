import React from 'react';

import styles from './App.module.scss';
import { View, Text, Divider } from './components';

function App() {
  return (
    <View className={styles.App}>
      <View alignItems="center" padding="medium">
        <Text fontWeight="bold">
          Header{' '}
          <Text textColor="red-7" textColor2={['red', 7]}>Header</Text>
        </Text>
      </View>
      <Divider />
      <View flex horizontal>
        <View flex justifyContent="center" alignItems="center" padding="medium">
          <Text>Hello</Text>
        </View>
        <Divider />
        <View flex justifyContent="center" alignItems="center" padding="medium">
          <Text>World</Text>
        </View>
      </View>
    </View>
  );
}

export default App;
