import React, { useRef, useEffect, useLayoutEffect } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

import javascriptMod from './javascript.js';
import pegjsMod from './pegjs.js';

import View from '../view';

javascriptMod(CodeMirror);
pegjsMod(CodeMirror);

const Editor = () => {
  const containerRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      var editor = CodeMirror.fromTextArea(containerRef.current, {
        lineNumbers: true,
        mode: 'pegjs'
      });

      editor.setSize("100%", "100%");
    }
  }, []);

  return (
    <textarea ref={containerRef} style={{ flex: 1 }}>
      const x = 1;

    </textarea>
  );
};

export default Editor;
