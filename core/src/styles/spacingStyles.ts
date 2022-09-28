import { createUseStyles } from 'react-jss';

const useSpacingStyles = createUseStyles({
  xxsmall: {
    minHeight: 2.5,
  },
  xsmall: {
    minHeight: 5,
  },
  small: {
    minHeight: 10,
  },
  medium: {
    minHeight: 15,
  },
  large: {
    minHeight: 20,
  },
  xlarge: {
    minHeight: 25,
  },
  xxlarge: {
    minHeight: 30,
  },
  'horizontal-xxsmall': {
    minWidth: 2.5,
  },
  'horizontal-xsmall': {
    minWidth: 5,
  },
  'horizontal-small': {
    minWidth: 10,
  },
  'horizontal-medium': {
    minWidth: 15,
  },
  'horizontal-large': {
    minWidth: 20,
  },
  'horizontal-xlarge': {
    minWidth: 25,
  },
  'horizontal-xxlarge': {
    minWidth: 30,
  },
});

export {
  useSpacingStyles,
};
