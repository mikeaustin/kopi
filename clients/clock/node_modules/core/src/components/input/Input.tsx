import useStyles from './styles.js';

import View from '../view/index.js';
import Text from '../text/index.js';
import Spacer from '../spacer/index.js';

interface InputProps extends React.ComponentProps<typeof View> {
  label?: string,
}

function Input({
  label,
}: InputProps) {
  const styles = useStyles();

  if (label) {
    return (
      <View>
        <Text light fontWeight="medium" fontSize="xsmall">{label.toLocaleUpperCase()}</Text>
        <Spacer size="xsmall" />
        <View border fillColor="white" className={styles.Input}>
          <input />
        </View>
      </View>
    );
  }

  return (
    <View border fillColor="white" className={styles.Input}>
      <input />
    </View>
  );
}

export default Input;
