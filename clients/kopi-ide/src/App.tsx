import React from 'react';
import CodeMirror from '@uiw/react-codemirror';

import { View, Stack, Text, Divider } from 'core';

import './App.css';

function App() {
  const handleChange = (value: string, viewUpdate: any) => {
    console.log(viewUpdate);
  };

  return (
    <Stack horizontal className="App">
      <View flex>
        <CodeMirror height="100%" style={{ height: '100%' }} onChange={handleChange} />
      </View>
      <Divider />
      <View flex padding="small">
        <Text>Output</Text>
      </View>
    </Stack>
  );
}

export default App;
