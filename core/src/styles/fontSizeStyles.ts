import { createUseStyles } from 'react-jss';

const useFontSizeStyles = createUseStyles({
  'xsmall': {
    fontSize: 11,
    margin: '-6px 0 -5px 0',
  },
  'small': {
    fontSize: 12,
    margin: '-6px 0 -5px 0',
  },
  'default': {
    fontSize: 14,
    lineHeight: '20px',
    margin: '-6px 0 -4px 0',
  },
  'medium': {
    fontSize: 18,
    lineHeight: '25px',
    margin: '-7px 0 -4.5px 0',
  },
  'large': {
    fontSize: 24,
    lineHeight: '30px',
    margin: '-8px 0 -4.5px 0',
  },
  'xlarge': {
    fontSize: 32,
    lineHeight: '40px',
    margin: '-9px 0 -6px 0',
  },
});

export {
  useFontSizeStyles
};
