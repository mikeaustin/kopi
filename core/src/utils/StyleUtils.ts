import jss, { Styles as JSSStyles, StyleSheet as JSSStyleSheet } from 'jss';

class StyleSheet {
  static create<Name extends string | number | symbol>(
    styles: JSSStyles<Name, any, undefined>
  ): JSSStyleSheet['classes'] {
    return jss.createStyleSheet(styles).attach().classes;
  }
}

export {
  StyleSheet
};
