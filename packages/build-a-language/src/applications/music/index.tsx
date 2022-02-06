/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState, useCallback } from 'react';

import { View, Text, Image, Spacer, Divider, List } from '../../components';
import { ReactComponent as HeartIcon } from './heart-svgrepo-com.svg';

import colors from 'open-color';

const Song = ({
  title,
  album,
  artist,
  length,
  index,
  selected,
  onSongSelect,
  onSongSelectAndPlay,
}: {
  title: string;
  album?: string;
  artist: string;
  length: string;
  index: number;
  selected: boolean;
  onSongSelect: (songIndex: number) => void;
  onSongSelectAndPlay: (songIndex: number) => void;
}) => {
  const handleClick = () => {
    onSongSelect(index);
  };

  const handleDoubleClick = () => {
    console.log('here');
    onSongSelectAndPlay(index);
  };

  const primaryTextColor = selected ? 'white' : undefined;
  const textColor = selected ? 'gray-3' : 'gray-6';

  return (
    <View
      horizontal
      padding="small"
      horizontalPadding="medium"
      background={selected ? 'primary' : undefined}
      onPointerDown={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <View horizontal alignItems="center">
        <HeartIcon style={{ fill: colors.gray[4], width: 20, height: 20 }} />
      </View>
      <Spacer size="small" />
      {/* <Divider color="gray-4" style={{ margin: '-10px 0' }} />
      <Spacer size="medium" /> */}
      <View flex>
        <View horizontal>
          <Text flex fontWeight={'semi-bold'} textColor={primaryTextColor} style={{ userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            {title}
          </Text>
          <Text fontWeight="medium" textColor={primaryTextColor}>{length}</Text>
        </View>
        <Spacer size="small" />
        <Text fitContent fontSize="xsmall" fontWeight={'semi-bold'} textColor={textColor} style={{ userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {artist}
        </Text>
      </View>
    </View>
  );
};

const songs = [
  { title: 'Dubstep', length: '2:04', artist: 'Benjamin Tissot — www.bensound.comv - asdf asdf asdf asdf', uri: './audio/bensound-dubstep.mp3' },
  { title: 'Better Days', length: '2:33', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-betterdays.mp3' },
  { title: 'Sunny', length: '2:20', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-sunny.mp3' },
  { title: 'Evolution', length: '2:45', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-evolution.mp3' },
];

const Music = () => {
  const audioElementRef = useRef<HTMLAudioElement>();
  const [selectedSongIndex, setSelectedSongIndex] = useState<number>(0);
  const [activeSongIndex, setActiveSongIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSongSelect = (index: number) => {
    setSelectedSongIndex(index);
  };

  const handleSongSelectAndPlay = (index: number) => {
    setSelectedSongIndex(index);

    setActiveSongIndex(selectedSongIndex);
    setIsPlaying(selectedSongIndex !== activeSongIndex || !isPlaying);
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
      <View flex>
        <View flex horizontal scrollX scrollSnapX>
          <List scrollSnapAlign="start" style={{ flexGrow: 0, flexShrink: 0, flexBasis: '100%' }}>
            {songs.map((song, index) => (
              <Song
                key={index}
                title={song.title}
                artist={song.artist}
                length={song.length}
                index={index}
                selected={index === selectedSongIndex}
                onSongSelect={handleSongSelect}
                onSongSelectAndPlay={handleSongSelectAndPlay}
              />
            ))}
          </List>
          <List scrollSnapAlign="start" style={{ flexGrow: 0, flexShrink: 0, flexBasis: '100%' }}>
            {songs.map((song, index) => (
              <Song
                key={index}
                title={song.title}
                artist={song.artist}
                length={song.length}
                index={index}
                selected={index === selectedSongIndex}
                onSongSelect={handleSongSelect}
                onSongSelectAndPlay={handleSongSelectAndPlay}
              />
            ))}
          </List>
        </View>
        <Divider />
        <View padding="medium" justifyContent="center" alignItems="center" background="gray-1">
          <View tag="svg" viewBox="0 0 100 100" flex style={{ width: 25, height: 25 }} onClick={handlePlayClick}>
            <polygon fill={colors.gray[7]} points="10,10 97,50 10,100" />
          </View>
        </View>
      </View>
    </>
  );
};

export default Music;
