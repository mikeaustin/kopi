import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import AppContext from './AppContext';

import { View, Button, Divider } from 'core';
import Window from './components/shared/window';

import './App.css';

interface MenuProps extends React.ComponentProps<typeof Button> {
  title: string,
  titleFontWeight?: React.ComponentProps<(typeof Button)>['titleFontWeight'],
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
      <Button hover size="small" title={title} titleFontWeight={titleFontWeight} style={{ justifyContent: 'center', cursor: 'pointer' }} onPointerDown={handleTitlePointerDown} {...props} />
      {isMenuVisible && (
        <View border fillColor="white" padding="small" style={{ position: 'absolute', top: '100%', zIndex: 1000, borderRadius: 2.5, boxShadow: '0 4px 8px hsla(0, 0%, 0%, 0.24), 0 0 0 1px hsla(0, 0%, 0%, 0.1)' }}>
          {React.Children.map(children, child => React.isValidElement(child) && child.type === Button
            ? React.cloneElement(child as React.ReactElement<React.ComponentProps<typeof Button>>, {
              size: 'small',
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

const desktopMenu = [
  { title: 'Preferences', width: 500, height: 390, src: 'clients/preferences' },
  { title: 'Styleguide', width: 850, height: 510, src: 'clients/examples' },
];

const applicationsMenu = [
  { title: 'S3 Explorer', width: 800, height: 400, src: 'clients/explorer' },
  { title: 'Calculator', width: 240, height: 320, src: 'clients/calculator' },
  { title: 'Clock', width: 285, height: 320, src: 'clients/clock' },
  { title: 'Terminal', width: 800, height: 400, src: 'clients/terminal' },
  { title: 'Calendar', width: 360, height: 320, src: 'clients/calendar' },
  { title: 'UI Builder', width: 1200, height: 800, src: 'clients/builder' },
  {},
  { title: 'Grid Draw', width: 1200, height: 800, src: 'https://mike-austin.com/draw-2' },
  { title: 'Bestest Movies Ever', width: 1200, height: 800, src: 'https://bestestmoviesever.com' },
  { title: 'Kopi Programming Language', width: 1200, height: 800, src: 'https://mike-austin.com/kopi' },
  { title: 'React Desktop 0.5', width: 1200, height: 800, src: 'https://mike-austin.com/build-a-language' },
  { title: 'React Desktop 0.1', width: 1200, height: 800, src: 'https://mike-austin.com/react-wm' },
  { title: 'Old Site with Resume', width: 1200, height: 800, src: 'https://mike-austin.com' },
  { title: 'After a While, Crocodile', width: 800, height: 482, src: 'https://www.youtube.com/embed/oWkOkpzyD3Y' },
];

const gamesMenu = [
  { title: 'Let’s Code', width: 1400, height: 800, src: 'https://socialme.us/lets-code' },
  { title: 'React Asteroids', width: 1600, height: 900, src: 'https://codepen.io/mikeaustin/embed/mdpYMym?default-tab=js%2Cresult' },
  { title: 'Snakey Snake', width: 400, height: 474, src: 'https://editor.p5js.org/mike_ekim1024/full/8c5ovMThX' },
  { title: 'Stetegic Asteroids', width: 800, height: 873, src: 'https://editor.p5js.org/mike_ekim1024/full/q8nWdZV0U' },
  { title: 'JS Doom', width: 640, height: 480, src: 'clients/jsdoom' },
];

const referenceMenu = [
  { title: 'The io Language', width: 800, height: 800, src: 'https://iolanguage.org' },
];

interface OpenWindowArgs {
  title: string,
  src: string,
  width?: number,
  height?: number;
}

interface DesktopProps extends React.ComponentProps<typeof View> {
  backgroundUrl?: string | null,
  children?: React.ReactNode,
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
          {desktopMenu.map((item, index) => (
            <Button key={index} title={item.title} data={item} onPointerUp={handlePointerUp} />
          ))}
        </Menu>
        <Menu title="Applications">
          {applicationsMenu.map((item, index) => (
            item.title ? <Button key={index} title={item.title} data={item} onPointerUp={handlePointerUp} /> : <Divider spacing="small" />
          ))}
        </Menu>
        <Menu title="Games">
          {gamesMenu.map((item, index) => (
            <Button key={index} title={item.title} data={item} onPointerUp={handlePointerUp} />
          ))}
        </Menu>
        <Menu title="Reference">
          {referenceMenu.map((item, index) => (
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

const gemtask = (
  <iframe src="https://gemtask.mike-austin.com" style={{ border: 'none', height: '100%' }} />
);

function App() {
  const [windows, setWindows] = useState([
    { title: 'Styleguide', left: 15, top: 15, width: 850, height: 550, src: 'clients/examples', id: uuid() },
    { title: 'Calendar', left: 880, top: 15, width: 360, height: 320, src: 'clients/calendar', id: uuid() },
    { title: 'Clock', left: 1255, top: 15, width: 285, height: 320, src: 'clients/clock', id: uuid() },
    { title: 'Calculator', left: 625, top: 580, width: 240, height: 320, src: 'clients/calculator', id: uuid() },
    { title: 'Preferences', left: 15, top: 580, width: 595, height: 320, src: 'clients/preferences', id: uuid() },
    { title: 'S3 Explorer', left: 880, top: 580, width: 660, height: 320, src: 'clients/explorer', id: uuid() },
    { title: 'Terminal', left: 880, top: 350, width: 660, height: 215, src: 'clients/terminal', id: uuid() },
  ]);
  const [windowOrder, setWindowOrder] = useState<string[]>(windows.map(({ id }) => id));
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);

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
    } else if (event.data.type === 'setDesktopWallpaper') {
      console.log(event.data.url);
      setWallpaperUrl(event.data.url);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleWindowMessage);
  }, []);

  const handleOpenWindow = useCallback(({ title, src, width, height }: OpenWindowArgs) => {
    const newId = uuid();

    setWindows(windows => [
      ...windows,
      { title, left: 15, top: 15, width: width ?? 300, height: height ?? 300, src, id: newId },
    ]);

    setWindowOrder(windowOrder => [
      ...windowOrder.filter((id) => id !== newId),
      newId,
    ]);
  }, []);

  const handleCloseWindow = useCallback((id: string) => {
    console.log('handleCloseWindow');

    setWindows(windows => windows.filter(window => window.id !== id));
  }, []);

  const appContextValue = useMemo(() => ({
    onOpenWindow: handleOpenWindow,
    onCloseWindow: handleCloseWindow,
  }), [handleOpenWindow, handleCloseWindow]);

  return (
    <AppContext.Provider value={appContextValue}>
      <View flex className="App">
        <Desktop flex backgroundUrl={wallpaperUrl}>
          {windows.map((window) => (
            <Window key={window.id} id={window.id} src={window.src} title={window.title} config={window} order={windowOrder.indexOf(window.id)} />
          ))}
        </Desktop>
      </View>
    </AppContext.Provider>
  );
}

export default App;
