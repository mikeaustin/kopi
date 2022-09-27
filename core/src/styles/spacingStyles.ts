import { createUseStyles } from 'react-jss';

const useSpacingStyles = createUseStyles({
  xxsmall: {
    height: 2.5,
  },
  xsmall: {
    height: 5,
  },
  small: {
    height: 10,
  },
  medium: {
    height: 15,
  },
  large: {
    height: 20,
  },
  xlarge: {
    height: 25,
  },
  xxlarge: {
    height: 30,
  },
  'horizontal-xxsmall': {
    width: 2.5,
  },
  'horizontal-xsmall': {
    width: 5,
  },
  'horizontal-small': {
    width: 10,
  },
  'horizontal-medium': {
    width: 15,
  },
  'horizontal-large': {
    width: 20,
  },
  'horizontal-xlarge': {
    width: 25,
  },
  'horizontal-xxlarge': {
    width: 30,
  },
});

export {
  useSpacingStyles,
};
