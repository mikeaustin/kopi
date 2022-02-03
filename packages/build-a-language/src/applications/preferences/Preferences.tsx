import React, { useRef, useState, useEffect } from 'react';

import { View, Text, Button, Spacer, Divider, List, Clickable } from '../../components';

import Image, { type ImageProps } from '../../components/image';

import backgroundUrls from './data';
import styles from './styles.module.scss';

const ClickableImage = ({
  src,
  onImageClick,
  ...props
}: {
  src: string;
  onImageClick: (event: React.SyntheticEvent<any, MouseEvent>, src: string) => void;
} & ImageProps) => {
  const handleClick = (event: React.SyntheticEvent<any, MouseEvent>) => {
    onImageClick(event, src);
  };

  return (
    <Clickable onClick={handleClick}>
      {/* <Image src={url} width="100%" borderRadius /> */}
      <Image src={src} borderRadius title={src} {...props} />
    </Clickable>
  );
};

//

type PreferencesProps = {
  onSetBackground: (url: string) => void;
};

const Preferences = ({
  onSetBackground
}: PreferencesProps) => {
  const backgroundRef = useRef<string>();
  const scrollerRef = useRef<HTMLElement>();

  const handleImageClick = (event: any, src: string) => {
    backgroundRef.current = src;

    onSetBackground(src);
  };

  const handleSaveClick = () => {
    localStorage.setItem('background', JSON.stringify(backgroundRef.current));
  };

  useEffect(() => {
    const background = localStorage.getItem('background');

    if (background) {
      backgroundRef.current = JSON.parse(background);

      onSetBackground(JSON.parse(background));
    } else {
      onSetBackground('./images/triangles-colorful-green-colors-low-poly-abstract-4748.png');
    }
  }, [onSetBackground]);

  const handleScroll = () => {
    if (scrollerRef.current) {
      const ratio = scrollerRef.current.children[0].clientHeight / scrollerRef.current.children[0].scrollHeight;

      scrollerRef.current.style.setProperty('--top', scrollerRef.current.children[0].scrollTop * ratio + 'px');
      scrollerRef.current.style.setProperty('--height', scrollerRef.current.children[0].clientHeight * ratio + 'px');
    }
  };

  return (
    <View>
      <View padding="medium" bottomPadding="none" background="gray-1">
        <Text fontWeight="bold">Background</Text>
        <Spacer size="medium" />
      </View>
      <Divider style={{ marginBottom: -1, position: 'relative', zIndex: 1, background: 'hsla(0, 0%, 0%, 0.15)' }} />
      <View ref={scrollerRef} className={styles.outerScroll}>
        <View padding="medium" horizontalPadding="medium" className={styles.scroll} style={{ height: 300 }} onScroll={handleScroll}>
          {backgroundUrls.map((url, index) => (
            <ClickableImage key={index} src={`./images/${url}`} width="100%" height="auto" onImageClick={handleImageClick} />
          ))}
        </View>
      </View>
      <Divider style={{ marginTop: -1, position: 'relative', zIndex: 1, background: 'hsla(0, 0%, 0%, 0.15)' }} />
      <View padding="medium" topPadding="none" background="gray-1">
        <Spacer size="medium" />
        <List horizontal spacerSize="small" justifyContent="center">
          <Button primary title="Cancel" />
          <Button primary solid title="Save" onClick={handleSaveClick} />
        </List>
      </View>
    </View>
  );
};

export default Preferences;
