/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState, useCallback } from 'react';

import { View, Text, Image, Spacer, Divider, List, Slider, Scroller } from '../../components';
import { ReactComponent as HeartIcon } from './heart-svgrepo-com.svg';

import playIconUrl from './images/play.png';
import pauseIconUrl from './images/pause.png';
import backIconUrl from './images/back.png';
import nextIconUrl from './images/next.png';

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
      alignItems="center"
      background={selected ? 'primary' : undefined}
      onPointerDown={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* <Image src="./audio/dubstep.jpg" height={45} borderRadius="tiny" style={{ margin: '-5px 0' }} />
      <Spacer size="small" /> */}
      <View flex>
        <View horizontal>
          <Text flex textColor={primaryTextColor} style={{ userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            <Text fontWeight={'semi-bold'}>
              {title}
            </Text>
            &nbsp;&nbsp;&middot;&nbsp;&nbsp;
            <Text fontSize="xsmall" textColor={primaryTextColor}>{length}</Text>
          </Text>
        </View>
        <Spacer size="small" />
        <Text fontSize="xsmall" fontWeight={'semi-bold'} textColor={textColor} style={{ userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {artist}
        </Text>
      </View>
      <Spacer size="small" />
      <View horizontal alignItems="center">
        <HeartIcon style={{ fill: colors.gray[4], width: 20, height: 20 }} />
      </View>
    </View>
  );
};

const songs = [
  { title: 'Tomorrow', length: '4:54', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-tomorrow.mp3' },
  { title: 'Dubstep', length: '2:04', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-dubstep.mp3' },
  { title: 'Better Days', length: '2:33', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-betterdays.mp3' },
  { title: 'Sunny', length: '2:20', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-sunny.mp3' },
  { title: 'Evolution', length: '2:45', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-evolution.mp3' },
  { title: 'Dreams', length: '3:30', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-dreams.mp3' },
];

const Music = () => {
  const audioElementRef = useRef<HTMLAudioElement>();

  const [selectedSongIndex, setSelectedSongIndex] = useState<number>(0);
  const [activeSongIndex, setActiveSongIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const handleBackClick = () => {
    if (activeSongIndex > 0) {
      setSelectedSongIndex(selectedSongIndex - 1);

      if (isPlaying) {
        setActiveSongIndex(selectedSongIndex - 1);
      }
    }
  };

  const handleNextClick = () => {
    if (activeSongIndex < songs.length - 1) {
      setSelectedSongIndex(selectedSongIndex + 1);

      if (isPlaying) {
        setActiveSongIndex(selectedSongIndex + 1);
      }
    }
  };

  const handleLoadMetaData = (event: React.SyntheticEvent<any, MediaStreamTrackEvent>) => {
    if (audioElementRef.current) {
      setDuration(audioElementRef.current.duration);
    }
  };

  const handleTimeUpdate = (event: React.SyntheticEvent<any, MediaStreamTrackEvent>) => {
    if (audioElementRef.current) {
      setCurrentTime(audioElementRef.current.currentTime);
    }
  };

  const handleSliderChange = (event: React.SyntheticEvent<any, MediaStreamTrackEvent>) => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = Number(event.currentTarget.value);
    }
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
        onLoadedMetadata={handleLoadMetaData}
        onTimeUpdate={handleTimeUpdate}
      />
      <View flex style={{ minHeight: 0 }}>
        <Scroller scrollY style={{ overflowX: 'hidden' }}>
          <List flex divider dividerInset bottomDivider>
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
        </Scroller>
        <Divider />
        <View padding="medium" horizontalPadding="medium" background="gray-1">
          <Spacer size="xsmall" />
          <Slider value={currentTime} max={duration} onInput={handleSliderChange} />
          <Spacer size="small" />
          {/* <View horizontal>
            <Text fontSize="xsmall">
              {`${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60)?.toString().padStart(2, '0')}`}
            </Text>
            <Spacer flex />
            <Text fontSize="xsmall">
              {`${Math.floor(duration / 60)}:${Math.floor(duration % 60)?.toString().padStart(2, '0')}`}
            </Text>
          </View> */}
          <Spacer size="xsmall" />
          <View horizontal justifyContent="center" alignItems="center" style={{ opacity: 0.7 }}>
            <View padding="small" style={{ opacity: selectedSongIndex === 0 ? 0.5 : 1 }} onClick={handleBackClick}>
              <Image src={backIconUrl} width={25} height={25} />
            </View>
            <Spacer size="xsmall" />
            <View padding="small" style={{ border: '3px solid #202020' }} borderRadius="max" onClick={handlePlayClick}>
              {isPlaying ? (
                <Image src={pauseIconUrl} width={25} height={25} />
              ) : (
                <Image src={playIconUrl} width={25} height={25} style={{ position: 'relative', left: 1 }} />
              )}
            </View>
            <Spacer size="xsmall" />
            <View padding="small" style={{ opacity: selectedSongIndex === songs.length - 1 ? 0.5 : 1 }} onClick={handleNextClick}>
              <Image src={nextIconUrl} width={25} height={25} />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Music;
