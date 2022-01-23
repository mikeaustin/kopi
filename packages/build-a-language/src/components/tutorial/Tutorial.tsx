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
    <Clickable padding="medium" background={selected ? 'blue-0' : undefined} onMouseDown={handleClick}>
      <Text fontSize="medium" fontWeight="semi-bold">{`${index !== undefined ? index + 1 : ''}. ${title}`}</Text>
      <Spacer size="medium" />
      <Text>{subtitle}</Text>
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
        if (containerElementRef.current?.parentElement?.parentElement) {
          console.log(containerElementRef.current?.parentElement?.parentElement);

          containerElementRef.current.parentElement.parentElement.style.width = Math.min(window.innerWidth - 16, 1680) + 'px';
          containerElementRef.current.parentElement.parentElement.style.height = Math.min(window.innerHeight - 16 - 47, 900) + 'px';
        }
      }, 100);
    });
  }, []);

  return (
    <>
      <View ref={containerElementRef} flex horizontal style={{ overflow: 'auto', scrollSnapType: 'x mandatory' }}>
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
        <View horizontal style={{ flex: `1 0 ${window.innerWidth < 1680 ? '100%' : 0}`, scrollSnapType: 'x mandatory' }}>
          {typeof pages[currentPage].markdown === 'string' && (
            <>
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
            </>
          )}
          <View flex style={{ flex: `1 0 ${window.innerWidth < 1024 ? '100%' : 0}`, scrollSnapAlign: 'start' }}>
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
