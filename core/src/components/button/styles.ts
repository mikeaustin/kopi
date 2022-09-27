import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Button: {
    appearance: 'none',
    // background: OpenColor.blue[5],
    border: 'none',
    padding: '6px 16px',
    borderRadius: 2.5,
  }
});

export default useStyles;
