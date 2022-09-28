import { createUseStyles } from 'react-jss';

const useSpacingStyles = createUseStyles({
  xxsmall: {
    minHeight: 2.5,
    alignSelf: 'stretch'
  },
  xsmall: {
    minHeight: 5,
    alignSelf: 'stretch'
  },
  small: {
    minHeight: 10,
    alignSelf: 'stretch'
  },
  medium: {
    minHeight: 15,
    alignSelf: 'stretch'
  },
  large: {
    minHeight: 20,
    alignSelf: 'stretch'
  },
  xlarge: {
    minHeight: 25,
    alignSelf: 'stretch'
  },
  xxlarge: {
    minHeight: 30,
    alignSelf: 'stretch'
  },
  'horizontal-xxsmall': {
    minWidth: 2.5,
    alignSelf: 'stretch'
  },
  'horizontal-xsmall': {
    minWidth: 5,
    alignSelf: 'stretch'
  },
  'horizontal-small': {
    minWidth: 10,
    alignSelf: 'stretch'
  },
  'horizontal-medium': {
    minWidth: 15,
    alignSelf: 'stretch'
  },
  'horizontal-large': {
    minWidth: 20,
    alignSelf: 'stretch'
  },
  'horizontal-xlarge': {
    minWidth: 25,
    alignSelf: 'stretch'
  },
  'horizontal-xxlarge': {
    minWidth: 30,
    alignSelf: 'stretch'
  },
});

export {
  useSpacingStyles,
};
