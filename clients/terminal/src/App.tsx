import React, { useRef, useState } from 'react';

import { interpret } from './compiler';

import { View, Text, Icon, Spacer } from 'core';

import './App.css';

import './compiler';

// type AST =
//   // | core.AST
//   | math.AST<terminals.AST>
//   | terminals.AST
//   ;

// const visitors = {
//   ...core.visitors,
//   ...math.visitors,
//   ...terminals.visitors,
// } as const;

// interface KopiValue {
//   inspect(): Promise<string>,
// };

// function evaluate<TValue extends KopiValue>(
//   astNode: AST,
//   environment: {},
//   type?: { new(...args: any): TValue; }
// ): TValue {
//   let value;

//   switch (astNode.type) {
//     case 'OperatorExpression':
//       value = visitors[astNode.type](astNode, environment, evaluate);
//       break;
//     case 'NumericLiteral':
//       value = visitors[astNode.type](astNode, environment);
//       break;
//     case 'BooleanLiteral':
//       value = visitors[astNode.type](astNode, environment);
//       break;
//     default:
//       const exhaustiveCheck: never = astNode;
//       throw new Error();
//   }

//   if (type) {
//     if (value instanceof type) {
//       return value;
//     } else {
//       throw new Error(`Unexpected type ${type}`);
//     }
//   }

//   return value as unknown as TValue;
// }

//

function HistoryLine({ type, output }: { type: 'input' | 'output', output: string; }) {
  const icon = type === 'input' ? 'chevron-right' : 'chevron-left';

  return (
    <View horizontal align="left">
      <Icon size="xs" icon={icon} style={{ marginLeft: -5, marginTop: -5 }} />
      <Spacer size="xsmall" />
      <Text style={{ padding: '4px 0', fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace' }}>
        {output}
      </Text>
    </View>
  );
}

function App() {
  const [history, setHistory] = useState<{ type: 'input' | 'output', line: string; }[]>([]);
  const [line, setLine] = useState<string>('');

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

      const value = await (await interpret(line)).inspect();

      setHistory(history => [...history, { type: 'output', line: value + ' ' }]);
    }
  };

  return (
    <View padding="small" fillColor="white" className="App" style={{ overflowY: 'auto' }} onPointerDown={handleTerminalPointerDown}>
      <View flex style={{ justifyContent: 'flex-end' }}>
        {history.map((line, index) => (
          <HistoryLine key={index} type={line.type} output={line.line} />
        ))}
      </View>
      <Spacer size="xsmall" />
      <View horizontal align="left">
        {/* <Text style={{ fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace' }}>&gt;</Text> */}
        <Icon size="xs" icon="chevron-right" style={{ marginLeft: -5, marginTop: -5 }} />
        <Spacer size="xsmall" />
        <input ref={inputElementRef} value={line} style={{ flex: 1, border: 0, padding: 0, outline: 'none', fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace', fontSize: 14, lineHeight: 1, marginTop: -4, marginBottom: -4, background: 'transparent' }} onKeyDown={handleInputKeyDown} onChange={handleInputChange} />
      </View>
    </View>
  );
}

export default App;
