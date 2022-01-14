import React, { useRef, useState, useEffect } from 'react';
import CodeMirror, { EditorFromTextArea } from 'codemirror';
import 'codemirror/lib/codemirror.css';

import * as javascriptMod2 from 'codemirror/mode/javascript/javascript.js';
import javascriptMod from './languages/javascript.js';
import pegjsMod from './languages/pegjs.js';

import View from '../view';

console.log('>>>', javascriptMod2);
javascriptMod(CodeMirror);
pegjsMod(CodeMirror);

const Editor = ({
  defaultValue = '',
  onChange,
}: {
  defaultValue?: string;
  onChange?: (value: string) => void;
}) => {
  const containerRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<EditorFromTextArea>();

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = CodeMirror.fromTextArea(containerRef.current, {
        lineNumbers: true,
        mode: 'pegjs'
      });

      editorRef.current.setSize("100%", "100%");

      console.log(editorRef.current);

      editorRef.current.on('change', (instance) => {
        if (onChange) {
          onChange(instance.getValue());
        }
      });

      const editor = editorRef.current;

      return () => {
        editor.toTextArea();
      };
    }
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <View flex>
      <View tag="textarea" ref={containerRef} flex defaultValue={defaultValue.trim()} />
    </View>
  );
};

export default Editor;
