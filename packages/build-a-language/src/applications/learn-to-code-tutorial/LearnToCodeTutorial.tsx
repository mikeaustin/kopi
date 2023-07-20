/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from '../../components';
import { WindowContext } from '../../components/window';

import Tutorial, { type Page } from '../../components/tutorial/Tutorial';

import pages from './data';

type ContentProps = {
  data: {
    url: string;
  };
};

const Content = ({
  data,
}: ContentProps) => {
  const iframeElementRef = useRef();
  const { onWindowFocus } = useContext(WindowContext) ?? { onWindowFocus: null };

  const handleWindowBlur = useCallback(() => {
    if (document.activeElement === iframeElementRef.current) {
      onWindowFocus?.();
    }
  }, [onWindowFocus]);

  useEffect(() => {
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [handleWindowBlur]);

  return <View ref={iframeElementRef} flex tag="iframe" src={data.url} style={{ border: 'none' }} />;
};

const options = {

};

const BuildALanguageTutorial = () => {
  return (
    <Tutorial pages={pages} Content={Content} />
  );
};

export default BuildALanguageTutorial;
