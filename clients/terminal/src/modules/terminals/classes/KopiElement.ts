import React from 'react';

import { KopiValue } from '../../shared';

class KopiElement extends KopiValue {
  element: React.ReactNode;

  constructor(element: React.ReactNode) {
    super();

    this.element = element;
  }
}

export default KopiElement;
