/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState, useCallback } from 'react';

import { View, Text, Divider, List } from '../../components';

const Song = ({
  title,
  index,
  selected,
  onSongSelect,
}: {
  title: string;
  index: number;
  selected: boolean;
  onSongSelect: (songIndex: number) => void;
}) => {
  const handleClick = () => {
    console.log(index);
    onSongSelect(index);
  };

  return (
    <View padding="medium" borderRadius="xsmall" background={selected ? 'primary' : undefined} onPointerDown={handleClick}>
      <Text fontWeight={selected ? 'semi-bold' : undefined} textColor={selected ? 'white' : undefined} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        {title}
      </Text>
    </View>
  );
};

const songs = [
  { title: 'Dubstep — Royalty Free Music from Bensound', uri: './audio/bensound-dubstep.mp3' },
  { title: 'Better Days — Royalty Free Music from Bensound', uri: './audio/bensound-betterdays.mp3' },
  { title: 'Sunny — Royalty Free Music from Bensound', uri: './audio/bensound-sunny.mp3' },
];

const Music = () => {
  const audioElementRef = useRef<HTMLAudioElement>();
  const [selectedSongIndex, setSelectedSongIndex] = useState<number>(0);
  const [playingSongIndex, setPlayingSongIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSongSelect = (index: number) => {
    setSelectedSongIndex(index);
  };

  const handlePlayClick = () => {
    setPlayingSongIndex(selectedSongIndex);
    setIsPlaying(selectedSongIndex !== playingSongIndex || !isPlaying);
  };

  useEffect(() => {
    if (!audioElementRef.current) {
      return;
    }

    if (isPlaying || selectedSongIndex !== playingSongIndex) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isPlaying, playingSongIndex, selectedSongIndex]);

  return (
    <>
      <View ref={audioElementRef} tag="audio" src={playingSongIndex >= 0 ? songs[playingSongIndex].uri : undefined} />
      <List flex padding="xsmall">
        {songs.map((song, index) => (
          <Song title={song.title} index={index} selected={index === selectedSongIndex} onSongSelect={handleSongSelect} />
        ))}
      </List>
      <Divider />
      <View padding="medium" justifyContent="center" alignItems="center" background="gray-1">
        <View tag="svg" viewBox="0 0 100 100" flex style={{ width: 25, height: 25 }} onClick={handlePlayClick}>
          <polygon points="0,0 87,50 0,100" />
        </View>
      </View>
    </>
  );
};

export default Music;
