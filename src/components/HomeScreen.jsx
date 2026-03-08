import { getDateRange, formatPrettyDate } from '../utils.js'

export default function HomeScreen({ projects, openProject, deleteProject, createProject }) {
  return (
    <>
      <header className="hero">
        <p className="eyebrow">Disney World Holiday Planner</p>
        <h1>My Holidays</h1>
        <p className="subtitle">Plan and manage all your Disney World adventures.</p>
      </header>

      <main className="home-grid">
        {Object.keys(projects).length > 0 && (
          <section className="card card-wide">
            <h2 className="home-section-title">Your holidays</h2>
            <div className="project-list">
              {Object.values(projects)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map(project => {
                  const p = project.plan
                  const len = getDateRange(p.startDate, p.endDate).length
                  return (
                    <div key={project.id} className="project-row" onClick={() => openProject(project.id)}>
                      <div className="project-row-info">
                        <strong>{p.tripName || 'Untitled Holiday'}</strong>
                        <span>
                          {p.startDate
                            ? `${formatPrettyDate(p.startDate)} – ${formatPrettyDate(p.endDate)} · ${len} day${len !== 1 ? 's' : ''}`
                            : 'Dates not set'}
                          {p.myHotel ? ` · ${p.myHotel}` : ''}
                        </span>
                      </div>
                      <button
                        className="chip"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm('Delete this holiday?')) deleteProject(project.id)
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )
                })}
            </div>
          </section>
        )}

        <button className="new-project-btn" onClick={createProject}>
          + New holiday
        </button>

        {Object.keys(projects).length === 0 && (
          <p className="home-empty">No holidays yet. Start planning your first Disney trip!</p>
        )}
      </main>
    </>
  )
}
