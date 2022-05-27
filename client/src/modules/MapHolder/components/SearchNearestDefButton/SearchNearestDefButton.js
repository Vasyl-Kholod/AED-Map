import React from 'react';

import { useSearchNearestDevice } from 'modules/MapHolder/hooks';

import BaseButton from '../BaseButton/BaseButton.js';

export default function SearchNearestDefButton() {
  const { getNearestDefibrillators } = useSearchNearestDevice();

  return (
    <BaseButton onClick={getNearestDefibrillators}>
      Знайти пристрій
    </BaseButton>
  );
}


