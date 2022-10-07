import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Text: {
    display: 'block',
  },
  textParent: {
    display: 'inline',
  },
  flex: {
    flex: 1,
  },
  light: {
    opacity: 0.5,
  },
  caps: {
    textTransform: 'uppercase',
  },
  hidden: {
    display: 'none',
  },
  center: {
    textAlign: 'center',
  }
});

export {
  useStyles,
};
