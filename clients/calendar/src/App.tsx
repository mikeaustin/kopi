import React from 'react';

import { View, Text, Button, Spacer, Divider } from 'core';

import './App.css';

const headerTextProps: React.ComponentProps<typeof Text> = {
  fontSize: 'xsmall',
  fontWeight: 'bold',
  style: {
    textAlign: 'right',
    paddingRight: 10
  }
};

function App() {
  const handleAppPointerDown = () => {
    const searchParams = new URLSearchParams(window.location.search);

    window.parent.postMessage({
      type: 'bringWindowToTop',
      id: searchParams.get('id'),
    });
  };

  const days = Array.from({ length: 30 }, (_, index) => index + 1);

  return (
    <View className="App" onPointerDown={handleAppPointerDown}>
      <View padding="medium" fillColor="theme-panel">
        <View horizontal style={{ alignItems: 'center' }}>
          <Text fontSize="large">September</Text>
          <Spacer flex size="small" />
          <Button solid size="small" icon="chevron-left" style={{ marginTop: -3, marginBottom: -3 }} />
          <Spacer size="small" />
          <Button solid size="small" icon="chevron-right" style={{ marginTop: -3, marginBottom: -3 }} />
        </View>
      </View>
      {/* <Spacer size="medium" /> */}
      <View fillColor="theme-panel" style={{ padding: '0 10px' }}>
        <View horizontal>
          <Text flex light {...headerTextProps}>SUN</Text>
          <Text flex light {...headerTextProps}>MON</Text>
          <Text flex light {...headerTextProps}>TUE</Text>
          <Text flex light {...headerTextProps}>WED</Text>
          <Text flex light {...headerTextProps}>THU</Text>
          <Text flex light {...headerTextProps}>FRI</Text>
          <Text flex light {...headerTextProps}>SAT</Text>
        </View>
        <Spacer size="xsmall" />
      </View>
      <Divider />
      <View flex padding="small" fillColor="theme-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        <Text style={{ textAlign: 'right' }}></Text>
        <Text style={{ textAlign: 'right' }}></Text>
        <Text style={{ textAlign: 'right' }}></Text>
        <Text style={{ textAlign: 'right' }}></Text>
        {days.map(day => (
          <View
            padding="small"
            fillColor={day === 29 ? 'blue-5' : undefined}
            style={{ borderRadius: 2.5 }}
          >
            <Text
              fontWeight={day === 29 ? 'bold' : undefined}
              textColor={day === 29 ? 'white' : undefined}
              style={{ textAlign: 'right' }}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default App;
