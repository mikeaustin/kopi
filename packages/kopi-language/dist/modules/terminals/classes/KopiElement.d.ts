import React from 'react';
import { KopiValue } from '../../shared.js';
declare class KopiElement extends KopiValue {
    element: React.ReactNode;
    constructor(element: React.ReactNode);
}
export default KopiElement;
