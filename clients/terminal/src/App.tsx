import React, { useEffect, useRef, useState } from 'react';

import { interpret } from './compiler';

import { View, Text, Icon, Spacer } from 'core';

import './App.css';
import './compiler';

function HistoryLine({ type, output }: { type: 'input' | 'output', output: React.ReactNode; }) {
  const outputElement = typeof output === 'string'
    ? <Text style={{ minHeight: 20, fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace' }}>{output}</Text>
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
  const [historyLines, setHistoryLines] = useState<{ type: 'input' | 'output', line: React.ReactNode; }[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentLine, setLine] = useState<string>('');

  const history = useRef<string[]>([]);
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
      setHistoryLines(historyLines => [...historyLines, { type: 'input', line: currentLine.trim() }]);

      if (currentLine.trim().length !== 0) {
        history.current.push(currentLine.trim());

        setHistoryIndex(-1);
      }

      setLine('');

      const value = await interpret(currentLine);

      if (React.isValidElement((value as any)?.element)) {
        setHistoryLines(historyLines => [...historyLines, { type: 'output', line: (value as any).element }]);

        return;
      }

      const inspect = await value.inspect();

      setHistoryLines(historyLines => [...historyLines, { type: 'output', line: inspect + ' ' }]);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();

      setHistoryIndex(historyIndex => historyIndex < history.current.length ? historyIndex + 1 : historyIndex);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();

      setHistoryIndex(historyIndex => historyIndex > 0 ? historyIndex - 1 : historyIndex);
    }
  };

  useEffect(() => {
    const item = history.current[history.current.length - historyIndex];

    if (item === undefined) {
      setLine('');
    } else {
      setLine(item);
    }
  }, [historyIndex]);

  useEffect(() => {
    if (appElementRef.current) {
      appElementRef.current.scrollTop = appElementRef.current.scrollHeight - appElementRef.current.clientHeight;
    }
  }, [historyLines]);

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
        {historyLines.map((line, index) => (
          <HistoryLine key={index} type={line.type} output={line.line} />
        ))}
      </View>
      <View horizontal align="left">
        <Icon size="xs" icon="chevron-right" style={{ marginLeft: -4 }} />
        <Spacer size="xsmall" />
        <input
          ref={inputElementRef}
          value={currentLine}
          style={{ flex: 1, border: 0, padding: 0, outline: 'none', fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace', fontSize: 14, lineHeight: '20px', background: 'transparent' }}
          onKeyDown={handleInputKeyDown}
          onChange={handleInputChange}
        />
      </View>
    </View>
  );
}

export default App;
