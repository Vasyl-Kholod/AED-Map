import React from 'react';

import { useSearchNearestDevice } from "../../hooks"

import BaseButton from '../BaseButton/BaseButton.js';

export default function SearchNextNearestDefButton() {
  const { getNextNearestDefibrillator } = useSearchNearestDevice();

  return (
    <BaseButton onClick={getNextNearestDefibrillator} styles={{ backgroundColor: "orange", bottom: 125 }}>
      Знайти наступний
    </BaseButton>
  );
}
