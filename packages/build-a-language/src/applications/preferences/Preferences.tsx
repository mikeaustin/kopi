import React, { useRef, useState, useEffect } from 'react';

import { View, Text, Button, Spacer, Divider, List, Scroller, Clickable } from '../../components';

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
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });

    onImageClick(event, src);
  };

  return (
    <Clickable onClick={handleClick}>
      {/* <Image src={url} width="100%" borderRadius /> */}
      <Image src={src} borderRadius="tiny" title={src} {...props} />
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

  return (
    <View style={{ minHeight: 0 }}>
      <View padding="medium" bottomPadding="none" background="theme-panel">
        <Text fontWeight="bold">Background</Text>
        <Spacer size="small" />
      </View>
      <Divider style={{ marginBottom: -1, position: 'relative', zIndex: 1, background: 'hsla(0, 0%, 0%, 0.15)' }} />
      <Scroller scrollY>
        <View padding="medium" horizontalPadding="medium" className={styles.scroll}>
          {backgroundUrls.map((url, index) => (
            <ClickableImage key={index} src={`./images/${url}`} width="100%" height="auto" onImageClick={handleImageClick} />
          ))}
        </View>
      </Scroller>
      <Divider style={{ marginTop: -1, position: 'relative', zIndex: 1, background: 'hsla(0, 0%, 0%, 0.15)' }} />
      <View padding="medium" topPadding="none" background="theme-panel">
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
