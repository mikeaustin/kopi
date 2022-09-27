import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  View: {
    display: 'flex',
    flexDirection: 'column',
  },
  horizontal: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  }
});

export default useStyles;
