import React, { useRef, useState } from 'react';

import * as parser from './lib/parser';
import * as core from './modules/core';
import * as math from './modules/operators';
import * as terminals from './modules/terminals';

import { View, Text, Icon, Spacer } from 'core';

import './App.css';

type AST =
  // | core.AST
  | math.AST<terminals.AST>
  | terminals.AST
  ;

type ASTKeys = keyof AST;

const visitors = {
  ...core.visitors,
  ...math.visitors,
  ...terminals.visitors,
} as const;

// Object.keys(visitors).reduce(
//   (value, key) => key === ast.type ? visitors[ast.type](ast, {}) : value,
//   undefined
// );

interface KopiValue {
  inspect(): Promise<string>,
};

function evaluate<TValue extends KopiValue>(
  astNode: AST,
  environment: {},
  type?: { new(...args: any): TValue; }
): TValue {
  let value;

  // visitors[astNode.type](astNode, environment, evaluate);

  switch (astNode.type) {
    case 'OperatorExpression':
      value = visitors[astNode.type](astNode, environment, evaluate);
      break;
    case 'NumericLiteral':
      value = visitors[astNode.type](astNode, environment);
      break;
    case 'BooleanLiteral':
      value = visitors[astNode.type](astNode, environment);
      break;
    default:
      const exhaustiveCheck: never = astNode;
      throw new Error();
  }

  if (type) {
    if (value instanceof type) {
      return value;
    } else {
      throw new Error(`Unexpected type ${type}`);
    }
  }

  return value as unknown as TValue;
}

type Kinds = 'n' | 's' | 'b';
type Reify<K extends Kinds> = K extends 'n' ? number : K extends 's' ? string : K extends 'b' ? boolean : never;
type Record<K extends Kinds> = { kind: K, v: Reify<K>, f: (v: Reify<K>) => void; };

function processRecord<K extends Kinds>(record: Record<K>) {
  record.f(record.v);
}

const val: Record<'n'> = { kind: 'n', v: 1, f: (x: number) => { } };
const val2: Record<'s'> = { kind: 's', v: '1', f: (x: string) => { } };
processRecord(val);
processRecord(val2);

//

function App() {
  const [history, setHistory] = useState<string[]>([]);
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
      const ast = parser.parse(line.trim()) as AST;
      const value = await evaluate(ast, {})?.inspect();

      setHistory(history => [...history, '> ' + line + ' ']);
      setHistory(history => [...history, value + ' ']);
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
        <Spacer size="xsmall" />
        <input ref={inputElementRef} value={line} style={{ flex: 1, border: 0, padding: 0, outline: 'none', fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace', fontSize: 14, lineHeight: 1, marginTop: -4, marginBottom: -4, background: 'transparent' }} onKeyDown={handleInputKeyDown} onChange={handleInputChange} />
      </View>
    </View>
  );
}

export default App;
