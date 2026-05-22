import { useRouteError, useNavigate } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas p-6 font-sans">
      <div className="bg-card border border-red-200 rounded-xl shadow-sm p-8 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-[20px] font-black text-text-primary mb-2">Unexpected Application Error!</h2>
        <p className="text-[13px] text-text-secondary mb-6 leading-relaxed">
          The application encountered an error while trying to render this page. Our team has been notified.
        </p>
        
        <div className="bg-red-50 border border-red-100 rounded text-left p-4 mb-6 overflow-x-auto">
          <p className="text-red-800 text-[11px] font-mono whitespace-pre-wrap">
            {error?.statusText || error?.message || 'Unknown Error'}
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-crimson text-white text-[12px] font-bold tracking-[0.05em] rounded hover:bg-crimson-dark transition-colors border-0 cursor-pointer"
          >
            RELOAD PAGE
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-transparent text-text-primary text-[12px] font-bold tracking-[0.05em] rounded border-[1.5px] border-border-dark hover:border-text-primary transition-all cursor-pointer"
          >
            GO HOME
          </button>
        </div>
      </div>
    </div>
  );
}
