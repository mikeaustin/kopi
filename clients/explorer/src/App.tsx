import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
import AWS from 'aws-sdk';

import { View, Text, Button, Stack, Spacer, Divider, Icon } from 'core';

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
  onFolderChange: (path: string) => void,
  onPathSelect: (path: string, metaKey: boolean) => void,
}

const AppContext = React.createContext<AppContext>({
  selectedPaths: [],
  onFolderChange: (path: string) => undefined,
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
  const { onFolderChange, onPathSelect } = useContext(AppContext);

  const handleRowPointerDown = (event: React.PointerEvent) => {
    event.preventDefault();

    onPathSelect(path, event.metaKey);
  };

  const handleExpandPointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsExpanded(isExpanded => !isExpanded);
  };

  const handleRowDoubleClick = (event: React.PointerEvent<HTMLDivElement>) => {
    console.log('here');

    event.preventDefault();

    onFolderChange(path);
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();

    event.currentTarget.style.boxShadow = 'inset 0 0 0 2px #339af0';

    event.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    event.currentTarget.style.boxShadow = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const data = event.dataTransfer.getData("text/plain");

    event.currentTarget.style.boxShadow = '';

    console.log(data, '>', path);
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
        onDoubleClick={handleRowDoubleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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

  const handleRowPointerDown = (event: React.PointerEvent) => {
    onPathSelect(path, event.metaKey);
  };

  const handleDragStart = (event: React.DragEvent) => {
    console.log('onDragStart');

    event.dataTransfer.setData("text/plain", path);

    event.dataTransfer.effectAllowed = "move";
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
      draggable
      align="left"
      padding="small"
      fillColor={selected ? 'blue-5' : undefined}
      style={{ borderRadius: 2.5, cursor: 'default' }}
      onPointerDown={handleRowPointerDown}
      onDragStart={handleDragStart}
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
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState('');
  const [selectedPaths, setSelectedPath] = useState<string[]>([]);

  const onFolderChange = useCallback((path: string) => {
    setFolderHistory(folderHistory => [...folderHistory, currentFolder]);
    setCurrentFolder(path);
  }, [currentFolder]);

  const handleHistoryBackClick = () => {
    setFolderHistory(folderHistory => folderHistory.slice(0, folderHistory.length - 1));
    setCurrentFolder(currentFolder => {
      const path = folderHistory.at(-1);

      return path ?? currentFolder;
    });
    setSelectedPath([]);
  };

  const onPathSelect = useCallback((path: string, metaKey: boolean) => {
    setSelectedPath(selectedPaths => {
      if (metaKey) {
        if (selectedPaths.includes(path)) {
          return selectedPaths.filter(selectedPath => selectedPath !== path);
        } else {
          return [...selectedPaths, path];
        }
      } else {
        return [path];
      }
    });
  }, []);

  const appContextValue = useMemo(() => ({
    selectedPaths,
    onFolderChange,
    onPathSelect,
  }), [selectedPaths, onFolderChange, onPathSelect]);

  return (
    <AppContext.Provider value={appContextValue}>
      <View className="App">
        <View horizontal padding="small medium" align="left" fillColor="gray-1">
          <Button solid icon="chevron-left" disabled={currentFolder === ''} onClick={handleHistoryBackClick} />
          <Spacer size="medium" />
          <View>
            <Text>https://mike-austin.s3.amazonaws.com/{currentFolder}</Text>
            {/* <Spacer size="medium" />
          <Text light fontSize="small">5 items</Text> */}
          </View>
          <Spacer flex size="medium" />
          <Stack horizontal spacing="medium" align="right">
            <Text>{selectedPaths.length > 0 ? selectedPaths.length : 'No'} items selected</Text>
            <Button title="Some Button" />
          </Stack>
        </View>
        <View fillColor="gray-1">
          <Spacer size="small" />
          <Stack horizontal padding="none medium">
            <Text light caps fontSize="xsmall" fontWeight="bold" style={{ width: 345 }}>Name</Text>
            <Text light caps fontSize="xsmall" fontWeight="bold" style={{ width: 150 }}>Size</Text>
            <Text light caps fontSize="xsmall" fontWeight="bold">Last Modified</Text>
          </Stack>
          <Spacer size="xsmall" />
        </View>
        <Divider />
        <Entry flex path={currentFolder} padding="small" fillColor="white" style={{ overflowY: 'auto' }} />
      </View>
    </AppContext.Provider>
  );
}

export default App;
