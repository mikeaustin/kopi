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
  { src: '9Azi4uS.jpg' },
  { src: '2685046.jpg' },
  { src: 'millennium-falcon.jpg' },
  { src: '16933.jpg' },
  { src: '653899.jpg' },
  { src: '653931.jpg' },
  { src: '306458.png' },
  { src: 'd1e91a4058a8a1082da711095b4e0163.jpg' },
  { src: '6414167.jpg' },
  { src: '2909224.jpg' },
  { src: 'video-games-video-game-art-ultrawide-ultra-wide-need-for-speed-heat-hd-wallpaper-preview.jpg' },
  { src: '2909247.jpg' },
];

function App() {
  const wallpaperUrlData = localStorage.getItem('wallpaperUrl');

  const [selectedImageUrl, setSelectedImageUrl] = useState(JSON.parse(wallpaperUrlData as string));

  const handleImageSelected = (src: string) => {
    setSelectedImageUrl(src.split('/').at(-1));
  };

  useEffect(() => {
    window.parent.postMessage({
      type: 'setDesktopWallpaper',
      url: selectedImageUrl.split('/').at(-1),
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
          <Image selected={image.src === selectedImageUrl} src={`../../images/${image.src}`} onImageSelected={handleImageSelected} />
        ))}
      </View>
    </View>
  );
}

export default App;
