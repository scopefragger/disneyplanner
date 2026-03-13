import { formatTime } from '../utils.js'

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
  const contentClass = ghost ? 'ghost-event-content' : 'timeline-event-content'

  return (
    <div className="timeline-event">
      <div className={contentClass} data-theme={theme} style={backgroundStyle}>
        <div className="event-text">
          {eventType && <span className="event-type-badge">{eventType.toUpperCase()}</span>}
          {time && <span className="event-time">{formatTime(time)}</span>}
          <p>{label}</p>
          {description && <small className="event-description">{description}</small>}

          {ghost ? (
            <>
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
            </>
          ) : (
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
          )}
        </div>

        {ghost ? (
          <div className="ghost-actions">
            <button type="button" className="ghost-accept-btn"
              title="Add to my plan" aria-label="Add to my plan"
              onClick={onAccept}>✓</button>
            <button type="button" className="ghost-dismiss-btn"
              title="Not for me" aria-label="Not for me"
              onClick={onDismiss}>✕</button>
          </div>
        ) : (
          <>
            <button type="button" className="event-edit-btn"
              title="Edit" aria-label="Edit event"
              onClick={onEdit}>✏</button>
            <button type="button" className="event-delete-btn"
              aria-label="Delete event"
              onClick={onDelete}>×</button>
          </>
        )}
      </div>
    </div>
  )
}
