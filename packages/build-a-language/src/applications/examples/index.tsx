/* eslint-disable @typescript-eslint/no-unused-vars */

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from '../../components';

const FontSizes = () => {
  return (
    <View justifyContent="center">
      <Spacer size="small" background="theme-panel" />
      <List spacerSize="small" spacerColor="theme-panel" alignItems="center">
        <Text fontSize="xlarge" style={{ position: 'relative', whiteSpace: 'nowrap' }}>XLarge (30px)</Text>
        <Text fontSize="large" style={{ position: 'relative', whiteSpace: 'nowrap' }}>Large (24px)</Text>
        <Text fontSize="medium" style={{ position: 'relative', whiteSpace: 'nowrap' }}>Medium (18px)</Text>
        <Text fontSize="small" style={{ position: 'relative', whiteSpace: 'nowrap' }}>Small (14px)</Text>
        <Text fontSize="xsmall" style={{ position: 'relative', whiteSpace: 'nowrap' }}>XSmall (12px)</Text>
        <Text fontSize="tiny">TINY (11px)</Text>
      </List>
      <Spacer size="small" background="theme-panel" />
    </View>
  );
};

const Buttons = () => {
  return (
    <View>
      <View horizontal justifyContent="center" alignItems="center">
        <Button hover title="Hover" />
        <Spacer size="small" />
        <Button title="Default" />
        <Spacer size="small" />
        <Button solid title="Solid" />
        <Spacer size="small" />
        <Button primary title="Primary" />
        <Spacer size="small" />
        <Button primary solid title="Primary Solid" />
        <Spacer size="small" />
        <Button link title="Link" />
      </View>
      <Spacer size="small" />
      <View horizontal justifyContent="center" alignItems="center">
        <Button hover title="Multiline\nHover" />
        <Spacer size="small" />
        <Button title="Multiline\nDefault" />
        <Spacer size="small" />
        <Button solid title="Multiline\nSolid" />
        <Spacer size="small" />
        <Button primary title="Multiline\nPrimary" />
        <Spacer size="small" />
        <Button primary solid title="Multiline\nPrimary Solid" />
        <Spacer size="small" />
        <Button link title="Multiline\nLink" />
      </View>
      <Spacer size="small" />
      <View horizontal justifyContent="center" alignItems="center">
        <Button rounded hover title="Hover" />
        <Spacer size="small" />
        <Button rounded title="Default" />
        <Spacer size="small" />
        <Button rounded solid title="Solid" />
        <Spacer size="small" />
        <Button rounded primary title="Primary" />
        <Spacer size="small" />
        <Button rounded primary solid title="Primary Solid" />
        <Spacer size="small" />
        <Button rounded link title="Link" />
      </View>
      <Spacer size="small" />
      <View horizontal justifyContent="center" alignItems="center">
        <Button disabled hover title="Hover" />
        <Spacer size="small" />
        <Button disabled title="Default" />
        <Spacer size="small" />
        <Button disabled solid title="Solid" />
        <Spacer size="small" />
        <Button disabled primary title="Primary" />
        <Spacer size="small" />
        <Button disabled primary solid title="Primary Solid" />
        <Spacer size="small" />
        <Button disabled link title="Link" />
      </View>
    </View>
  );
};

const Examples = () => {
  return (
    <>
      <View justifyContent="center" padding="medium">
        <View horizontal>
          <FontSizes />
          <Divider spacerSize="medium" />
          <Buttons />
        </View>
        <Divider spacerSize="medium" />
        <View>
          <Text fitContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur.
          </Text>
        </View>
        <Divider spacerSize="medium" />
        <View horizontal>
          <Text fitContent fontSize="large" style={{ flex: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </Text>
          <Spacer size="medium" />
          <Text fitContent fontSize="medium" style={{ flex: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...
          </Text>
          <Spacer size="medium" />
          <Text fitContent style={{ flex: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...
          </Text>
        </View>
      </View>
    </>
  );
};

export default Examples;
