import React, { useEffect, useRef, useState } from 'react';

import { interpret } from './compiler';

import { View, Text, Icon, Spacer } from 'core';

import './App.css';
import './compiler';

function HistoryLine({ type, output }: { type: 'input' | 'output', output: React.ReactNode; }) {
  const outputElement = typeof output === 'string'
    ? <Text style={{ fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace' }}>{output}</Text>
    : output;

  return (
    <View horizontal align="left" style={{ padding: '4px 0' }}>
      {type === 'input' && (
        <>
          <Icon size="xs" icon="chevron-right" style={{ marginLeft: -4 }} />
          <Spacer size="xsmall" />
        </>
      )}
      {outputElement}
    </View>
  );
}

function App() {
  const [history, setHistory] = useState<{ type: 'input' | 'output', line: React.ReactNode; }[]>([]);
  const [line, setLine] = useState<string>('');

  const appElementRef = useRef<HTMLDivElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);

  const handleTerminalPointerDown = () => {
    setTimeout(() => {
      if (inputElementRef.current) {
        inputElementRef.current.focus();
      }
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLine(event.target.value);
  };

  const handleInputKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setHistory(history => [...history, { type: 'input', line: line + ' ' }]);
      setLine('');

      const value = await interpret(line);

      if (React.isValidElement((value as any)?.element)) {
        setHistory(history => [...history, { type: 'output', line: (value as any).element }]);

        return;
      }

      const inspect = await value.inspect();

      setHistory(history => [...history, { type: 'output', line: inspect + ' ' }]);
    }
  };

  useEffect(() => {
    if (appElementRef.current) {
      appElementRef.current.scrollTop = appElementRef.current.scrollHeight - appElementRef.current.clientHeight;
    }
  }, [history]);

  return (
    <View
      ref={appElementRef}
      padding="small"
      fillColor="white"
      className="App"
      style={{ overflowY: 'auto' }}
      onPointerDown={handleTerminalPointerDown}
    >
      <View flex style={{ justifyContent: 'flex-end' }}>
        {history.map((line, index) => (
          <HistoryLine key={index} type={line.type} output={line.line} />
        ))}
      </View>
      <View horizontal align="left">
        <Icon size="xs" icon="chevron-right" style={{ marginLeft: -4 }} />
        <Spacer size="xsmall" />
        <input
          ref={inputElementRef}
          value={line}
          style={{ flex: 1, border: 0, padding: 0, outline: 'none', fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace', fontSize: 14, lineHeight: '20px', background: 'transparent' }}
          onKeyDown={handleInputKeyDown}
          onChange={handleInputChange}
        />
      </View>
    </View>
  );
}

export default App;
