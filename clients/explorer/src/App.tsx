import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

import { View, Text, Stack, Spacer, Divider, Icon } from 'core';

import './App.css';

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.Credentials({
  accessKeyId: 'AKIATDBOG2D72AZWREML',
  secretAccessKey: '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',
});

interface Folder {
  folders?: AWS.S3.CommonPrefixList,
  files?: AWS.S3.ObjectList,
  expanded: boolean,
  chidren?: Folder,
}

const Entry = ({
  path
}: {
  path: string,
}) => {
  const [objects, setObjects] = useState<Folder | null>(null);

  useEffect(() => {
    (async () => {
      const s3 = new AWS.S3({
        params: {
          // Bucket: 'https://mike-austin.s3.amazonaws.com/photos'
        }
      });

      const objects = await s3.listObjectsV2({
        Bucket: 'mike-austin',
        Prefix: 'photos/',
        StartAfter: 'photos/',
        Delimiter: '/',
      }).promise();

      console.log(objects);

      setObjects({
        files: objects.Contents?.map(file => ({
          ...file,
          Key: file.Key?.split('/')[1]
        })),
        folders: objects.CommonPrefixes?.map(file => ({
          ...file,
          Prefix: file.Prefix?.split('/')[1]
        })),
        expanded: false,
      });
    })();
  }, []);

  const handleFolderExpandClick = () => {

  };

  return (
    <Stack flex padding="small medium" spacing="small" fillColor="white">
      {objects?.folders?.map((item) => (
        <Stack key={item.Prefix} horizontal>
          <Icon icon="chevron-right" style={{ cursor: 'pointer' }} onClick={handleFolderExpandClick} />
          <Icon icon="folder" />
          <Spacer size="xsmall" />
          <Text>{item.Prefix}</Text>
        </Stack>
      ))}
      {objects?.files?.map((item) => (
        <Stack key={item.Key} horizontal align="left">
          <View style={{ width: 20 }} />
          <Icon icon="file" />
          <Spacer size="xsmall" />
          <Text style={{ width: 300 }}>{item.Key}</Text>
          <Text style={{ width: 150 }}>{item.Size}</Text>
          <Text>{item.LastModified?.toLocaleDateString()}</Text>
        </Stack>
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
      <Entry path={'photos/'} />
    </View>
  );
}

export default App;
