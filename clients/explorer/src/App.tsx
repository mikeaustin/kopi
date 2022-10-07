import React, { useEffect, useState, useCallback } from 'react';
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

const Folder = ({ Prefix, level, selectedPath, selected, onPathSelect }: AWS.S3.CommonPrefix & { level: number, selectedPath: string | null, selected?: boolean, onPathSelect: (path: string | null) => void; }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRowClick = (event: React.PointerEvent) => {
    onPathSelect(Prefix ?? '');
  };

  const handleFolderExpandClick = (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsExpanded(isExpanded => !isExpanded);
  };

  const textColor = selected
    ? 'white'
    : undefined;

  return (
    <View>
      <Stack key={Prefix} horizontal align="left" padding="small" fillColor={selected ? 'blue-5' : undefined} style={{ borderRadius: 2.5, cursor: 'default' }} onPointerDown={handleRowClick}>
        <Icon icon="chevron-right" size="xs" color={textColor} style={{ width: 20, cursor: 'pointer', paddingTop: 4, paddingBottom: 4, marginLeft: level * 20 }} rotation={isExpanded ? 90 : undefined} onPointerDown={handleFolderExpandClick} />
        <Icon icon="folder" color="yellow-5" />
        <Spacer size="xsmall" />
        <Text textColor={textColor}>{Prefix?.split('/').at(-2)}</Text>
      </Stack>
      {isExpanded && (
        <Entry path={Prefix ?? ''} selectedPath={selectedPath} level={level + 1} onPathSelect={onPathSelect} />
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
  onPathSelect,
}: AWS.S3.Object & { level: number, selected: boolean, onPathSelect: (path: string | null) => void; }
) => {
  const handleRowClick = () => {
    onPathSelect(Key ?? '');
  };

  // useEffect(() => {
  //   return () => {
  //     console.log('unmount');
  //     if (selected) {
  //       onPathSelect(null);
  //     }
  //   };
  // }, [onPathSelect, selected]);

  const textColor = selected
    ? 'white'
    : undefined;

  const iconColor = selected
    ? 'white'
    : 'blue-5';

  return (
    <Stack horizontal align="left" padding="small" fillColor={selected ? 'blue-5' : undefined} style={{ borderRadius: 2.5, cursor: 'default' }} onPointerDown={handleRowClick}>
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
  selectedPath: string | null,
  level?: number,
  onPathSelect: (path: string | null) => void,
}

const Entry = ({
  path,
  selectedPath,
  level = 0,
  onPathSelect,
  ...props
}: EntryProps) => {
  const [objects, setObjects] = useState<PromiseResult<AWS.S3.ListObjectsV2Output, AWS.AWSError> | null>(null);

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
        <Folder key={item.Prefix} level={level} selectedPath={selectedPath} selected={item.Prefix === selectedPath} {...item} onPathSelect={onPathSelect} />
      ))}
      {objects?.Contents?.map((item) => (
        <File key={item.Key} level={level} selected={item.Key === selectedPath} {...item} onPathSelect={onPathSelect} />
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

  return (
    <View fillColor="gray-1" className="App">
      <Spacer size="small" />
      <Stack horizontal padding="small medium">
        <Text light caps fontSize="xsmall" fontWeight="bold" style={{ width: 345 }}>Name</Text>
        <Text light caps fontSize="xsmall" fontWeight="bold" style={{ width: 150 }}>Size</Text>
        <Text light caps fontSize="xsmall" fontWeight="bold">Last Modified</Text>
      </Stack>
      <Divider />
      <Entry path={''} selectedPath={selectedPath} padding="small" fillColor="white" style={{ overflowY: 'auto' }} onPathSelect={onPathSelect} />
    </View>
  );
}

export default App;
