import React from 'react';

type Page<TData> = {
  title: string;
  data: TData;
};

type TutorialProps<TData> = {
  pages: Page<TData>[],
  Content: React.ComponentType<{ data: TData; }>;
};

const Tutorial = <TData,>({
  pages,
  Content,
}: TutorialProps<TData>) => {
  return <Content data={pages[0].data} />;
};

type ContentProps = {
  data: {
    grammar: string;
  };
};

const Content = ({ data }: ContentProps) => {
  return <div>{data.grammar}</div>;
};

const pages = [
  {
    title: 'hi',
    data: {
      grammar: 'hi'
    }
  }
];

const x = <Tutorial pages={pages} Content={Content} />;
