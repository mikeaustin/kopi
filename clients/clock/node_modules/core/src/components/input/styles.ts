import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Input: {
    borderRadius: 2.5,
    padding: '9px 10px',
    position: 'relative',

    '&:focus-within': {
      borderRadius: 3,
      boxShadow: `inset 0 0 0 3px ${OpenColor.blue[2]}`
    },

    '& input': {
      appearance: 'none',
      fontSize: 14,
      lineHeight: '20px',
      border: 'none',
      outline: 'none',
    }
  }
});

export default useStyles;
