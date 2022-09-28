import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Input: {
    borderRadius: 2.5,
    padding: '4px 10px',

    '&:focus-within': {
      boxShadow: `inset 0 0 0 2px ${OpenColor.blue[5]}`
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
