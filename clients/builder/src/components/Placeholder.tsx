import React, { useContext, useState } from 'react';
import clsx from 'clsx';

import { View, Text as OriginalText, Button, Stack, Spacer, Divider, Input } from 'core';
import AppContext from '../AppContext';

function Placeholder({ index }: { index: number; }) {
  const { onDrop } = useContext(AppContext);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.background = `linear-gradient(
      0deg,
      #00000000,
      #00000000,
      calc(50% - 2px),
      #000000 calc(50% - 2px),
      #000000 calc(50% + 2px),
      #00000000,
      calc(50% + 2px),
      #00000000
    )`;
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.background = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const data = JSON.parse(event.dataTransfer.getData("text/plain"));

    onDrop(data, index);

    event.currentTarget.style.background = '';
  };

  return (
    <View
      fillColor="gray-1"
      className={clsx('Placeholder')}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    />
  );
}

export default Placeholder;
