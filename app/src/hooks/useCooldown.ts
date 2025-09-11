import { useState } from 'react';
export function useCooldown(ms: number) {
  const [ready, setReady] = useState(true);
  const trigger = () => {
    setReady(false);
    setTimeout(() => setReady(true), ms);
  };
  return { ready, trigger };
}
