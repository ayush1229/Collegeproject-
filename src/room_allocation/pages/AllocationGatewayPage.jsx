import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllocationState } from '../hooks/useAllocationState';
import LoadingScreen from '../components/shared/LoadingScreen';
import ErrorState from '../components/shared/ErrorState';
import { ROUTES } from '../constants/routes';
import AllocationLayout from '../layouts/AllocationLayout';
import PreLobbyPage from './PreLobbyPage';

function resolveRoute(state) {
  if (!state)                                       return null;
  if (state.isPenalized)                            return ROUTES.PENALTY;
  if (state.groupStatus === 'SHATTERED')            return ROUTES.SHATTERED;
  if (state.isAllocated)                            return ROUTES.RESULTS;
  if (state.submitted)                              return ROUTES.LOCKED;
  if (state.batchActive)                            return ROUTES.LIVE;
  if (state.waitingForBatch)                        return ROUTES.WAITING_ROOM;
  if (state.hasSquad)                               return ROUTES.SQUAD;
  return ROUTES.SQUAD_SOLO;
}

export default function AllocationGatewayPage() {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [targetRoute, setTargetRoute] = useState(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const studentId = user ? user.id : null;

  const { state, loading, error } = useAllocationState(studentId);

  useEffect(() => {
    if (!loading && !error && state) {
      const phase = state.phase;

      // Pre-lobby phases — don't redirect, show PreLobbyPage
      if (phase === 'ADMIN_MODE') return;
      if (phase === 'FINAL_SWEEP' && !state.isAllocated) return;

      const target = resolveRoute(state);
      if (!target) return;

      // Brief animation then redirect
      setTargetRoute(target);
      setRedirecting(true);
      const t = setTimeout(() => navigate(target, { replace: true }), 1500);
      return () => clearTimeout(t);
    }
  }, [state, loading, error, navigate]);

  if (!studentId) {
    return (
      <AllocationLayout>
        <ErrorState
          title="Authentication Required"
          message="No active student session found. Please login first."
          onRetry={() => navigate('/')}
        />
      </AllocationLayout>
    );
  }

  if (loading) return <LoadingScreen label="Checking your allocation status…" />;

  if (error) {
    return (
      <AllocationLayout>
        <ErrorState
          title="Could not load allocation state"
          message={error.message}
          onRetry={() => window.location.reload()}
        />
      </AllocationLayout>
    );
  }

  // Pre-lobby: allocation not yet scheduled
  if (state && state.phase === 'ADMIN_MODE') {
    return (
      <PreLobbyPage
        allocationDate={state.allocationDate}
        lobbyOpensAt={state.lobbyOpensAt}
      />
    );
  }

  // Redirecting animation
  if (redirecting && targetRoute) {
    return (
      <AllocationLayout>
        <div className="max-w-xl mx-auto pt-20 flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-crimson animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-[11px] font-bold tracking-[0.1em] text-crimson">ALLOCATION GATEWAY</p>
            <h1 className="text-[20px] font-black text-text-primary tracking-tight mt-1">
              Routing you to the right page…
            </h1>
            <p className="text-[13px] text-text-secondary mt-1">
              Taking you to <strong>{targetRoute}</strong>
            </p>
          </div>
        </div>
      </AllocationLayout>
    );
  }

  // Fallback (should not normally be reached)
  return <LoadingScreen label="Setting up your allocation portal…" />;
}
