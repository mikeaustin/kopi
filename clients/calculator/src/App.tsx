import React from 'react';

import { View, Text, Button, Spacer, Divider } from 'core';

import './App.css';

function App() {
  return (
    <View fillColor="gray-1" className="App">
      <View padding="medium small" fillColor="white">
        <Text fontSize="xlarge" style={{ textAlign: 'right' }}>3.14159</Text>
      </View>
      <Divider />
      <View flex padding="small" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        <Button solid title="C" />
        <Button solid title="÷" />
        <Button solid title="×" />
        <Button solid title="-" />
        <Button solid title="7" />
        <Button solid title="8" />
        <Button solid title="9" />
        <Button solid title="+" style={{ gridColumnStart: 4, gridRow: '2 / 4' }} />
        <Button solid title="4" />
        <Button solid title="5" />
        <Button solid title="6" />
        <Button solid title="1" />
        <Button solid title="2" />
        <Button solid title="3" />
        <Button solid title="=" style={{ gridColumnStart: 4, gridRow: '4 / 6' }} />
        <Button solid title="0" style={{ gridColumn: '1 / 3' }} />
        <Button solid title="." />
      </View>
    </View>
  );
}

export default App;
