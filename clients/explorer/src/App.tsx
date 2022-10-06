import React, { useEffect, useState } from 'react';
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

const Folder = ({ Prefix, level }: AWS.S3.CommonPrefix & { level: number; }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFolderExpandClick = () => {
    setIsExpanded(isExpanded => !isExpanded);
  };

  return (
    <View >
      <Stack key={Prefix} horizontal align="left">
        <Icon icon="chevron-right" size="xs" style={{ cursor: 'pointer', marginLeft: level * 20 }} rotation={isExpanded ? 90 : undefined} onClick={handleFolderExpandClick} />
        <Icon icon="folder" />
        <Spacer size="xsmall" />
        <Text>{Prefix?.split('/').at(-2)}</Text>
      </Stack>
      {isExpanded && (
        <>
          <Spacer size="small" />
          <Entry path={Prefix ?? ''} level={level + 1} />
        </>
      )}
    </View>
  );
};

const File = ({ Key, Size, LastModified, level }: AWS.S3.Object & { level: number; }) => {
  return (
    <Stack horizontal align="left">
      <Icon icon="file" style={{ marginLeft: level * 20 + 20 }} />
      <Spacer size="xsmall" />
      <Text style={{ width: 300 - (level * 20) }}>{Key?.split('/').at(-1)}</Text>
      <Text style={{ width: 150 }}>{Size}</Text>
      <Text>{LastModified?.toLocaleDateString()}</Text>
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

  useEffect(() => {
    (async () => {
      const objects = await s3.listObjectsV2({
        Bucket: 'mike-austin',
        Prefix: path,
        StartAfter: path,
        Delimiter: '/',
      }).promise();

      // console.log(objects);

      setObjects(objects);
    })();
  }, [path]);

  return (
    <Stack flex spacing="small" {...props}>
      {objects?.CommonPrefixes?.map((item) => (
        <Folder level={level} key={item.Prefix} {...item} />
      ))}
      {objects?.Contents?.map((item) => (
        <File level={level} key={item.Key} {...item} />
      ))}
    </Stack>
  );
};

function App() {
  return (
    <View fillColor="gray-1" className="App">
      <Spacer size="small" />
      <Stack horizontal padding="small medium">
        <Text light caps fontSize="xsmall" fontWeight="bold" style={{ width: 345 }}>Name</Text>
        <Text light caps fontSize="xsmall" fontWeight="bold" style={{ width: 150 }}>Size</Text>
        <Text light caps fontSize="xsmall" fontWeight="bold">Last Modified</Text>
      </Stack>
      <Divider />
      <Entry path={'photos/'} padding="small medium" fillColor="white" />
    </View>
  );
}

export default App;
