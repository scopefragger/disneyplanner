import { formatPrettyDate } from '../utils.js'

export default function MonorailLoader({ activeDay, date }) {
  return (
    <div className="monorail-overlay" role="status" aria-label={`Loading Day ${activeDay + 1}`}>
      <div className="monorail-scene" aria-hidden="true">
        <div className="monorail-train-wrap">
          <svg viewBox="0 0 220 62" width="220" height="62" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mono-body-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0057b8" />
                <stop offset="55%" stopColor="#003b78" />
                <stop offset="100%" stopColor="#002d5e" />
              </linearGradient>
            </defs>
            {/* Main body — rounded tail left, tapered nose right */}
            <path
              d="M 8,6 Q 5,6 5,14 L 5,38 Q 5,46 8,46 L 185,46 Q 210,46 215,26 Q 210,6 185,6 Z"
              fill="url(#mono-body-grad)"
            />
            {/* Top highlight stripe */}
            <path
              d="M 8,6 L 185,6 Q 200,6 208,16 L 8,16 Q 5,16 5,14 Q 5,6 8,6 Z"
              fill="#0057b8"
              opacity="0.55"
            />
            {/* Windows */}
            <rect x="16" y="14" width="26" height="20" rx="5" fill="#8ed8f8" opacity="0.9" />
            <rect x="50" y="14" width="26" height="20" rx="5" fill="#8ed8f8" opacity="0.9" />
            <rect x="84" y="14" width="26" height="20" rx="5" fill="#8ed8f8" opacity="0.9" />
            <rect x="118" y="14" width="26" height="20" rx="5" fill="#8ed8f8" opacity="0.9" />
            <rect x="152" y="14" width="18" height="20" rx="5" fill="#8ed8f8" opacity="0.7" />
            {/* White accent stripe */}
            <rect x="8" y="36" width="177" height="3" rx="1" fill="rgba(255,255,255,0.2)" />
            {/* Underbody skirt */}
            <rect x="18" y="46" width="160" height="5" rx="2" fill="#8a93a6" />
            {/* Centre pylon */}
            <rect x="97" y="51" width="22" height="6" rx="2" fill="#8a93a6" />
            {/* Pylon foot spreads onto beam */}
            <rect x="90" y="57" width="36" height="4" rx="2" fill="#7a8496" />
          </svg>
        </div>
        <div className="monorail-beam" />
      </div>
      <p className="monorail-label">
        <span className="monorail-label-day">Day {activeDay + 1}</span>
        {date && <span className="monorail-label-sub">{formatPrettyDate(date)}</span>}
      </p>
    </div>
  )
}
