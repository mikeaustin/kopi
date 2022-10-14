import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

const gray = {
  'gray-0': {
    background: OpenColor.gray[0],
  },
  'gray-1': {
    background: OpenColor.gray[1],
  },
  'gray-2': {
    background: OpenColor.gray[2],
  },
  'gray-3': {
    background: OpenColor.gray[3],
  },
  'gray-4': {
    background: OpenColor.gray[4],
  },
  'gray-5': {
    background: OpenColor.gray[5],
  },
  'gray-6': {
    background: OpenColor.gray[6],
  },
  'gray-7': {
    background: OpenColor.gray[7],
  },
  'gray-8': {
    background: OpenColor.gray[8],
  },
  'gray-9': {
    background: OpenColor.gray[9],
  },
};

const blue = {
  'blue-0': {
    background: OpenColor.blue[0],
  },
  'blue-1': {
    background: OpenColor.blue[1],
  },
  'blue-2': {
    background: OpenColor.blue[2],
  },
  'blue-3': {
    background: OpenColor.blue[3],
  },
  'blue-4': {
    background: OpenColor.blue[4],
  },
  'blue-5': {
    background: OpenColor.blue[5],
  },
  'blue-6': {
    background: OpenColor.blue[6],
  },
  'blue-7': {
    background: OpenColor.blue[7],
  },
  'blue-8': {
    background: OpenColor.blue[8],
  },
  'blue-9': {
    background: OpenColor.blue[9],
  },
};

const yellow = {
  'yellow-0': {
    background: OpenColor.blue[0],
  },
  'yellow-1': {
    background: OpenColor.blue[1],
  },
  'yellow-2': {
    background: OpenColor.blue[2],
  },
  'yellow-3': {
    background: OpenColor.blue[3],
  },
  'yellow-4': {
    background: OpenColor.blue[4],
  },
  'yellow-5': {
    background: OpenColor.blue[5],
  },
  'yellow-6': {
    background: OpenColor.blue[6],
  },
  'yellow-7': {
    background: OpenColor.blue[7],
  },
  'yellow-8': {
    background: OpenColor.blue[8],
  },
  'yellow-9': {
    background: OpenColor.blue[9],
  },
};

const useFillColorStyles = createUseStyles({
  'theme-content': {
    background: 'var(--theme-content-color)',
  },
  'theme-panel': {
    background: 'var(--theme-panel-color)',
  },
  'theme-divider': {
    background: 'var(--theme-divider-color)',
  },
  'theme-button': {
    background: 'var(--theme-button-color)',
  },
  'transparent': {
    background: 'transparent'
  },
  'black': {
    background: OpenColor.black
  },
  'white': {
    background: OpenColor.white
  },
  ...gray,
  ...blue,
  ...yellow,
});

export default useFillColorStyles;
