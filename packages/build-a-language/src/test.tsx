import React from "react";

type Page = {
  title: string;
  data: {
    grammar: string;
  };
};

type ContentProps = {
  data: Page['data'];
};

const Content = ({ data }: ContentProps) => {
  return <div>{data.grammar}</div>;
};

const Tutorial = <TData,>({
  Content,
  data,
}: {
  Content: React.ComponentType<{ data: TData; }>;
  data: TData;
}) => {
  return <Content data={data} />;
};

<Tutorial Content={Content} data={{ grammar: 'hi' }} />;

export { };
