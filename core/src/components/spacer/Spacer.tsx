import View from '../view/index.js';

interface SpacerProps extends React.ComponentProps<typeof View> {
  size?: 'small',
}

const Spacer = ({
  size,
  ...props
}: SpacerProps) => {
  return (
    <View style={{ minHeight: 8, minWidth: 8 }} {...props} />
  );
};

export default Spacer;
