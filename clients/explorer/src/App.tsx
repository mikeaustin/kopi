import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
import AWS from 'aws-sdk';

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
  selectedPaths: string[],
  onPathSelect: (path: string) => void,
}

const AppContext = React.createContext<AppContext>({
  selectedPaths: [],
  onPathSelect: (path: string) => undefined,
});

interface S3Object {
  folders: { path: string; }[],
  files: { path: string, size: number, modified: Date; }[],
}

const Folder = ({
  path,
  level,
  selected
}: {
  path: string,
  level: number,
  selected?: boolean,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { onPathSelect } = useContext(AppContext);

  const handleRowPointerDown = (event: React.PointerEvent) => {
    onPathSelect(path);
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
        key={path}
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
        <Text textColor={textColor}>{path.split('/').at(-2)}</Text>
      </Stack>
      {isExpanded && (
        <Entry path={path} level={level + 1} />
      )}
    </View>
  );
};

const File = ({
  path,
  size,
  modified,
  level,
  selected,
}: {
  path: string,
  size: number,
  modified: Date,
  level: number,
  selected: boolean,
}) => {
  const { onPathSelect } = useContext(AppContext);

  const handleRowPointerDown = () => {
    onPathSelect(path);
  };

  const textColor = selected
    ? 'white'
    : undefined;

  const iconColor = selected
    ? 'white'
    : 'blue-5';

  return (
    <Stack
      horizontal
      align="left"
      padding="small"
      fillColor={selected ? 'blue-5' : undefined}
      style={{ borderRadius: 2.5, cursor: 'default' }}
      onPointerDown={handleRowPointerDown}
    >
      <Icon icon="image" color={iconColor} style={{ marginLeft: level * 20 + 20 }} />
      <Spacer size="xsmall" />
      <Text textColor={textColor} style={{ width: 300 - (level * 20) }}>{path.split('/').at(-1)}</Text>
      <Text textColor={textColor} style={{ width: 150 }}>{size}</Text>
      <Text textColor={textColor}>{modified.toLocaleDateString()}</Text>
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
  const [objects, setObjects] = useState<S3Object | null>(null);
  const { selectedPaths } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const objects = await s3.listObjectsV2({
        Bucket: 'mike-austin',
        Prefix: path,
        StartAfter: path,
        Delimiter: '/',
      }).promise();

      setObjects({
        folders: objects.CommonPrefixes?.map(({ Prefix }) => ({
          path: Prefix ?? '',
        })) ?? [],
        files: objects.Contents?.map(({ Key, Size, LastModified }) => ({
          path: Key ?? '',
          size: Size ?? 0,
          modified: LastModified ?? new Date(),
        })) ?? []
      });
    })();
  }, [path]);

  return (
    <Stack flex {...props}>
      {objects?.folders.map((item) => (
        <Folder key={item.path} level={level} selected={selectedPaths.includes(item.path)} {...item} />
      ))}
      {objects?.files.map((item) => (
        <File key={item.path} level={level} selected={selectedPaths.includes(item.path)} {...item} />
      ))}
    </Stack>
  );
};

function App() {
  const [selectedPaths, setSelectedPath] = useState<string[]>([]);

  const onPathSelect = useCallback((path: string) => {
    console.log(path);

    setSelectedPath(selectedPaths => [path]);
  }, []);

  const appContextValue = useMemo(() => ({
    selectedPaths,
    onPathSelect,
  }), [onPathSelect, selectedPaths]);

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
