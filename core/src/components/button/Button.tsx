import useStyles from './styles.js';

import View from '../view/index.js';
import Text from '../text/index.js';

interface ButtonProps extends React.ComponentProps<typeof View> {
  title?: string,
}

const Button = ({
  title,
  ...props
}: ButtonProps) => {
  const styles = useStyles();

  return (
    <View fillColor="blue-5" className={styles.Button} {...props}>
      <Text>{title}</Text>
    </View>
  );
};

export default Button;
