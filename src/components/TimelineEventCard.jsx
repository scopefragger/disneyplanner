import { useRef, useState } from 'react'
import { formatTime } from '../utils.js'

const SWIPE_OPEN_PX = -64
const SWIPE_SNAP_THRESHOLD = 40

/**
 * Unified card for both confirmed events and ghost suggestions in the day timeline.
 *
 * Real event props:  theme, time, label, description, eventType, backgroundStyle,
 *                    menuUrl, bookingUrl, viewInfoUrl, mapUrl, hasRestaurantLinks,
 *                    onEdit, onDelete
 *
 * Ghost / suggestion props: ghost=true, theme, time, label, description, eventType,
 *                            tags, infoUrl, mapUrl,
 *                            onAccept, onDismiss
 */
export default function TimelineEventCard({
  theme,
  time,
  label,
  description,
  eventType,
  ghost = false,
  // Real event
  backgroundStyle,
  menuUrl,
  bookingUrl,
  viewInfoUrl,
  mapUrl,
  hasRestaurantLinks,
  onEdit,
  onDelete,
  // Ghost / suggestion
  tags,
  infoUrl,
  onAccept,
  onDismiss,
}) {
  const [swipeX, setSwipeX] = useState(0)
  const touchStartX = useRef(null)

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return
    const dx = Math.max(SWIPE_OPEN_PX, Math.min(0, e.touches[0].clientX - touchStartX.current))
    setSwipeX(dx)
  }

  const handleTouchEnd = () => {
    setSwipeX(swipeX < -SWIPE_SNAP_THRESHOLD ? SWIPE_OPEN_PX : 0)
    touchStartX.current = null
  }

  const closeSwipe = () => setSwipeX(0)

  if (ghost) {
    return (
      <div className="timeline-event">
        <div className="ghost-event-content" data-theme={theme}>
          <div className="event-text">
            <div className="event-text-meta">
              {eventType && <span className="event-type-badge">{eventType.toUpperCase()}</span>}
              {time && <span className="event-time">{formatTime(time)}</span>}
            </div>
            <p>{label}</p>
          </div>
          <div className="ghost-actions">
            <button type="button" className="ghost-accept-btn"
              title="Add to my plan" aria-label="Add to my plan"
              onClick={onAccept}>✓</button>
            <button type="button" className="ghost-dismiss-btn"
              title="Not for me" aria-label="Not for me"
              onClick={onDismiss}>✕</button>
          </div>
        </div>
      </div>
    )
  }

  const contentStyle = { ...backgroundStyle, transform: `translateX(${swipeX}px)` }

  return (
    <div className="timeline-event">
      <div className="swipe-reveal-wrap">
        <div
          className="timeline-event-content swipe-content"
          data-theme={theme}
          style={contentStyle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="event-text">
            <div className="event-text-meta">
              {eventType && <span className="event-type-badge">{eventType.toUpperCase()}</span>}
              {time && (
                <button
                  type="button"
                  className="event-time-btn"
                  onClick={() => { closeSwipe(); onEdit() }}
                  aria-label={`Edit event at ${formatTime(time)}`}
                >
                  {formatTime(time)}
                </button>
              )}
            </div>
            <p>{label}</p>
          </div>
        </div>
        <button
          type="button"
          className="event-delete-btn"
          aria-label="Delete event"
          onClick={onDelete}
        >×</button>
      </div>
    </div>
  )
}
