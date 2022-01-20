import React from 'react';

import { View, List, Clickable } from '../../components';

import Image, { type ImageProps } from '../../components/image';

const backgroundUrls = [
  './images/d1e91a4058a8a1082da711095b4e0163.jpg',
  './images/781767.jpg',
  './images/d1e91a4058a8a1082da711095b4e0163.jpg',
  './images/781767.jpg',
  './images/d1e91a4058a8a1082da711095b4e0163.jpg',
  './images/781767.jpg',
];

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
      <Image src={src} {...props} />
    </Clickable>
  );
};

type PreferencesProps = {
  onSetBackground: (url: string) => void;
};

const Preferences = ({
  onSetBackground
}: PreferencesProps) => {
  const handleImageClick = (event: any, src: string) => {
    onSetBackground(src);
  };

  return (
    <View padding="medium">
      <View style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 10px' }}>
        {backgroundUrls.map((url, index) => (
          <ClickableImage key={index} src={url} width="100%" height="auto" onImageClick={handleImageClick} />
        ))}
      </View>
    </View>
  );
};

export default Preferences;
