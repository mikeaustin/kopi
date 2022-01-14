import React, { useEffect, useState, useCallback } from 'react';
import Peggy from 'peggy';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from './components';

import Desktop from './components/desktop';
import Window from './components/window';
import Editor from './components/editor';

import styles from './App.module.scss';

import * as page1 from './data/page1';
import * as page2 from './data/page2';
import * as page3 from './data/page3';

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
  page3,
];

const Heading = ({ title, subtitle, index, selected, onSelect }: {
  title: string;
  subtitle?: string;
  index?: number;
  selected?: boolean;
  onSelect?: any;
}) => {
  const handleClick = () => {
    onSelect(index);
  };

  return (
    <Clickable padding="medium" background={selected ? 'blue-0' : undefined} onMouseDown={handleClick}>
      <Text fontSize="medium" fontWeight="semi-bold">{title}</Text>
      <Spacer size="medium" />
      <Text>{subtitle}</Text>
    </Clickable>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loadedGrammar, setLoadedGrammar] = useState(pages[currentPage].grammar);
  const [loadedLanguage, setLoadedLanguage] = useState(pages[currentPage].language);
  const [grammar, setGrammar] = useState(pages[currentPage].grammar);
  const [language, setLanguage] = useState(pages[currentPage].language);
  const [value, setValue] = useState('');

  const handleGrammarChange = useCallback((grammar: string) => {
    setGrammar(grammar);
  }, []);

  const handleLanguageChange = useCallback((language: string) => {
    setLanguage(language);
  }, []);

  const handlePreviousPageClick = useCallback(() => {
    setCurrentPage((currentPage) => currentPage > 0 ? currentPage - 1 : currentPage);
  }, []);

  const handleNextPageClick = useCallback(() => {
    setCurrentPage((currentPage) => currentPage < pages.length - 1 ? currentPage + 1 : currentPage);
  }, []);

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    try {
      const parser = Peggy.generate(grammar);

      setValue(JSON.stringify(parser.parse(language), undefined, 2));
    } catch (error: any) {
      setValue(error.toString());
    }
  }, [grammar, language]);

  useEffect(() => {
    setLoadedGrammar(pages[currentPage].grammar);
    setLoadedLanguage(pages[currentPage].language);
  }, [currentPage]);

  return (
    <View className={styles.App}>
      <View background="gray-9" alignItems="center" padding="medium">
        <Text fontSize="large" fontWeight="bold" textColor="gray-3">
          Header{' '}
          <Text textColor="red-7">Header</Text>
        </Text>
      </View>
      <View flex horizontal>
        <Desktop>
          <SampleWindow />
          <Window horizontal title="Tutorial: Let’s Build a Programming Language" style={{ left: 32, top: 62, width: 1600, height: 800 }}>
            <View tag="ul" style={{ flex: '0 0 250px' }}>
              {pages.map((page, index) => (
                <View key={index} tag="li">
                  {index > 0 && <Divider />}
                  <Heading
                    title={page.title}
                    subtitle={page.subtitle}
                    index={index}
                    selected={index === currentPage}
                    onSelect={handlePageSelect}
                  />
                </View>
              ))}
              <Divider />
            </View>
            <Divider />
            <View flex horizontal>
              <View flex>
                <View flex padding="medium" horizontalPadding="large" background="gray-0">
                  <Spacer size="medium" />
                  {pages[currentPage].content}
                  <Spacer flex />
                  <View horizontal justifyContent="center">
                    <View flex>
                      <View horizontal justifyContent="flex-start">
                        <Button primary title="Back" onClick={handlePreviousPageClick} />
                      </View>
                      <Spacer size="small" />
                      <Text fontWeight="semi-bold">Introduction</Text>
                    </View>

                    <View horizontal flex justifyContent="center" alignItems="flex-end">
                      <Text fontWeight="light" fontSize="large">{currentPage + 1} / {pages.length}</Text>
                      {/* <Spacer size="small" /> */}
                    </View>

                    <View flex alignItems="flex-end">
                      <View horizontal justifyContent="flex-end">
                        <Button primary solid title="Next" onClick={handleNextPageClick} />
                      </View>
                      <Spacer size="small" />
                      <Text fontWeight="semi-bold">Syntax and Grammar</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Divider />
              <View flex>
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
              </View>
            </View>
          </Window>

        </Desktop>
      </View>
    </View>
  );
}

export default App;
