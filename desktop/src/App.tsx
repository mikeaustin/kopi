import React, { useRef, useState, useEffect } from 'react';

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

const clock = (
  <iframe src="clients/clock" style={{ border: 'none', height: '100%' }} />
);

const draw = (
  <iframe src="https://mike-austin.com/draw-2" style={{ border: 'none', height: '100%' }} />
);

const movies = (
  <iframe src="https://bestestmoviesever.com" style={{ border: 'none', height: '100%' }} />
);

const kopi = (
  <iframe src="https://mike-austin.com/kopi" style={{ border: 'none', height: '100%' }} />
);

const gemtask = (
  <iframe src="https://gemtask.mike-austin.com" style={{ border: 'none', height: '100%' }} />
);

const language = (
  <iframe src="https://mike-austin.com/build-a-language" style={{ border: 'none', height: '100%' }} />
);

const site = (
  <iframe src="https://mike-austin.com" style={{ border: 'none', height: '100%' }} />
);

const game = (
  <iframe src="https://editor.p5js.org/mike_ekim1024/full/q8nWdZV0U" style={{ border: 'none', height: '100%' }} />
);

const calendar = (
  <iframe src="clients/calendar" style={{ border: 'none', height: '100%' }} />
);

function App() {
  const [windows, setWindows] = useState([
    // { title: 'Draw', left: 20, top: 20, width: 1000, height: 600, client: draw },
    // { title: 'Movies', left: 1040, top: 20, width: 1000, height: 600, client: movies },
    // { title: 'Kopi', left: 2060, top: 20, width: 1000, height: 600, client: kopi },
    // { title: 'Gemtask', left: 20, top: 640, width: 1000, height: 600, client: gemtask },
    // { title: 'Language', left: 1040, top: 640, width: 1000, height: 600, client: language },
    // { title: 'Site', left: 2060, top: 640, width: 1000, height: 600, client: site },
    { title: 'Style Guide', left: 20, top: 20, width: 900, height: 450, client: clock },
    { title: 'Calendar', left: 20, top: 20, width: 360, height: 320, client: calendar },
    // { title: 'Asteroids', left: 20, top: 20, width: 800, height: 873, client: game },
  ]);

  const handleWindowMessage = (event: MessageEvent) => {
    if (event.data.type === 'setClientDimensions') {
      console.log('setClientDimensions', event.data.data);

      // setWindows(windows => windows.map(window => ({
      //   ...window,
      //   width: event.data.data.width,
      //   height: event.data.data.height,
      // })));
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleWindowMessage);
  }, []);

  return (
    <View fill className="App">
      <Desktop fill backgroundUrl="images/653931.jpg">
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
