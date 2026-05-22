import AllocationLayout from '../layouts/AllocationLayout';

export default function PreferencesPage() {
  return (
    <AllocationLayout phase="Selection Phase" batch="Preferences">
      <div className="max-w-4xl mx-auto flex flex-col gap-5 pt-4">
        <div className="bg-card border border-border rounded-xl shadow-sm px-8 py-16 flex flex-col items-center text-center gap-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
            <path d="M4 6h16M4 12h16M4 18h7"/>
          </svg>
          <div>
            <h1 className="text-[20px] font-black text-text-primary mb-2">Preference List Builder</h1>
            <p className="text-[13px] text-text-secondary leading-relaxed max-w-md mx-auto">
              This feature allows groups to pre-configure their room preferences before their batch begins. Only the group leader can edit preferences prior to the batch start. Once the batch starts, any group member can manage and submit preferences.
            </p>
          </div>
        </div>
      </div>
    </AllocationLayout>
  );
}
