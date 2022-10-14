import View from '../view/index.js';
import Spacer from '../spacer/index.js';

import Spacing from '../../types/Spacing.js';

import Color from '../../types/Color.js';

interface DividerProps extends React.ComponentProps<typeof View> {
  color?: Color | 'theme-divider',
  spacing?: Spacing,
}

const Divider = ({
  color = 'theme-divider',
  spacing,
  ...props
}: DividerProps) => {
  return (
    <>
      {spacing && <Spacer size={spacing} />}
      <View fillColor={color} style={{ minHeight: 1, minWidth: 1 }} {...props} />
      {spacing && <Spacer size={spacing} />}
    </>
  );
};

export default Divider;
