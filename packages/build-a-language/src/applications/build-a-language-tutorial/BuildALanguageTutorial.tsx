/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Peggy from 'peggy';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from '../../components';

import Editor from '../../components/editor';

import Tutorial from '../../components/tutorial/Tutorial';

import * as page1 from './data/page1';
import * as page2 from './data/page2';
import * as page3 from './data/page3';
import * as page4 from './data/page4';

const pages = [
  page1,
  page2,
  page3,
  page4,
];

type ContentProps = {
  data: {
    grammar: string;
    language: string;
  };
};

const Content = ({
  data,
}: ContentProps) => {
  const [loadedGrammar, setLoadedGrammar] = useState(data.grammar);
  const [loadedLanguage, setLoadedLanguage] = useState(data.language);
  const [grammar, setGrammar] = useState(data.grammar);
  const [language, setLanguage] = useState(data.language);
  const [value, setValue] = useState('');

  const handleGrammarChange = useCallback((grammar: string) => {
    setGrammar(grammar);
  }, []);

  const handleLanguageChange = useCallback((language: string) => {
    setLanguage(language);
  }, []);

  useEffect(() => {
    try {
      const parser = Peggy.generate(grammar);

      setValue(JSON.stringify(parser.parse(language), undefined, 2));
    } catch (error: any) {
      setValue(error.toString());
    }
  }, [grammar, language]);

  useEffect(() => {
    setLoadedGrammar(data.grammar);
    setLoadedLanguage(data.language);
  }, [data]);

  return (
    <>
      <View horizontal style={{ minHeight: 100 }}>
        <View flex>
          <View padding="small" background="gray-0">
            <Text fontSize="tiny" fontWeight="bold" textColor="gray-6">INPUT</Text>
          </View>
          <Divider />
          <Editor defaultValue={loadedLanguage} onChange={handleLanguageChange} />
        </View>
        <Divider />
        <View flex>
          <View padding="small" background="gray-0">
            <Text fontSize="tiny" fontWeight="bold" textColor="gray-6">OUTPUT</Text>
          </View>
          <Divider />
          <Text style={{ fontFamily: 'monospace', padding: 5 }}>{value}</Text>
        </View>
      </View>
      <Divider />
      <View padding="small" background="gray-0">
        <Text fontSize="tiny" fontWeight="bold" textColor="gray-6">GRAMMAR</Text>
      </View>
      <Divider />
      <Editor defaultValue={loadedGrammar} onChange={handleGrammarChange} />
    </>
  );
};

const BuildALanguageTutorial = () => {
  return (
    <Tutorial pages={pages} Content={Content} />
  );
};

export default BuildALanguageTutorial;
