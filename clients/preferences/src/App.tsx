import React, { useState } from 'react';

import './App.css';

import { View, Text, Button, Divider } from 'core';

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
    <View style={{ position: 'relative', cursor: 'pointer' }} tabIndex={0} onPointerDown={handleImagePointerDown}>
      {selected && (
        <View style={{ position: 'absolute', inset: -3, border: '3px solid #339af0', borderRadius: 6 }} />
      )}
      <img src={src} style={{ width: '100%', height: 'auto', borderRadius: 2.5, overflow: 'hidden' }} />
    </View>
  );
}

const backgroundImages = [
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?1' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?2' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?3' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?4' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?5' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?6' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?7' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?8' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?9' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?10' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?11' },
  { src: 'https://mike-austin.com/build-a-language/images/653931.jpg?12' },
];

function App() {
  const [selectedImageSrc, setSelectedImageSrc] = useState('https://mike-austin.com/build-a-language/images/653931.jpg?1');

  const handleImageSelected = (src: string) => {
    setSelectedImageSrc(src);
  };

  return (
    <View className="App">
      <View padding="medium" fillColor="gray-1">
        <Text>Background</Text>
      </View>
      <Divider />
      <View flex padding="medium" fillColor="white" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, alignContent: 'flex-start', overflowY: 'auto' }}>
        {backgroundImages.map((image, index) => (
          <Image selected={image.src === selectedImageSrc} src={image.src} onImageSelected={handleImageSelected} />
        ))}
      </View>
      <Divider />
      <View horizontal align="right" padding="medium" fillColor="gray-1">
        <Button primary solid title="Save" />
      </View>
    </View>
  );
}

export default App;
