import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

import { View, Text, Stack, Spacer, Divider, Icon } from 'core';

import './App.css';

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.Credentials({
  accessKeyId: 'AKIATDBOG2D72AZWREML',
  secretAccessKey: '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',
});

const s3 = new AWS.S3({
  params: {
    Bucket: 'https://mike-austin.s3.amazonaws.com/photos'
  }
});

interface AppContext {
  selectedPath: string | null,
  onPathSelect: (path: string) => void,
}

const AppContext = React.createContext<AppContext>({
  selectedPath: null,
  onPathSelect: (path: string) => undefined,
});

const Folder = ({
  Prefix,
  level,
  selected
}: AWS.S3.CommonPrefix & {
  level: number,
  selected?: boolean,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { onPathSelect } = useContext(AppContext);

  const handleRowPointerDown = (event: React.PointerEvent) => {
    onPathSelect(Prefix ?? '');
  };

  const handleExpandPointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsExpanded(isExpanded => !isExpanded);
  };

  const textColor = selected
    ? 'white'
    : undefined;

  return (
    <View>
      <Stack
        key={Prefix}
        horizontal
        align="left"
        padding="small"
        fillColor={selected ? 'blue-5' : undefined}
        style={{ borderRadius: 2.5, cursor: 'default' }}
        onPointerDown={handleRowPointerDown}
      >
        <Icon
          icon="chevron-right"
          size="xs"
          color={textColor}
          style={{ width: 20, cursor: 'pointer', paddingTop: 4, paddingBottom: 4, marginLeft: level * 20 }}
          rotation={isExpanded ? 90 : undefined}
          onPointerDown={handleExpandPointerDown}
        />
        <Icon icon="folder" color="yellow-5" />
        <Spacer size="xsmall" />
        <Text textColor={textColor}>{Prefix?.split('/').at(-2)}</Text>
      </Stack>
      {isExpanded && (
        <Entry path={Prefix ?? ''} level={level + 1} />
      )}
    </View>
  );
};

const File = ({
  Key,
  Size,
  LastModified,
  level,
  selected,
}: AWS.S3.Object & {
  level: number,
  selected: boolean,
}) => {
  const { onPathSelect } = useContext(AppContext);

  const handleRowPointerDown = () => {
    onPathSelect(Key ?? '');
  };

  const textColor = selected
    ? 'white'
    : undefined;

  const iconColor = selected
    ? 'white'
    : 'blue-5';

  return (
    <Stack horizontal align="left" padding="small" fillColor={selected ? 'blue-5' : undefined} style={{ borderRadius: 2.5, cursor: 'default' }} onPointerDown={handleRowPointerDown}>
      <Icon icon="image" color={iconColor} style={{ marginLeft: level * 20 + 20 }} />
      <Spacer size="xsmall" />
      <Text textColor={textColor} style={{ width: 300 - (level * 20) }}>{Key?.split('/').at(-1)}</Text>
      <Text textColor={textColor} style={{ width: 150 }}>{Size}</Text>
      <Text textColor={textColor}>{LastModified?.toLocaleDateString()}</Text>
    </Stack>
  );
};

interface EntryProps extends React.ComponentProps<typeof View> {
  path: string,
  level?: number,
}

const Entry = ({
  path,
  level = 0,
  ...props
}: EntryProps) => {
  const [objects, setObjects] = useState<PromiseResult<AWS.S3.ListObjectsV2Output, AWS.AWSError> | null>(null);
  const { selectedPath } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const objects = await s3.listObjectsV2({
        Bucket: 'mike-austin',
        Prefix: path,
        StartAfter: path,
        Delimiter: '/',
      }).promise();

      setObjects(objects);
    })();
  }, [path]);

  return (
    <Stack flex {...props}>
      {objects?.CommonPrefixes?.map((item) => (
        <Folder key={item.Prefix} level={level} selected={item.Prefix === selectedPath} {...item} />
      ))}
      {objects?.Contents?.map((item) => (
        <File key={item.Key} level={level} selected={item.Key === selectedPath} {...item} />
      ))}
    </Stack>
  );
};

function App() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const onPathSelect = useCallback((path: string | null) => {
    console.log(path);

    setSelectedPath(path);
  }, []);

  const appContextValue = useMemo(() => ({
    selectedPath,
    onPathSelect,
  }), [onPathSelect, selectedPath]);

  return (
    <AppContext.Provider value={appContextValue}>
      <View fillColor="gray-1" className="App">
        <Spacer size="small" />
        <Stack horizontal padding="small medium">
          <Text light caps fontSize="xsmall" fontWeight="bold" style={{ width: 345 }}>Name</Text>
          <Text light caps fontSize="xsmall" fontWeight="bold" style={{ width: 150 }}>Size</Text>
          <Text light caps fontSize="xsmall" fontWeight="bold">Last Modified</Text>
        </Stack>
        <Divider />
        <Entry path={''} padding="small" fillColor="white" style={{ overflowY: 'auto' }} />
      </View>
    </AppContext.Provider>
  );
}

export default App;
