import React, { useRef, useEffect } from 'react';

import { View, Text, Button, Stack, Spacer, Input } from 'core';

import './App.css';

function App() {
  const appElementRef = useRef<HTMLDivElement>(null);

  const handleAppPointerDown = () => {
    const searchParams = new URLSearchParams(window.location.search);

    console.log(searchParams.get('id'));

    window.parent.postMessage({
      type: 'bringWindowToTop',
      id: searchParams.get('id'),
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (appElementRef.current) {
        const rect = appElementRef.current.getBoundingClientRect();

        window.parent.postMessage({
          type: 'setClientDimensions',
          data: {
            width: rect.width,
            height: rect.height,
          }
        });
      }
    }, 0);
  }, []);

  return (
    <View flex fillColor="white" className="App" onPointerDown={handleAppPointerDown}>
      <View flex horizontal>
        <Stack flex ref={appElementRef} divider padding="medium" spacing="medium">
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
            <Stack flex spacing="small" align="center">
              <Stack horizontal spacing="small">
                <Button hover title="Hover" />
                <Button title="Default" />
                <Button solid title="Solid" />
                <Button primary title="Primary" />
                <Button primary solid title="Primary Solid" />
              </Stack>
              <Stack horizontal spacing="small">
                <Button icon="house" title="Default" />
                <Button icon="house" solid title="Solid" />
                <Button icon="house" primary title="Primary" />
                <Button icon="house" primary solid title="Primary Solid" />
              </Stack>
              <Stack horizontal spacing="small">
                <Button title="Multiline\nDefault" />
                <Button solid title="Multiline\nSolid" />
                <Button primary title="Multiline\nPrimary" />
                <Button primary solid title="Multiline\nPrimary Solid" />
              </Stack>
              <Stack horizontal spacing="small">
                <Button icon="house" />
                <Button icon="house" solid />
                <Button icon="house" primary />
                <Button icon="house" primary solid />
              </Stack>
            </Stack>
          </Stack>
          <Stack flex horizontal padding="medium" spacing="small" align="center" fillColor="gray-1">
            <Input label="First Name" />
            <Input label="Last Name" />
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
    </View>
  );
}

export default App;
