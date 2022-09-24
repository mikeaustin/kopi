import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

function Icon() {
  return <FontAwesomeIcon icon="file" />;
}

export default Icon;
