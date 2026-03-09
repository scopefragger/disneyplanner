import { normalizeEventItem } from '../data/planHelpers.js'
import { WDW_SUFFIX } from '../data/constants.js'

function buildMapUrl(plan, activeDate) {
  const dayPlan = plan.dayPlans?.[activeDate]
  const items = dayPlan?.items || []
  const stops = [
    dayPlan?.park,
    ...items.map(item => {
      const n = normalizeEventItem(item)
      return n.ride ? n.ride.split('::').pop() : (n.restaurant || n.note || null)
    })
  ].filter(Boolean).map(s => encodeURIComponent(s + WDW_SUFFIX))

  if (stops.length) {
    return `https://www.google.com/maps/dir/${stops.join('/')}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((dayPlan?.park || 'Walt Disney World') + WDW_SUFFIX)}`
}

export default function WhatsNext({ activeDay, activeDate, plan }) {
  return (
    <div className="whats-next-card card card-wide">
      <h3 className="whats-next-title">What's next</h3>
      <div className="whats-next-actions">
        <button
          type="button"
          className="whats-next-btn"
          onClick={() => window.open(buildMapUrl(plan, activeDate), '_blank', 'noopener')}
        >
          <span className="whats-next-btn-icon">🗺</span>
          <span>View Day {activeDay + 1} on map</span>
        </button>
      </div>
    </div>
  )
}
