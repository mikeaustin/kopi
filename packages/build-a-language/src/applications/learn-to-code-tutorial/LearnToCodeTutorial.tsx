/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState, useCallback } from 'react';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from '../../components';

import Tutorial, { type Page } from '../../components/tutorial/Tutorial';

import pages from './data';

type ContentProps = {
  data: {
    url: string;
  };
};

const Content = ({
  data,
}: ContentProps) => {
  console.log(data.url);
  return <View flex tag="iframe" src={data.url} style={{ border: 'none' }} />;
};

const options = {

};

const BuildALanguageTutorial = () => {
  return (
    <Tutorial pages={pages} Content={Content} />
  );
};

export default BuildALanguageTutorial;
