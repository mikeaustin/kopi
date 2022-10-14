import React, { useRef, useState, useEffect, useContext } from 'react';
import OpenColor from 'open-color';
import clsx from 'clsx';

import { View, Text, Button, Divider } from 'core';
import AppContext from '../../../AppContext';

import styles from './Window.module.scss';

interface HandleProps {
  align: 'top-left' | 'top' | 'top-right' | 'left' | 'centter' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right',
  onDrag?: (x: number, y: number) => void,
}

function Handle({
  align,
  onDrag,
}: HandleProps) {
  const initialPointerRef = useRef<{ clientX: number, clientY: number; } | null>(null);
  const initialWindowRectRef = useRef<DOMRect>();

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();

    const windowElement = event.currentTarget.parentElement?.parentElement;

    if (windowElement && windowElement.parentElement) {
      initialPointerRef.current = { clientX: event.nativeEvent.clientX, clientY: event.nativeEvent.clientY };
      initialWindowRectRef.current = getElementOffsets(windowElement);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const windowElement = event.currentTarget.parentElement?.parentElement;

    if (windowElement && initialWindowRectRef.current && initialPointerRef.current) {
      const currentWindowRect = windowElement.getBoundingClientRect();

      const initialWindowRect = initialWindowRectRef.current;
      const initialPointer = initialPointerRef.current;

      if (align === 'top-left' || align === 'left' || align === 'bottom-left') {
        if (initialWindowRect.width - (event.clientX - initialPointer.clientX) < 100) {
          windowElement.style.left = `${currentWindowRect.right - 100}px`;
          windowElement.style.width = `${100}px`;
        } else {
          windowElement.style.left = `${initialWindowRect.left + (event.clientX - initialPointer.clientX)}px`;
          windowElement.style.width = `${initialWindowRect.width - (event.clientX - initialPointer.clientX)}px`;
        }
      }

      if (align === 'top-left' || align === 'top' || align === 'top-right') {
        if (initialWindowRect.height - (event.clientY - initialPointer.clientY) < 100) {
          // windowElement.style.top = `${windowElement.offsetTop - 100}px`;
          // windowElement.style.height = `${100}px`;
        } else {
          windowElement.style.top = `${initialWindowRect.top + (event.clientY - initialPointer.clientY)}px`;
          windowElement.style.height = `${initialWindowRect.height - (event.clientY - initialPointer.clientY)}px`;
        }
      }

      if (align === 'top-right' || align === 'right' || align === 'bottom-right') {
        if (initialWindowRect.width + (event.clientX - initialPointer.clientX) < 100) {
          windowElement.style.width = `${100}px`;
        } else {
          windowElement.style.width = `${initialWindowRect.width + (event.clientX - initialPointer.clientX)}px`;
        }
      }

      if (align === 'bottom-left' || align === 'bottom' || align === 'bottom-right') {
        windowElement.style.height = `${initialWindowRect.height + (event.clientY - initialPointer.clientY)}px`;
      }

      // if (initialWindowRect.width - (event.clientX - initialPointer.clientX) > 100) {
      //   windowElement.style.left = `${initialWindowRect.left + (event.clientX - initialPointer.clientX)}px`;
      //   windowElement.style.width = `${initialWindowRect.width - (event.clientX - initialPointer.clientX)}px`;
      // }

      // if (initialWindowRect.height - (event.clientY - initialPointer.clientY) > 100) {
      //   windowElement.style.top = `${initialWindowRect.top + (event.clientY - initialPointer.clientY)}px`;
      //   windowElement.style.height = `${initialWindowRect.height - (event.clientY - initialPointer.clientY)}px`;
      // }
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    const windowElement = event.currentTarget.parentElement?.parentElement;

    if (windowElement) {
      windowElement.style.left = `${windowElement.offsetLeft}px`;
      windowElement.style.width = `${windowElement.offsetWidth}px`;
      windowElement.style.top = `${windowElement.offsetTop}px`;
      windowElement.style.height = `${windowElement.offsetHeight}px`;
    }

    initialPointerRef.current = null;
  };

  return (
    <View className={styles[align]} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
  );
};

function getElementOffsets(windowElement: HTMLElement) {
  if (windowElement.parentElement) {
    return new DOMRect(
      windowElement.offsetLeft,
      windowElement.offsetTop,
      windowElement.offsetWidth,
      windowElement.offsetHeight,
    );
  }
}

interface WindowProps {
  id: string,
  src: string,
  order: number,
  title?: string,
  config: { left: number, top: number, width: number, height: number; },
  children?: React.ReactNode,
}

function Window({
  id,
  src,
  order,
  title,
  config,
  children,
}: WindowProps) {
  const windowElementRef = useRef<HTMLDivElement>(null);

  const initialPointerRef = useRef<{ clientX: number, clientY: number; } | null>(null);
  const initialWindowRectRef = useRef<DOMRect>();

  const { onOpenWindow, onCloseWindow } = useContext(AppContext);

  //

  const handleTitlePointerDown = (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();

    window.parent.postMessage({
      type: 'bringWindowToTop',
      id,
    });

    if (windowElementRef.current) {
      initialPointerRef.current = { clientX: event.nativeEvent.clientX, clientY: event.nativeEvent.clientY };
      initialWindowRectRef.current = getElementOffsets(windowElementRef.current);
    }
  };

  const handleTitlePointerMove = (event: React.PointerEvent) => {
    event.preventDefault();

    if (windowElementRef.current && initialWindowRectRef.current && initialPointerRef.current) {
      const initialWindowRect = initialWindowRectRef.current;
      const initialPointer = initialPointerRef.current;

      windowElementRef.current.style.left = `${initialWindowRect.left + (event.clientX - initialPointer.clientX)}px`;
      windowElementRef.current.style.top = `${initialWindowRect.top + (event.clientY - initialPointer.clientY)}px`;
    }
  };

  const handleTitlePointerUp = (event: React.PointerEvent) => {
    initialPointerRef.current = null;
  };

  const handleWindowPointerDown = () => {
    console.log('handleWindowPointerDown');
  };

  const handleCloseButtonClick = () => {
    onCloseWindow(id);
  };

  const handleIframeLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    // event.currentTarget.contentWindow?.postMessage({
    //   type: 'setColorTheme', theme: {
    //     contentColor: OpenColor.gray[9],
    //     panelColor: OpenColor.gray[8],
    //     dividerColor: OpenColor.gray[7],
    //     textColor: OpenColor.gray[4],
    //     buttonColor: OpenColor.gray[7],
    //   }
    // });
  };

  //

  useEffect(() => {
    if (windowElementRef.current) {
      windowElementRef.current.style.left = `${config.left}px`;
      windowElementRef.current.style.top = `${config.top}px`;
      windowElementRef.current.style.width = `${config.width}px`;
      windowElementRef.current.style.height = `${config.height}px`;
    }
  }, [config.left, config.top, config.height, config.width]);

  const windowClassName = clsx(
    styles.Window,
  );

  return (
    <View ref={windowElementRef} className={windowClassName} style={{ zIndex: order }} onPointerDown={handleWindowPointerDown}>
      <View className={styles.frame}>
        <Handle align="top-left" /><Handle align="top" /><Handle align="top-right" />
        <Handle align="left" /><Handle align="right" />
        <Handle align="bottom-left" /><Handle align="bottom" /><Handle align="bottom-right" />
      </View>
      <View flex className={styles.innerView}>
        <Button
          hover
          icon="xmark"
          size="small"
          style={{ position: 'absolute', margin: 5, padding: '5px 3px 5px 3px' }}
          onClick={handleCloseButtonClick}
        />
        <View
          horizontal
          style={{ cursor: 'pointer', marginBottom: -1, padding: 10 }}
          padding="small"
          fillColor="gray-3"
          onPointerDown={handleTitlePointerDown}
          onPointerMove={handleTitlePointerMove}
          onPointerUp={handleTitlePointerUp}
        >
          <Text flex fontWeight="bold" textColor="gray-7" style={{ textAlign: 'center' }}>
            {title}
          </Text>
        </View>
        <Divider color="gray-4" />
        <View flex>
          <iframe src={`${src}?id=${id}`} title={title} style={{ border: 'none', height: '100%' }} onLoad={handleIframeLoad} />
        </View>
      </View>
    </View>
  );
}

export default Window;
