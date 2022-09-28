import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

const gray = {
  'gray-0': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[0]}`,
  },
  'gray-1': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[1]}`,
  },
  'gray-2': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[2]}`,
  },
  'gray-3': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[3]}`,
  },
  'gray-4': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[4]}`,
  },
  'gray-5': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[5]}`,
  },
  'gray-6': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[6]}`,
  },
  'gray-7': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[7]}`,
  },
  'gray-8': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[8]}`,
  },
  'gray-9': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[9]}`,
  },
};

const blue = {
  'blue-0': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.blue[0]}`,
  },
  'blue-1': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.blue[1]}`,
  },
  'blue-2': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.blue[2]}`,
  },
  'blue-3': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.blue[3]}`,
  },
  'blue-4': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.blue[4]}`,
  },
  'blue-5': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.blue[5]}`,
  },
  'blue-6': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.blue[6]}`,
  },
  'blue-7': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.blue[7]}`,
  },
  'blue-8': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.blue[8]}`,
  },
  'blue-9': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.blue[9]}`,
  },
};

const useBorderColorStyles = createUseStyles({
  'transparent': {
    background: 'transparent'
  },
  'black': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.black}`,
  },
  'white': {
    boxShadow: `inset 0 0 0 1px ${OpenColor.white}`,
  },
  ...gray,
  ...blue,
});

export {
  useBorderColorStyles,
};
