import React, { useState, useEffect } from 'react';

import './App.css';

import { View, Text, Button, Divider, Stack } from 'core';

function Image({
  src,
  selected,
  onImageSelected,
}: {
  src: string,
  selected?: boolean;
  onImageSelected?: (src: string) => void,
}) {
  const handleImagePointerDown = () => {
    if (onImageSelected) {
      onImageSelected(src);
    }
  };

  return (
    <View flex style={{ position: 'relative', cursor: 'pointer' }} tabIndex={0} onPointerDown={handleImagePointerDown}>
      {selected && (
        <View style={{ position: 'absolute', inset: -3, border: '3px solid #339af0', borderRadius: 6 }} />
      )}
      <img src={src} style={{ width: '100%', height: 'auto', borderRadius: 2.5, overflow: 'hidden' }} />
    </View>
  );
}

const backgroundImages = [
  { src: '../../images/9Azi4uS.jpg' },
  { src: '../../images/2685046.jpg' },
  { src: '../../images/millennium-falcon.jpg' },
  { src: '../../images/16933.jpg' },
  { src: '../../images/653899.jpg' },
  { src: '../../images/653931.jpg' },
  { src: '../../images/306458.png' },
  { src: '../../images/d1e91a4058a8a1082da711095b4e0163.jpg' },
  { src: '../../images/6414167.jpg' },
  { src: '../../images/2909224.jpg' },
  { src: '../../images/video-games-video-game-art-ultrawide-ultra-wide-need-for-speed-heat-hd-wallpaper-preview.jpg' },
  { src: '../../images/2909247.jpg' },
];

function App() {
  const wallpaperUrlData = localStorage.getItem('wallpaperUrl');

  const [selectedImageUrl, setSelectedImageUrl] = useState(wallpaperUrlData && JSON.parse(wallpaperUrlData));
  // '../..//images/653931.jpg'

  const handleImageSelected = (src: string) => {
    setSelectedImageUrl(src);

    localStorage.setItem('wallpaperUrl', JSON.stringify(src));

    window.parent.postMessage({
      type: 'setDesktopWallpaper',
      url: src,
    });
  };

  useEffect(() => {
    window.parent.postMessage({
      type: 'setDesktopWallpaper',
      url: selectedImageUrl,
    });
  }, [selectedImageUrl]);

  return (
    <View className="App">
      <View padding="medium" fillColor="gray-1">
        <Text>Background</Text>
      </View>
      <Divider />
      <View
        flex
        padding="medium"
        fillColor="white"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, alignContent: 'flex-start', overflowY: 'auto' }}
      >
        {backgroundImages.map((image, index) => (
          <Image selected={image.src === selectedImageUrl} src={image.src} onImageSelected={handleImageSelected} />
        ))}
      </View>
      {/* <Divider />
      <Stack horizontal align="right" padding="medium" fillColor="gray-1">
        <Button primary solid title="Save" />
        <Button primary title="Close" />
      </Stack> */}
    </View>
  );
}

export default App;
