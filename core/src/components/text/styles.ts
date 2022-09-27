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
  hidden: {
    display: 'none',
  }
});

export {
  useStyles,
};
