import { useState, useCallback } from 'react';

export function useRender() {
  const [state, updateState] = useState(true);
  return { render: useCallback(() => updateState(!state), []) };
}
