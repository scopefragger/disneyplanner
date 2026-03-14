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

  const contentClass = ghost ? 'ghost-event-content' : 'timeline-event-content'
  const contentStyle = ghost
    ? backgroundStyle
    : { ...backgroundStyle, transform: `translateX(${swipeX}px)` }

  if (ghost) {
    return (
      <div className="timeline-event">
        <div className={contentClass} data-theme={theme} style={backgroundStyle}>
          <div className="event-text">
            {eventType && <span className="event-type-badge">{eventType.toUpperCase()}</span>}
            {time && <span className="event-time">{formatTime(time)}</span>}
            <p>{label}</p>
            {description && <small className="event-description">{description}</small>}
            {tags?.length > 0 && (
              <div className="ghost-tags">
                {tags.map(tag => <span key={tag} className="ghost-tag">{tag}</span>)}
              </div>
            )}
            <div className="ghost-links">
              {infoUrl && (
                <a href={infoUrl} target="_blank" rel="noreferrer noopener"
                  className="ghost-link" title="About this show">ℹ Info</a>
              )}
              {mapUrl && (
                <a href={mapUrl} target="_blank" rel="noreferrer noopener"
                  className="ghost-link" title="View on map">📍 Map</a>
              )}
            </div>
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

  return (
    <div className="timeline-event">
      <div className="swipe-reveal-wrap">
        <div
          className={`${contentClass} swipe-content`}
          data-theme={theme}
          style={contentStyle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="event-text">
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
            <p>{label}</p>
            {description && <small className="event-description">{description}</small>}
            <div className="event-links">
              {hasRestaurantLinks && menuUrl && (
                <a href={menuUrl} target="_blank" rel="noreferrer noopener">View menu</a>
              )}
              {hasRestaurantLinks && bookingUrl && (
                <a href={bookingUrl} target="_blank" rel="noreferrer noopener">Book</a>
              )}
              {viewInfoUrl && (
                <a href={viewInfoUrl} target="_blank" rel="noreferrer noopener">View info</a>
              )}
              <a href={mapUrl} target="_blank" rel="noreferrer noopener">View on map</a>
            </div>
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
