import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

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

const examples = (
  <iframe src="clients/examples" title="Examples" style={{ border: 'none', height: '100%' }} />
);

const calendar = (
  <iframe src="clients/calendar" style={{ border: 'none', height: '100%' }} />
);

const preferences = (
  <iframe src="clients/preferences" style={{ border: 'none', height: '100%' }} />
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

function App() {
  const [windows, setWindows] = useState([
    // { title: 'Draw', left: 20, top: 20, width: 1000, height: 600, client: draw },
    // { title: 'Movies', left: 1040, top: 20, width: 1000, height: 600, client: movies },
    // { title: 'Kopi', left: 2060, top: 20, width: 1000, height: 600, client: kopi },
    // { title: 'Gemtask', left: 20, top: 640, width: 1000, height: 600, client: gemtask },
    // { title: 'Language', left: 1040, top: 640, width: 1000, height: 600, client: language },
    // { title: 'Site', left: 2060, top: 640, width: 1000, height: 600, client: site },
    { title: 'Examples', left: 20, top: 20, width: 846, height: 510, src: 'clients/examples', id: uuid() },
    { title: 'Calendar', left: 885, top: 20, width: 360, height: 320, src: 'clients/calendar', id: uuid() },
    { title: 'Preferences', left: 885, top: 360, width: 500, height: 400, src: 'clients/preferences', id: uuid() },
    { title: 'Explorer', left: 20, top: 550, width: 846, height: 400, src: 'clients/explorer', id: uuid() },
    // { title: 'Asteroids', left: 20, top: 20, width: 800, height: 873, client: game },
  ]);
  const [windowOrder, setWindowOrder] = useState<string[]>(windows.map(({ id }) => id));

  const handleWindowMessage = (event: MessageEvent) => {
    if (event.data.type === 'setClientDimensions') {
      console.log('setClientDimensions', event.data.data);

      // setWindows(windows => windows.map(window => ({
      //   ...window,
      //   width: event.data.data.width,
      //   height: event.data.data.height,
      // })));
    } else if (event.data.type === 'bringWindowToTop') {
      console.log('bringWindowToTop', event.data.id);

      setWindowOrder(windowOrder => [
        ...windowOrder.filter((id) => id !== event.data.id),
        event.data.id,
      ]);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleWindowMessage);
  }, []);

  return (
    <View fill className="App">
      <Desktop fill backgroundUrl="images/653931.jpg">
        {windows.map((window) => (
          <Window key={window.id} id={window.id} src={window.src} title={window.title} config={window} order={windowOrder.indexOf(window.id)}>
          </Window>
        ))}
      </Desktop>
    </View>
  );
}

export default App;
