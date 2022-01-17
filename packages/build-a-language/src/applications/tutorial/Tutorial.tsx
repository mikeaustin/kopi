import React, { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import Peggy from 'peggy';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from '../../components';

import Editor from '../../components/editor';

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
      <Text fontSize="medium" fontWeight="semi-bold">{`${index !== undefined ? index + 1 : ''}. ${title}`}</Text>
      <Spacer size="medium" />
      <Text>{subtitle}</Text>
    </Clickable>
  );
};

const markdownComponents = {
  h1: ({ node, children }) => (
    <Text fontSize="xlarge" fontWeight="semi-bold" style={{ paddingBottom: 24 }}>{children}</Text>
  ),
  h2: ({ node, children }) => (
    <Text fontSize="large" fontWeight="semi-bold" style={{ paddingBottom: 32 }}>{children}</Text>
  ),
  p: ({ node, children }) => (
    <Text fontSize="medium" style={{ paddingBottom: 24 }}>{children}</Text>
  ),
  strong: ({ node, children }) => (
    <Text textParent fontWeight="bold">{children}</Text>
  ),
};

const Tutorial = ({ pages }) => {
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
  }, [currentPage, pages]);

  return (
    <>
      <View flex horizontal style={{ overflow: 'auto', scrollSnapType: 'x mandatory' }}>
        <View tag="ul" style={{ flex: '0 0 300px', scrollSnapAlign: 'start' }}>
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

        <View horizontal style={{ flex: `1 0 ${window.innerWidth < 1280 ? '100%' : 0}`, scrollSnapType: 'x mandatory' }}>
          <View background="gray-0" style={{ flex: `1 0 ${window.innerWidth < 1024 ? '100%' : 0}`, scrollSnapAlign: 'start' }}>
            <View flex>
              <View flex horizontalPadding="large" style={{ overflow: 'auto' }}>
                <Spacer size="large" />
                <View horizontal>
                  <Text flex fontSize="large" fontWeight="semi-bold">{pages[currentPage].title}</Text>
                  <Text fontSize="large" fontWeight="light">{currentPage + 1} / {pages.length}</Text>
                </View>
                <Spacer size="xlarge" />
                <ReactMarkdown components={markdownComponents}>
                  {pages[currentPage].markdown}
                </ReactMarkdown>
                <Spacer flex />
              </View>
              <View horizontalPadding="large">
                <Divider />
                <Spacer size="medium" />
                <View horizontal justifyContent="center">
                  <View flex>
                    <Text flex fontSize="medium" fontWeight="light" hidden={currentPage < 1}>
                      Previous: {pages[currentPage - 1]?.title}
                    </Text>
                  </View>
                  <View flex alignItems="flex-end">
                    <Text flex fontSize="medium" fontWeight="light" hidden={currentPage + 1 > pages.length - 1} style={{ textAlign: 'right' }}>
                      Next: {pages[currentPage + 1]?.title}
                    </Text>
                  </View>
                </View>
                <Spacer size="small" />
                <Spacer size="tiny" />
                <View horizontal justifyContent="center">
                  <View flex horizontal>
                    <Button
                      primary
                      title="Go Back"
                      leftIcon={<Text fontWeight="bold" textColor="primary" style={{ transform: 'scale(-1, 1)' }}>➜</Text>}
                      style={{ visibility: currentPage > 0 ? 'visible' : 'hidden' }}
                      hidden={currentPage < 1}
                      onClick={handlePreviousPageClick}
                    />
                  </View>
                  <View flex horizontal justifyContent="flex-end">
                    <Button
                      primary
                      solid
                      title="Continue"
                      rightIcon={<Text fontWeight="bold" textColor="white">➜</Text>}
                      hidden={currentPage + 1 > pages.length - 1}
                      onClick={handleNextPageClick}
                    />
                  </View>
                </View>
                <Spacer size="large" />
              </View>
            </View>
          </View>
          <Divider />
          <View flex style={{ flex: `1 0 ${window.innerWidth < 1024 ? '100%' : 0}`, scrollSnapAlign: 'start' }}>
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
      </View>
    </>
  );
};

export default Tutorial;
