import Tutorial, { type Page } from '../../components/tutorial/Tutorial';

import pages from './data';

const BuildALanguageTutorial = () => {
  return (
    <Tutorial pages={pages} />
  );
};

export default BuildALanguageTutorial;
