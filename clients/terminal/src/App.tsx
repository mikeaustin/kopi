import React, { useRef, useState } from 'react';

import { View, Text, Icon, Spacer } from 'core';

import './App.css';

function App() {
  const [history, setHistory] = useState<string[]>([]);
  const [line, setLine] = useState<string>('');

  const inputElementRef = useRef<HTMLInputElement>(null);

  const handleTerminalPointerDown = () => {
    console.log('here');

    setTimeout(() => {
      console.log('here 2');
      if (inputElementRef.current) {
        inputElementRef.current.focus();
      }
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLine(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event);

    if (event.key === 'Enter') {
      setHistory(history => [...history, line]);
      setLine('');
    }
  };

  return (
    <View padding="small" fillColor="white" className="App" style={{ overflowY: 'auto' }} onPointerDown={handleTerminalPointerDown}>
      <View flex style={{ justifyContent: 'flex-end' }}>
        {history.map(line => (
          <Text style={{ padding: '4px 0', fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace' }}>{line}</Text>
        ))}
      </View>
      <Spacer size="xsmall" />
      <View horizontal align="left">
        {/* <Text style={{ fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace' }}>&gt;</Text> */}
        <Icon size="xs" icon="chevron-right" style={{ marginLeft: -5, marginTop: -5 }} />
        {/* <Spacer size="small" /> */}
        <input ref={inputElementRef} value={line} style={{ flex: 1, border: 0, padding: 0, outline: 'none', fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace', fontSize: 14, lineHeight: 1, marginTop: -4, marginBottom: -4, background: 'transparent' }} onKeyDown={handleInputKeyDown} onChange={handleInputChange} />
      </View>
    </View>
  );
}

export default App;
