import { useState, useEffect } from 'react';
import { getAllocationState } from '../api/allocation.api';

const MOCK_STATE = {
  phase: 'LOBBY',
  hasSquad: true,
  isLeader: true,
  batchActive: false,
  isAllocated: false,
  isPenalized: false,
  waitingForBatch: false,
  submitted: false,
};

export function useAllocationState() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]  = useState(null);

  useEffect(() => {
    getAllocationState()
      .then(setState)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { state: state ?? MOCK_STATE, loading, error };
}
