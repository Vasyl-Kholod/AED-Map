import React from 'react';

import { useSearchNearestDevice } from '../../hooks';

import BaseButton from '../BaseButton/BaseButton';

export default function SearchNextNearestDefButton() {
  const {
    getNextNearestDefibrillator
  } = useSearchNearestDevice();

  return (
    <BaseButton
      onClick={getNextNearestDefibrillator}
      styles={{
        backgroundColor: 'orange',
        bottom: 125,
        marginRight: 6
      }}
    >
      Знайти наступний
    </BaseButton>
  );
}
