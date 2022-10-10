import { createUseStyles } from 'react-jss';

const useSpacingStyles = createUseStyles({
  xxsmall: {
    minHeight: 2,
  },
  xsmall: {
    minHeight: 4,
  },
  small: {
    minHeight: 8,
  },
  medium: {
    minHeight: 16,
  },
  large: {
    minHeight: 24,
  },
  xlarge: {
    minHeight: 32,
  },
  xxlarge: {
    minHeight: 40,
  },
  'horizontal-xxsmall': {
    minWidth: 2,
  },
  'horizontal-xsmall': {
    minWidth: 4,
  },
  'horizontal-small': {
    minWidth: 8,
  },
  'horizontal-medium': {
    minWidth: 16,
  },
  'horizontal-large': {
    minWidth: 24,
  },
  'horizontal-xlarge': {
    minWidth: 32,
  },
  'horizontal-xxlarge': {
    minWidth: 40,
  },
});

export {
  useSpacingStyles,
};
