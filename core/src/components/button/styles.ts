import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';
import color from 'color';

const useStyles = createUseStyles({
  Button: {
    position: 'relative',
    appearance: 'none',
    border: 'none',
    outline: 'none',
    padding: '10px 16px',
    whiteSpace: 'nowrap',
    borderRadius: 2.5,
    cursor: 'pointer',

    // '&:focus': {
    //   boxShadow: `inset 0 0 0 2px ${OpenColor.blue[5]}`
    // },

    // '&:focus:before': {
    //   position: 'absolute',
    //   top: 0,
    //   right: 0,
    //   bottom: 0,
    //   left: 0,
    //   content: '""',
    //   borderRadius: 2.5,
    //   boxShadow: 'inset 0 0 0 2px hsla(0, 0%, 0%, 0.25)',
    // }

    '&:focus-visible': {
      // position: 'absolute',
      // inset: 0,
      // content: '""',
      // background: 'red'
      // border: '1px solid transparent',
      borderRadius: 3,
      // border: `2px dotted ${OpenColor.gray[5]}`,
      // boxShadow: '0 0 0 2px hsla(0, 0%, 0%, 0.5)',
      // boxShadow: `0 0 0 3px ${OpenColor.blue[5]}`
      boxShadow: `0 0 0 3px ${OpenColor.blue[2]}`
    },

    '&:disabled': {
      opacity: 0.5,
    },

    '&:hover': {
      // filter: 'brightness(1.05)',
      // opacity: 0.5
    },
  },
  solid: {
    // background: color(OpenColor.gray[6]).alpha(0.25).saturate(1.0).hexa(),
  },
  hover: {
    '&:hover': {
      background: color(OpenColor.gray[6]).alpha(0.25).saturate(1.0).hexa(),
    },
  },
  small: {
    padding: '8px 8px',
  }
});

export default useStyles;
