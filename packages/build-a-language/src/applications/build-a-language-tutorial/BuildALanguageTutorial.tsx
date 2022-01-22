import Tutorial, { type Page } from '../../components/tutorial/Tutorial';

import * as page1 from './data/page1';
import * as page2 from './data/page2';
import * as page3 from './data/page3';
import * as page4 from './data/page4';


const pages = [
  page1,
  page2,
  page3,
  page4,
];

const BuildALanguageTutorial = () => {
  return (
    <Tutorial pages={pages} />
  );
};

export default BuildALanguageTutorial;
