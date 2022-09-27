import View from '../view/index.js';
import Spacer from '../spacer/index.js';

interface DividerProps extends React.ComponentProps<typeof View> {
  spacing?: 'small',
}

const Divider = ({
  spacing,
  ...props
}: DividerProps) => {
  return (
    <>
      {spacing && <Spacer size={spacing} />}
      <View fillColor="gray-5" style={{ minHeight: 1, minWidth: 1 }} {...props} />
      {spacing && <Spacer size={spacing} />}
    </>
  );
};

export default Divider;
