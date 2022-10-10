import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from 'react';
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
      <Button hover title={title} titleFontWeight={titleFontWeight} style={{ justifyContent: 'center', cursor: 'pointer' }} onPointerDown={handleTitlePointerDown} {...props} />
      {isMenuVisible && (
        <View border fillColor="white" padding="small" style={{ position: 'absolute', top: '100%', zIndex: 1000, borderRadius: 2.5, boxShadow: '0 4px 8px hsla(0, 0%, 0%, 0.24), 0 0 0 1px hsla(0, 0%, 0%, 0.1)' }}>
          {React.Children.map(children, child => React.isValidElement(child) && child.type === Button
            ? React.cloneElement(child as React.ReactElement<React.ComponentProps<typeof Button>>, {
              hover: true,
              titleFontWeight: 'medium',
              titleAlign: 'left',
              onPointerUp: (event: any) => { child.props.onPointerUp(event, child.props.data); setIsMenuVisible(false); },
            }) : (
              child
            ))}
        </View>
      )}
    </View>
  );
}

const applicationsMenu = [
  { title: 'Calendar', width: 360, height: 320, src: 'clients/calendar' },
  { title: 'Asteroids', width: 800, height: 873, src: 'https://editor.p5js.org/mike_ekim1024/full/q8nWdZV0U' },
  { title: 'The io language', width: 800, height: 873, src: 'https://iolanguage.org' },
  { title: 'Learn to code using p5.js', width: 1200, height: 873, src: 'https://socialme.us/lets-code' },
];

interface DesktopProps extends React.ComponentProps<typeof View> {
  backgroundUrl?: string,
  children?: React.ReactNode,
}

interface OpenWindowArgs {
  title: string,
  src: string,
  width?: number,
  height?: number;
}

function Desktop({
  backgroundUrl,
  children,
}: DesktopProps) {
  const { onOpenWindow } = useContext(AppContext);

  const handlePointerUp = (event: React.PointerEvent, data?: OpenWindowArgs) => {
    if (data) {
      onOpenWindow({
        title: data.title,
        src: data.src,
        width: data.width,
        height: data.height,
      });
    }
  };

  return (
    <View flex style={{ background: `center / cover url(${backgroundUrl})` }}>
      <View horizontal padding="none small" fillColor="white">
        <Menu title="Desktop" titleFontWeight="bold">
          <Button title="Preferences" />
        </Menu>
        <Menu title="Applications">
          {applicationsMenu.map((item, index) => (
            <Button key={index} title={item.title} data={item} onPointerUp={handlePointerUp} />
          ))}
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

  const handleOpenWindow = useCallback(({ title, src, width, height }: OpenWindowArgs) => {
    const newId = uuid();

    setWindows(windows => [
      ...windows,
      { title, left: 20, top: 20, width: width ?? 300, height: height ?? 300, src, id: newId },
    ]);

    setWindowOrder(windowOrder => [
      ...windowOrder.filter((id) => id !== newId),
      newId,
    ]);
  }, []);

  const appContextValue = useMemo(() => ({
    onOpenWindow: handleOpenWindow,
  }), [handleOpenWindow]);

  return (
    <AppContext.Provider value={appContextValue}>
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
