import React, { useRef, useState } from 'react';

import { View, Text } from './components/shared';

import Window from './components/shared/window';

import './App.css';

interface DesktopProps extends React.ComponentProps<typeof View> {
  backgroundUrl?: string,
  children?: React.ReactNode,
}

function Desktop({
  backgroundUrl,
  children,
}: DesktopProps) {
  return (
    <View fill style={{ background: `center / cover url(${backgroundUrl})` }}>
      <View padding="small" backgroundColor="white">
        <Text>Header</Text>
      </View>
      <View style={{ position: 'relative' }}>
        {children}
      </View>
    </View>
  );
}

function App() {
  const [windows, setWindows] = useState([
    {
      title: 'Clock',
      width: 200,
      height: 200,
      client: (
        <View padding="medium">
          <Text fontWeight="bold">
            Hello
            <Text textColor="red-5">
              World
            </Text>
          </Text>
        </View>
      )
    },
    {
      title: 'Clock',
      width: 1000,
      height: 800,
      client: (
        <iframe src="https://mike-austin.com/draw-2/" style={{ border: 'none', height: '100%' }} />
      )
    }
  ]);

  return (
    <View fill className="App">
      <Desktop fill backgroundUrl="images/triangles-colorful-green-colors-low-poly-abstract-4748.png">
        {windows.map((window, index) => (
          <Window key={index} title={window.title} config={window}>
            {window.client}
          </Window>
        ))}
      </Desktop>
    </View>
  );
}

export default App;
