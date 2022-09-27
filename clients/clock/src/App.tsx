import React from 'react';

import { View, Text, Button, Stack } from 'core';

import './App.css';

function App() {
  return (
    <View className="App">
      <Stack horizontal padding="small">
        <Stack>
          <Text>Large</Text>
          <Text>Large</Text>
          <Text>Large</Text>
        </Stack>
        <Stack>
          <Button title="Hello World" />
        </Stack>
      </Stack>
    </View>
  );
}

export default App;
