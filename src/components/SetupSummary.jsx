import { formatPrettyDate } from '../utils.js'

export default function SetupSummary({
  plan, tripLength,
  setSetupDone, setCurrentStep, setPrefSearch,
  setSettingsOpen, setResetConfirm
}) {
  return (
    <div className="setup-summary card card-wide">
      <div className="setup-summary-inner">
        <div className="setup-summary-info">
          <strong>{plan.tripName}</strong>
          <span>{formatPrettyDate(plan.startDate)} – {formatPrettyDate(plan.endDate)} · {tripLength} day{tripLength !== 1 ? 's' : ''}</span>
          <span>{plan.adults} adult{plan.adults !== 1 ? 's' : ''}{plan.children > 0 ? `, ${plan.children} child${plan.children !== 1 ? 'ren' : ''}` : ''} · £{Number(plan.budget).toLocaleString()} · {plan.diningStyle}</span>
        </div>
        <div className="setup-summary-actions">
          <button className="chip" onClick={() => { setSetupDone(false); setCurrentStep(1) }}>Edit setup</button>
          <button className="chip" onClick={() => { setPrefSearch(''); setSetupDone(false); setCurrentStep(6) }}>✦ My preferences</button>
          <button className="chip" onClick={() => { setSettingsOpen(true); setResetConfirm(false) }}>⚙ Settings</button>
        </div>
      </div>
    </div>
  )
}
