import { createUseStyles } from 'react-jss';

const useFontWeightStyles = createUseStyles({
  'light': { fontWeight: 300 },
  'normal': { fontWeight: 400 },
  'medium': { fontWeight: 500 },
  'semi-bold': { fontWeight: 600 },
  'bold': { fontWeight: 700 },
  'extra-bold': { fontWeight: 800 },
});

export {
  useFontWeightStyles
};
