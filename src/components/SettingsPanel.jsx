export default function SettingsPanel({ setSettingsOpen, resetPlan, resetConfirm, setResetConfirm }) {
  return (
    <div className="settings-overlay" onClick={() => setSettingsOpen(false)}>
      <div className="settings-panel card" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Trip settings</h3>
          <button type="button" className="close-panel-btn" onClick={() => setSettingsOpen(false)}>✕</button>
        </div>
        <p className="settings-note">Your plan is saved automatically in your browser.</p>
        <hr className="settings-divider" />
        <div className="settings-section">
          <strong>Danger zone</strong>
          {resetConfirm ? (
            <div className="settings-confirm-row">
              <span>This will erase everything. Are you sure?</span>
              <button type="button" className="danger" onClick={() => { resetPlan(); setSettingsOpen(false) }}>Yes, reset</button>
              <button type="button" className="chip" onClick={() => setResetConfirm(false)}>Cancel</button>
            </div>
          ) : (
            <button type="button" className="danger" onClick={() => setResetConfirm(true)}>Reset planner</button>
          )}
        </div>
      </div>
    </div>
  )
}
