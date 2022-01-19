import React from 'react';

import { View, List, Clickable } from '../../components';

const Preferences = ({ onSetBackground }: { onSetBackground: (url: string) => void; }) => {
  const backgroundUrls = [
    './images/d1e91a4058a8a1082da711095b4e0163.jpg',
    './images/modern_abstract-wallpaper-3440x1440.jpg',
    './images/781767.jpg',
    './images/16933.jpg',
    './images/274355.jpg',
    './images/1638117.png',
    './images/2685046.jpg',
    './images/9Azi4uS.jpg',
  ];

  return (
    <View>
      {/* <List horizontal wrap>
        {backgroundUrls.map(url => (
          <Clickable key={url} itemWidth="33.33%" onClick={onSetBackground}>
            <Image src={url} width="100%" borderRadius />
          </Clickable>
        ))}
      </List> */}
    </View>
  );
};

export default Preferences;
