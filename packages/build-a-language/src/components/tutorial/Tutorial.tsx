/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from '..';

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
    <Clickable padding="medium" background={selected ? 'primary' : undefined} onMouseDown={handleClick}>
      <Text fontSize="medium" fontWeight="semi-bold" textColor={selected ? 'white' : undefined}>
        {`${index !== undefined ? index + 1 : ''}. ${title}`}
      </Text>
      <Spacer size="medium" />
      <Text textColor={selected ? 'white' : undefined}>
        {subtitle}
      </Text>
    </Clickable>
  );
};

const markdownComponents = {
  h1: ({ children }: { children: React.ReactNode; }) => (
    <Text fontSize="xlarge" fontWeight="semi-bold" style={{ paddingBottom: 24 }}>{children}</Text>
  ),
  h2: ({ children }: { children: React.ReactNode; }) => (
    <Text fontSize="large" fontWeight="semi-bold" style={{ paddingBottom: 32 }}>{children}</Text>
  ),
  p: ({ children }: { children: React.ReactNode; }) => (
    <Text fontSize="medium" style={{ paddingBottom: 24 }}>{children}</Text>
  ),
  strong: ({ children }: { children: React.ReactNode; }) => (
    <Text textParent fontWeight="bold">{children}</Text>
  ),
};

type Page<TData> = {
  title: string;
  subtitle: string;
  markdown: string | null;
  data: TData;
};

const StepsList = <TData,>({
  pages,
  currentPage,
  onPageSelect,
}: {
  pages: Page<TData>[];
  currentPage: number;
  onPageSelect: (page: number) => void;
}) => {
  return (
    <>
      {pages.map((page, index) => (
        <View key={index} tag="li">
          {index > 0 && <Divider />}
          <Heading
            title={page.title}
            subtitle={page.subtitle}
            index={index}
            selected={index === currentPage}
            onSelect={onPageSelect}
          />
        </View>
      ))}
      <Divider />
    </>
  );
};

const Markdown = <TData,>({ pages, currentPage, onPreviousPageClick, onNextPageClick }: {
  pages: Page<TData>[];
  currentPage: number;
  onPreviousPageClick: () => void;
  onNextPageClick: () => void;
}) => {
  return (
    <>
      <View flex horizontalPadding="large" style={{ overflow: 'auto' }}>
        <Spacer size="large" />
        <View horizontal>
          <Text flex fontSize="large" fontWeight="semi-bold">{pages[currentPage].title}</Text>
          <Text fontSize="large" fontWeight="light">{currentPage + 1} / {pages.length}</Text>
        </View>
        <Spacer size="xlarge" />
        <ReactMarkdown components={markdownComponents}>
          {pages[currentPage].markdown ?? ''}
        </ReactMarkdown>
        <Spacer flex />
      </View>
      <View horizontalPadding="large">
        <Divider />
        <Spacer size="medium" />
        <View horizontal justifyContent="center">
          <View flex hidden={window.innerWidth < 640 && currentPage < pages.length - 1}>
            <Text flex fontSize="medium" fontWeight="light" hidden={currentPage < 1}>
              Previous: {pages[currentPage - 1]?.title}
            </Text>
          </View>
          <View flex alignItems="flex-end" hidden={window.innerWidth < 640 && currentPage + 1 > pages.length - 1}>
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
              onClick={onPreviousPageClick}
            />
          </View>
          <View flex horizontal justifyContent="flex-end">
            <Button
              primary
              solid
              title="Continue"
              rightIcon={<Text fontWeight="bold" textColor="white">➜</Text>}
              hidden={currentPage + 1 > pages.length - 1}
              onClick={onNextPageClick}
            />
          </View>
        </View>
        <Spacer size="large" />
      </View>
    </>
  );
};

type TutorialProps<TData> = {
  pages: Page<TData>[];
  Content: React.ComponentType<{ data: TData; }>;
};

const Tutorial = <TData,>({
  pages,
  Content,
}: TutorialProps<TData>) => {
  const containerElementRef = useRef<HTMLDivElement>();
  const [currentPage, setCurrentPage] = useState<number>(0);

  const handlePreviousPageClick = useCallback(() => {
    setCurrentPage((currentPage) => currentPage > 0 ? currentPage - 1 : currentPage);
  }, []);

  const handleNextPageClick = useCallback(() => {
    setCurrentPage((currentPage) => currentPage < pages.length - 1 ? currentPage + 1 : currentPage);
  }, [pages.length]);

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    window.addEventListener('orientationchange', (event) => {
      setTimeout(() => {
        const windowElement = containerElementRef.current?.parentElement?.parentElement;

        if (windowElement) {
          windowElement.style.width = Math.min(window.innerWidth - 16, 1920) + 'px';
          windowElement.style.height = Math.min(window.innerHeight - 16 - 47, 1080) + 'px';
        }
      }, 100);
    });
  }, []);

  return (
    <>
      <View ref={containerElementRef} flex horizontal scrollX scrollSnapX>
        <View tag="ul" scrollY scrollSnapAlign="start" style={{ flex: '0 0 300px' }}>
          <StepsList pages={pages} currentPage={currentPage} onPageSelect={handlePageSelect} />
        </View>
        <Divider />
        <View horizontal style={{ flex: `1 0 ${window.innerWidth < 1680 ? '100%' : 0}` }}>
          {typeof pages[currentPage].markdown === 'string' && (
            <>
              <View
                background="theme-panel"
                scrollSnapAlign="start"
                style={{ flex: `1 0 ${window.innerWidth < 1024 ? '100%' : 0}`, minHeight: 0 }}
              >
                <Markdown
                  pages={pages}
                  currentPage={currentPage}
                  onPreviousPageClick={handlePreviousPageClick}
                  onNextPageClick={handleNextPageClick}
                />
              </View>
              <Divider />
            </>
          )}
          <View
            flex
            scrollSnapAlign="start"
            style={{ flex: `1 0 ${window.innerWidth < 1024 ? '100%' : 0}`, width: '100%' }}
          >
            <Content data={pages[currentPage].data} />
          </View>
        </View>
      </View>
    </>
  );
};

export default Tutorial;

export type {
  TutorialProps,
  Page,
};
