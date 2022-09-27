import { createUseStyles } from 'react-jss';

const usePaddingStyles = createUseStyles({
  'small-none': {
    padding: '10px 0',
  },
  xxsmall: {
    padding: 2.5,
  },
  xsmall: {
    padding: 5,
  },
  small: {
    padding: 10,
  },
  medium: {
    padding: 15,
  },
  large: {
    padding: 20,
  },
  xlarge: {
    padding: 25,
  },
  xxlarge: {
    padding: 30,
  }
});

export {
  usePaddingStyles
};
