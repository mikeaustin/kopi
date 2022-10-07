import { createUseStyles } from 'react-jss';

const usePaddingStyles = createUseStyles({
  none: {
    padding: 0,
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

const usePaddingHorizontalStyles = createUseStyles({
  none: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  xxsmall: {
    paddingLeft: 2.5,
    paddingRight: 2.5,
  },
  xsmall: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  small: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  medium: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  large: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  xlarge: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  xxlarge: {
    paddingLeft: 30,
    paddingRight: 30,
  }
});

const usePaddingVerticalStyles = createUseStyles({
  none: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  xxsmall: {
    paddingTop: 2.5,
    paddingBottom: 2.5,
  },
  xsmall: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  small: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  medium: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  large: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  xlarge: {
    paddingTop: 25,
    paddingBottom: 25,
  },
  xxlarge: {
    paddingTop: 30,
    paddingBottom: 30,
  }
});

export {
  usePaddingStyles,
  usePaddingVerticalStyles,
  usePaddingHorizontalStyles,
};
