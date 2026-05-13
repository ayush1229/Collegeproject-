import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllocationState } from '../hooks/useAllocationState';
import LoadingScreen from '../components/shared/LoadingScreen';
import ErrorState from '../components/shared/ErrorState';
import { ROUTES } from '../constants/routes';
import AllocationLayout from '../layouts/AllocationLayout';

function resolveRoute(state) {
  if (state.isPenalized)     return ROUTES.PENALTY;
  if (state.isAllocated)     return ROUTES.RESULTS;
  if (state.submitted)       return ROUTES.LOCKED;
  if (state.batchActive)     return ROUTES.LIVE;
  if (state.waitingForBatch) return ROUTES.WAITING_ROOM;
  if (state.hasSquad)        return ROUTES.SQUAD;
  return ROUTES.SQUAD_SOLO;
}

/** Dev helper — links to every page for testing */
const DEV_LINKS = [
  { label: 'Squad Lobby (with group)',  to: ROUTES.SQUAD        },
  { label: 'Squad Lobby (solo)',        to: ROUTES.SQUAD_SOLO   },
  { label: 'Waiting Room',             to: ROUTES.WAITING_ROOM },
  { label: 'Live Selection',           to: ROUTES.LIVE         },
  { label: 'Selection Locked',         to: ROUTES.LOCKED       },
  { label: 'Allocation Results',       to: ROUTES.RESULTS      },
  { label: 'Penalty Page',             to: ROUTES.PENALTY      },
  { label: 'Allocation History',       to: ROUTES.HISTORY      },
];

export default function AllocationGatewayPage() {
  const { state, loading, error } = useAllocationState();
  const navigate = useNavigate();

  // Auto-redirect removed for dev mode
  // useEffect(() => {
  //   if (!loading && !error && state) {
  //     const target = resolveRoute(state);
  //     const t = setTimeout(() => navigate(target, { replace: true }), 1800);
  //     return () => clearTimeout(t);
  //   }
  // }, [state, loading, error, navigate]);

  if (loading) return <LoadingScreen label="Checking your allocation status…" />;

  if (error) {
    return (
      <AllocationLayout>
        <ErrorState title="Could not load allocation state" message={error.message} onRetry={() => window.location.reload()} />
      </AllocationLayout>
    );
  }

  return (
    <AllocationLayout>
      <div className="max-w-xl mx-auto pt-10 flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-bold tracking-[0.1em] text-crimson">ALLOCATION GATEWAY</p>
          <h1 className="text-[22px] font-black text-text-primary tracking-tight">Routing you to the right page…</h1>
          <p className="text-[13px] text-text-secondary">
            Detected state: <strong>{resolveRoute(state)}</strong>
          </p>
        </div>

        {/* Dev nav */}
        <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-amber-50">
            <p className="text-[10.5px] font-bold tracking-[0.1em] text-amber-700">DEV MODE — JUMP TO PAGE</p>
          </div>
          {DEV_LINKS.map(({ label, to }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-canvas text-left transition-colors cursor-pointer border-0 bg-transparent"
            >
              <span className="text-[13px] font-medium text-text-primary">{label}</span>
              <span className="text-[11px] text-text-muted font-mono">{to}</span>
            </button>
          ))}
        </div>
      </div>
    </AllocationLayout>
  );
}
