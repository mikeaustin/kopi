/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState, useCallback } from 'react';

import { View, Text, Image, Spacer, Divider, List } from '../../components';

import colors from 'open-color';

console.log(colors);

const Song = ({
  title,
  album,
  artist,
  length,
  index,
  selected,
  onSongSelect,
}: {
  title: string;
  album?: string;
  artist: string;
  length: string;
  index: number;
  selected: boolean;
  onSongSelect: (songIndex: number) => void;
}) => {
  const handleClick = () => {
    onSongSelect(index);
  };

  const handleDoubleClick = () => {
    console.log('here');
  };

  const primaryTextColor = selected ? 'white' : undefined;
  const textColor = selected ? 'gray-3' : 'gray-6';

  return (
    <View horizontal padding="small" borderRadius="tiny" background={selected ? 'primary' : undefined} onPointerDown={handleClick} onDoubleClick={handleDoubleClick}>
      <View horizontal alignItems="center">
        <Image src="./images/Noun_Project_Star_icon_370530_cc.svg" width={20} height={20} />
      </View>
      <Spacer size="small" />
      {/* <Divider color="gray-4" style={{ margin: '-10px 0' }} />
      <Spacer size="medium" /> */}
      <View flex>
        <View horizontal>
          <Text flex fontWeight={'semi-bold'} textColor={primaryTextColor} style={{ userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            {title}
          </Text>
          <Text textColor={primaryTextColor}>{length}</Text>
        </View>
        <Spacer size="small" />
        <Text fontSize="xsmall" fontWeight={'semi-bold'} textColor={textColor} style={{ userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          {artist}
        </Text>
      </View>
    </View>
  );
};

const songs = [
  { title: 'Dubstep', length: '2:34', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-dubstep.mp3' },
  { title: 'Better Days', length: '2:34', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-betterdays.mp3' },
  { title: 'Sunny', length: '2:34', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-sunny.mp3' },
  { title: 'Evolution', length: '2:34', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-evolution.mp3' },
];

const Music = () => {
  const audioElementRef = useRef<HTMLAudioElement>();
  const [selectedSongIndex, setSelectedSongIndex] = useState<number>(0);
  const [activeSongIndex, setActiveSongIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSongSelect = (index: number) => {
    setSelectedSongIndex(index);
  };

  const handlePlayClick = () => {
    setActiveSongIndex(selectedSongIndex);
    setIsPlaying(selectedSongIndex !== activeSongIndex || !isPlaying);
  };

  const handleProgress = (event: React.SyntheticEvent<any, MediaStreamTrackEvent>) => {
    console.log(event);
  };

  useEffect(() => {
    if (!audioElementRef.current) {
      return;
    }

    if (isPlaying || (isPlaying && selectedSongIndex !== activeSongIndex)) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isPlaying, activeSongIndex, selectedSongIndex]);

  return (
    <>
      <View
        ref={audioElementRef}
        tag="audio"
        src={activeSongIndex >= 0 ? songs[activeSongIndex].uri : undefined}
        onTimeUpdate={handleProgress}
      />
      <List flex padding="xsmall">
        {songs.map((song, index) => (
          <Song
            key={index}
            title={song.title}
            artist={song.artist}
            length={song.length}
            index={index}
            selected={index === selectedSongIndex}
            onSongSelect={handleSongSelect}
          />
        ))}
      </List>
      <Divider />
      <View padding="medium" justifyContent="center" alignItems="center" background="gray-1">
        <View tag="svg" viewBox="0 0 100 100" flex style={{ width: 25, height: 25 }} onClick={handlePlayClick}>
          <polygon fill={colors.gray[7]} points="10,10 97,50 10,100" />
        </View>
      </View>
    </>
  );
};

export default Music;
