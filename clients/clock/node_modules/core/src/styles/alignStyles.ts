import { createUseStyles } from 'react-jss';

const useAlignVerticalStyles = createUseStyles({
  start: {
    alignItems: 'flex-start',
  },
  center: {
    alignItems: 'center',
  },
  end: {
    alignItems: 'flex-end',
  },
});

const useAlignHorizontalStyles = createUseStyles({
  start: {
    justifyContent: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
  end: {
    justifyContent: 'flex-end',
  },
});

export {
  useAlignVerticalStyles,
  useAlignHorizontalStyles,
};
