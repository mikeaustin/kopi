/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState, useReducer, useCallback, useContext } from 'react';

import { useNamespacedReducer } from '../../App';

import { View, Text, Image, Spacer, Divider, List, Slider, Scroller } from '../../components';
import { ReactComponent as HeartIcon } from './heart-svgrepo-com.svg';

import soundIconUrl from './images/volume.png';

import { ReactComponent as BackIcon } from './images/back.svg';
import { ReactComponent as PlayIcon } from './images/play.svg';
import { ReactComponent as PauseIcon } from './images/pause.svg';
import { ReactComponent as NextIcon } from './images/next.svg';

import colors from 'open-color';

const Song = ({
  title,
  album,
  artist,
  length,
  index,
  selected,
  isPlaying,
  onSongSelect,
  onSongSelectAndPlay,
}: {
  title: string;
  album?: string;
  artist: string;
  length: string;
  index: number;
  selected: boolean;
  isPlaying: boolean;
  onSongSelect: (songIndex: number) => void;
  onSongSelectAndPlay: (songIndex: number) => void;
}) => {
  const handleClick = (event: React.SyntheticEvent<any, PointerEvent>) => {
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });

    onSongSelect(index);
  };

  const handleDoubleClick = () => {
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
            &nbsp;
            (<Text fontSize="xsmall" textColor={primaryTextColor}>{length}</Text>)
          </Text>
        </View>
        <Spacer size="small" />
        <Text fontSize="xsmall" fontWeight={'semi-bold'} textColor={textColor} style={{ userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {artist}
        </Text>
      </View>
      <Spacer size="small" />
      <View horizontal alignItems="center">
        {isPlaying && (
          <>
            <Image src={soundIconUrl} width={20} height={20} />
            <Spacer size="small" />
          </>
        )}
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

/*
  useState('selectedSongIndex')
*/

// const AppContext = React.createContext(null);

type MusicPlayerState = {
  selectedSongIndex: number;
};

type MusicPlayerAction = (state: MusicPlayerState) => MusicPlayerState;

const reducer = (state: MusicPlayerState, action: MusicPlayerAction): MusicPlayerState => {
  return action(state);

  return {
    selectedSongIndex: 1,
  };
};

const setSelectedSongIndex2 = (selectedSongIndex: number) => (state: MusicPlayerState) => ({ ...state, selectedSongIndex });

const initialState = { selectedSongIndex: -1 };

const Music = () => {
  const audioElementRef = useRef<HTMLAudioElement>();

  const [selectedSongIndex, setSelectedSongIndex] = useState<number>(0);
  const [activeSongIndex, setActiveSongIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [state, dispatch] = useNamespacedReducer('app.musicplayer', reducer, initialState);

  useEffect(() => {
    // console.log('here');
    dispatch(setSelectedSongIndex2(1));
  }, [dispatch]);

  console.log('state', state);

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
      if (isPlaying) {
        setActiveSongIndex(activeSongIndex - 1);
      }
    }
  };

  const handleNextClick = () => {
    if (activeSongIndex < songs.length - 1) {
      if (isPlaying) {
        setActiveSongIndex(activeSongIndex + 1);
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

    if (isPlaying || (isPlaying && activeSongIndex !== -1)) {
      console.log('here');
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isPlaying, activeSongIndex]);

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
                isPlaying={index === activeSongIndex}
                onSongSelect={handleSongSelect}
                onSongSelectAndPlay={handleSongSelectAndPlay}
              />
            ))}
          </List>
        </Scroller>
        <Divider />
        <View padding="medium" horizontalPadding="medium" background="theme-panel">
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
          <View horizontal justifyContent="center" alignItems="center">
            <View padding="small" style={{ opacity: activeSongIndex === 0 ? 0.5 : 1 }} onClick={handleBackClick}>
              <BackIcon style={{ fill: 'var(--theme-text-color)', width: 30, height: 30 }} />
            </View>
            <Spacer size="xsmall" />
            <View onClick={handlePlayClick}>
              {isPlaying ? (
                <PauseIcon style={{ fill: 'var(--theme-text-color)', width: 50, height: 50 }} />
              ) : (
                <PlayIcon style={{ fill: 'var(--theme-text-color)', width: 50, height: 50 }} />
              )}
            </View>
            <Spacer size="xsmall" />
            <View padding="small" style={{ opacity: activeSongIndex === songs.length - 1 ? 0.5 : 1 }} onClick={handleNextClick}>
              <NextIcon style={{ fill: 'var(--theme-text-color)', width: 30, height: 30 }} />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Music;
