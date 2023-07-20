import View, { type ViewProps } from '../view';
import classNames from 'classnames';

import styles from './Clickable.module.scss';

type ClickableProps = {
  children?: Exclude<React.ReactNode, React.ReactText>;
  className?: string;
  onClick?: React.MouseEventHandler;
} & ViewProps;

const Clickable = ({
  children,
  className,
  onClick,
  ...props
}: ClickableProps) => {
  const containerClassName = classNames(
    styles.container,
    className,
  );

  return (
    <View onClick={onClick} className={containerClassName} {...props}>
      {children}
    </View>
  );
};

export default Clickable;
