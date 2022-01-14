import React, { useEffect, useState } from 'react';
import Peggy from 'peggy';

import { View, Text, Input, Button, Spacer, Divider, List } from './components';

import Desktop from './components/desktop';
import Window from './components/window';
import Editor from './components/editor';

import styles from './App.module.scss';

import * as page1 from './data/page1';
import * as page2 from './data/page2';

const FontSizes = () => {
  return (
    <View flex justifyContent="center" alignItems="center">
      <Spacer size="small" background="gray-1" />
      <Text fontSize="xlarge">XLarge (36px)</Text>
      <Spacer size="small" background="gray-1" />
      <Text fontSize="large">Large (24px)</Text>
      <Spacer size="small" background="gray-1" />
      <Text fontSize="medium">Medium (18px)</Text>
      <Spacer size="small" background="gray-1" />
      <Text fontSize="small">Small (14px)</Text>
      <Spacer size="small" background="gray-1" />
      <Text fontSize="xsmall">XSmall (12px)</Text>
      <Spacer size="small" background="gray-1" />
    </View>
  );
};

const Buttons = () => {
  return (
    <View>
      <View horizontal justifyContent="center" alignItems="center">
        <Button link title="Link" />
        <Spacer size="small" />
        <Button title="Default" />
        <Spacer size="small" />
        <Button solid title="Solid" />
        <Spacer size="small" />
        <Button primary title="Primary" />
        <Spacer size="small" />
        <Button primary solid title="Primary Solid" />
      </View>
      <Spacer size="small" />
      <View horizontal justifyContent="center" alignItems="center">
        <Button link title="Multiline\nLink" />
        <Spacer size="small" />
        <Button title="Multiline\nDefault" />
        <Spacer size="small" />
        <Button solid title="Multiline\nSolid" />
        <Spacer size="small" />
        <Button primary title="Multiline\nPrimary" />
        <Spacer size="small" />
        <Button primary solid title="Multiline\nPrimary Solid" />
      </View>
      <Spacer size="small" />
      <View horizontal justifyContent="center" alignItems="center">
        <Button disabled link title="Link" />
        <Spacer size="small" />
        <Button disabled title="Default" />
        <Spacer size="small" />
        <Button disabled solid title="Solid" />
        <Spacer size="small" />
        <Button disabled primary title="Primary" />
        <Spacer size="small" />
        <Button disabled primary solid title="Primary Solid" />
      </View>
      <Spacer size="small" />
      <View horizontal justifyContent="center" alignItems="center">
        <Button rounded title="Default" />
        <Spacer size="small" />
        <Button rounded solid title="Solid" />
        <Spacer size="small" />
        <Button rounded primary title="Primary" />
        <Spacer size="small" />
        <Button rounded primary solid title="Primary Solid" />
      </View>
    </View>
  );
};

const SampleWindow = ({ ...props }) => {
  return (
    <Window title="Examples" style={{ left: 16, top: 16 }} {...props}>
      <View justifyContent="center" padding="medium">
        <View horizontal>
          <FontSizes />
          <Divider spacerSize="medium" />
          <Buttons />
        </View>
        <Divider spacerSize="medium" />
        <View>
          <Text fitContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur.
          </Text>
        </View>
        <Divider spacerSize="medium" />
        <View horizontal>
          <Text fitContent fontSize="large" style={{ flex: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </Text>
          <Spacer size="medium" />
          <Text fitContent fontSize="medium" style={{ flex: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...
          </Text>
          <Spacer size="medium" />
          <Text fitContent style={{ flex: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...
          </Text>
        </View>
      </View>
    </Window>
  );
};

const pages = [
  page1,
  page2,
];

function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [grammar, setGrammar] = useState(pages[currentPage].grammar);
  const [language, setLanguage] = useState(pages[currentPage].language);
  const [value, setValue] = useState('');

  const handleGrammarChange = (grammar: string) => {
    setGrammar(grammar);
  };

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
  };

  const handlePreviousPageClick = () => {
    setCurrentPage((currentPage) => currentPage > 0 ? currentPage - 1 : currentPage);
  };

  const handleNextPageClick = () => {
    setCurrentPage((currentPage) => currentPage < pages.length - 1 ? currentPage + 1 : currentPage);
  };

  useEffect(() => {
    try {
      const parser = Peggy.generate(grammar);

      setValue(parser.parse(language));
    } catch (error: any) {
      setValue(error.message);
    }
  }, [grammar, language]);

  useEffect(() => {
    setGrammar(pages[currentPage].grammar);
    setLanguage(pages[currentPage].language);
  }, [currentPage]);

  return (
    <View className={styles.App}>
      <View background="gray-9" alignItems="center" padding="medium">
        <Text fontSize="xlarge" fontWeight="bold" textColor="gray-3">
          Header{' '}
          <Text textColor="red-7">Header</Text>
        </Text>
      </View>
      <View flex horizontal>
        <Desktop>
          <SampleWindow />
          <Window horizontal title="Editor" style={{ left: 32, top: 62, width: 1280, height: 800 }}>
            <View flex>
              <View flex padding="large" background="gray-0">
                {pages[currentPage].content}
                <Spacer flex />
                <View horizontal justifyContent="center">
                  <Button primary title="Back" onClick={handlePreviousPageClick} />
                  <Spacer size="small" />
                  <Button primary solid title="Next" onClick={handleNextPageClick} />
                </View>
              </View>
              <Divider />
              <View horizontal style={{ minHeight: 100 }}>
                <View flex>
                  <Editor defaultValue={language} onChange={handleLanguageChange} />
                </View>
                <View flex>
                  <Text textColor="gray-6" style={{ fontFamily: 'monospace', padding: 5 }}>{value}</Text>
                </View>
              </View>
            </View>
            <Divider />
            <View flex>
              <Editor defaultValue={grammar} onChange={handleGrammarChange} />
            </View>
          </Window>
        </Desktop>
      </View>
    </View>
  );
}

export default App;
