import React, { useRef, useState, useEffect } from 'react';

import { View, Text, Button, Spacer, Divider, List, Clickable } from '../../components';

import Image, { type ImageProps } from '../../components/image';

import backgroundUrls from './data';

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
    <View padding="medium">
      <Text fontWeight="bold">Background</Text>
      <Spacer size="medium" />
      <Divider />
      <View style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 10px', height: 320, overflowY: 'auto', paddingTop: 10, paddingBottom: 10 }}>
        {backgroundUrls.map((url, index) => (
          <ClickableImage key={index} src={`./images/${url}`} width="100%" height="auto" onImageClick={handleImageClick} />
        ))}
      </View>
      <Divider />
      <Spacer size="medium" />
      <List horizontal spacerSize="small" justifyContent="center">
        <Button primary title="Cancel" />
        <Button primary solid title="Save" onClick={handleSaveClick} />
      </List>
    </View>
  );
};

export default Preferences;
