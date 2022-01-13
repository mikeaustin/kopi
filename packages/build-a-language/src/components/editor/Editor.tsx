import React, { useRef, useEffect } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

import javascriptMod from './languages/javascript.js';
import pegjsMod from './languages/pegjs.js';

import View from '../view';

javascriptMod(CodeMirror);
pegjsMod(CodeMirror);

const Editor = () => {
  const containerRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      var editor = CodeMirror.fromTextArea(containerRef.current, {
        lineNumbers: true,
        mode: 'pegjs'
      });

      editor.setSize("100%", "100%");
    }

    return () => {
      editor.toTextArea();
    };
  }, []);

  return (
    <View tag="textarea" ref={containerRef} flex>
      const x = 1;
    </View>
  );
};

export default Editor;
