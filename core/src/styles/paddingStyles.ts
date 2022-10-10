import { createUseStyles } from 'react-jss';

const usePaddingStyles = createUseStyles({
  none: {
    padding: 0,
  },
  xxsmall: {
    padding: 2,
  },
  xsmall: {
    padding: 4,
  },
  small: {
    padding: 8,
  },
  medium: {
    padding: 16,
  },
  large: {
    padding: 24,
  },
  xlarge: {
    padding: 32,
  },
  xxlarge: {
    padding: 40,
  }
});

const usePaddingHorizontalStyles = createUseStyles({
  none: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  xxsmall: {
    paddingLeft: 2,
    paddingRight: 2,
  },
  xsmall: {
    paddingLeft: 4,
    paddingRight: 5,
  },
  small: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  medium: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  large: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  xlarge: {
    paddingLeft: 32,
    paddingRight: 32,
  },
  xxlarge: {
    paddingLeft: 40,
    paddingRight: 40,
  }
});

const usePaddingVerticalStyles = createUseStyles({
  none: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  xxsmall: {
    paddingTop: 2,
    paddingBottom: 2,
  },
  xsmall: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  small: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  medium: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  large: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  xlarge: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  xxlarge: {
    paddingTop: 40,
    paddingBottom: 40,
  }
});

export {
  usePaddingStyles,
  usePaddingVerticalStyles,
  usePaddingHorizontalStyles,
};
