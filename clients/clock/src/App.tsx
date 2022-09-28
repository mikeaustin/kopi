import React from 'react';

import { View, Text, Button, Stack, Spacer } from 'core';

import './App.css';

function App() {
  return (
    <View horizontal fillColor="white" className="App">
      <Stack divider padding="medium" spacing="medium">
        <Stack horizontal divider spacing="medium">
          <Stack spacing="small" spacingColor="gray-1" align="center">
            <Text fontSize="xlarge">XLarge (32px)</Text>
            <Text fontSize="large">Large (24px)</Text>
            <Text fontSize="medium">Medium (18px)</Text>
            <Text>Default (14px)</Text>
            <Text fontSize="small">Small (12px)</Text>
            <Text fontSize="xsmall">XSmall (11px)</Text>
            <Stack horizontal spacing="small">
              <Text fontWeight="light">Light</Text>
              <Text>Normal</Text>
              <Text fontWeight="medium">Medium</Text>
              <Text fontWeight="semi-bold">Semi-Bold</Text>
              <Text fontWeight="bold">Bold</Text>
            </Stack>
            <Stack horizontal spacing="small">
              <Text light>Light</Text>
            </Stack>
          </Stack>
          <Stack>
            <Button title="Hello World" />
          </Stack>
        </Stack>
        <Text contain>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </Text>
        <Stack horizontal spacing="medium">
          <Text fontSize="large" style={{ width: 250 }}>
            Lorem ipsum dolor sit amet, consectetur…
          </Text>
          <Text fontSize="medium" style={{ width: 250 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing…
          </Text>
          <Text style={{ width: 250 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do…
          </Text>
        </Stack>
      </Stack>
    </View>
  );
}

export default App;
