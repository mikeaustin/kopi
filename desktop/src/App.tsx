import React, { useRef, useState, useEffect, useContext } from 'react';
import { v4 as uuid } from 'uuid';

import AppContext from './AppContext';

import { View, Text, Button } from 'core';
import Window from './components/shared/window';

import './App.css';

interface MenuProps extends React.ComponentProps<typeof Button> {
  title: string,
  titleFontWeight?: 'bold' | 'medium',
  children: React.ReactNode;
}

function Menu({
  title,
  titleFontWeight = 'medium',
  children,
  ...props
}: MenuProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleTitlePointerDown = () => {
    setIsMenuVisible(isMenuVisible => !isMenuVisible);
  };

  return (
    <View style={{ position: 'relative' }}>
      <Button title={title} titleFontWeight={titleFontWeight} style={{ justifyContent: 'center', cursor: 'pointer' }} onPointerDown={handleTitlePointerDown} {...props} />
      {isMenuVisible && (
        <View border fillColor="white" padding="small" style={{ position: 'absolute', top: '100%', zIndex: 1000, borderRadius: 2.5 }}>
          {React.Children.map(children, child => React.isValidElement(child) && child.type === Button
            ? React.cloneElement(child as React.ReactElement<React.ComponentProps<typeof Button>>, {
              titleFontWeight: 'medium',
              titleAlign: 'left',
            }) : (
              child
            ))}
        </View>
      )}
    </View>
  );
}

interface DesktopProps extends React.ComponentProps<typeof View> {
  backgroundUrl?: string,
  children?: React.ReactNode,
}

function Desktop({
  backgroundUrl,
  children,
}: DesktopProps) {
  const { onOpenWindow } = useContext(AppContext);

  const handleClick = () => {
    onOpenWindow('https://editor.p5js.org/mike_ekim1024/full/q8nWdZV0U');
  };

  return (
    <View flex style={{ background: `center / cover url(${backgroundUrl})` }}>
      <View horizontal padding="none small" fillColor="white">
        <Menu title="Desktop" titleFontWeight="bold">
          <Button title="Preferences" />
        </Menu>
        <Menu title="Applications">
          <Button title="Calendar" />
          <Button title="Explorer" />
          <Button title="Asteroids" onClick={handleClick} />
        </Menu>
      </View>
      <View style={{ position: 'relative' }}>
        {children}
      </View>
    </View>
  );
}

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
    // { title: 'Asteroids', left: 20, top: 20, width: 800, height: 873, src: 'https://editor.p5js.org/mike_ekim1024/full/q8nWdZV0U', id: uuid() },
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

  const handleOpenWindow = (src: string) => {
    console.log('handleOpenWindow');

    const newId = uuid();

    setWindows(windows => [
      ...windows,
      { title: 'Asteroids', left: 20, top: 20, width: 800, height: 874, src: 'https://editor.p5js.org/mike_ekim1024/full/q8nWdZV0U', id: newId },
    ]);

    setWindowOrder(windowOrder => [
      ...windowOrder.filter((id) => id !== newId),
      newId,
    ]);

  };

  return (
    <AppContext.Provider value={{ onOpenWindow: handleOpenWindow }}>
      <View flex className="App">
        <Desktop flex backgroundUrl="images/653931.jpg">
          {windows.map((window) => (
            <Window key={window.id} id={window.id} src={window.src} title={window.title} config={window} order={windowOrder.indexOf(window.id)} />
          ))}
        </Desktop>
      </View>
    </AppContext.Provider>
  );
}

export default App;
