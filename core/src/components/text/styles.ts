import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Text: {
    display: 'block',
    fontSize: 14,
    lineHeight: '20px',
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
