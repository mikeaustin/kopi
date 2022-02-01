import React, { useEffect } from 'react';

import { View, Button, Spacer, List, Clickable } from '../../components';

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
  const handleImageClick = (event: any, src: string) => {
    onSetBackground(src);
  };

  useEffect(() => {
    onSetBackground('./images/triangles-colorful-green-colors-low-poly-abstract-4748.png');
  }, []);

  return (
    <View padding="medium">
      <View style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 10px', maxHeight: 300, overflowY: 'auto' }}>
        {backgroundUrls.map((url, index) => (
          <ClickableImage key={index} src={`./images/${url}`} width="100%" height="auto" onImageClick={handleImageClick} />
        ))}
      </View>
      <Spacer size="medium" />
      <List horizontal spacerSize="small" justifyContent="center">
        <Button primary title="Cancel" />
        <Button primary solid title="Save" />
      </List>
    </View>
  );
};

export default Preferences;
