import React from 'react';

import { View, Text, Button, Stack, Spacer } from 'core';

import './App.css';

function App() {
  return (
    <View className="App">
      <Stack horizontal divider padding="medium" spacing="medium">
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
