import { formatPrettyDate, pluralize } from '../utils.js'

export default function SetupSummary({
  plan, tripLength,
  setSetupDone, setCurrentStep, setPrefSearch,
  setSettingsOpen, setResetConfirm
}) {
  const handleEditSetup = () => {
    setSetupDone(false)
    setCurrentStep(1)
  }

  const handlePreferences = () => {
    setPrefSearch('')
    setSetupDone(false)
    setCurrentStep(6)
  }

  const handleSettings = () => {
    setSettingsOpen(true)
    setResetConfirm(false)
  }

  const currency = plan.currencySymbol || '£'

  return (
    <div className="setup-summary card card-wide">
      <div className="setup-summary-inner">
        <div className="setup-summary-info">
          <strong>{plan.tripName}</strong>
          <span>
            {formatPrettyDate(plan.startDate)} – {formatPrettyDate(plan.endDate)}
            {' · '}{pluralize(tripLength, 'day', 'days')}
          </span>
          <span>
            {pluralize(plan.adults, 'adult', 'adults')}
            {plan.children > 0 ? `, ${pluralize(plan.children, 'child', 'children')}` : ''}
            {' · '}{currency}{Number(plan.budget).toLocaleString()}
            {' · '}{plan.diningStyle}
          </span>
        </div>
        <div className="setup-summary-actions">
          <button className="chip" onClick={handleEditSetup}>Edit setup</button>
          <button className="chip" onClick={handlePreferences}>✦ My preferences</button>
          <button className="chip" onClick={handleSettings}>⚙ Settings</button>
        </div>
      </div>
    </div>
  )
}
