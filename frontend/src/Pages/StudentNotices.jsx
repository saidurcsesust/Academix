import { useState } from 'react'
import Card from '../Components/Card'
import PageHeader from '../Components/PageHeader'

export default function StudentNotices({ notices }) {
  const [activeNotice, setActiveNotice] = useState(null)

  return (
    <section className="page" id="notices">
      <PageHeader
        title="Notices"
        subtitle="Search and filter important announcements."
        actions={(
          <div className="filter-row">
            <input
              className="filter-input"
              type="search"
              placeholder="Search notice..."
              aria-label="Search notice"
            />
            <select className="filter-select" aria-label="Filter by category" defaultValue="General">
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Holiday">Holiday</option>
              <option value="Fee">Fee</option>
              <option value="Event">Event</option>
            </select>
          </div>
        )}
      />

      <Card className="notice-board">
        {notices.map((notice) => (
          <div className="notice-row" key={`full-${notice.title}`}>
            <div>
              <p className="notice-title">{notice.title}</p>
              <p className="notice-date">
                {notice.date}
                <span className={`notice-category ${notice.category.toLowerCase()}`}>
                  {notice.category}
                </span>
              </p>
              <p className="notice-preview">{notice.preview}</p>
            </div>
            <button className="secondary" type="button" onClick={() => setActiveNotice(notice)}>
              Read More
            </button>
          </div>
        ))}
      </Card>

      {activeNotice && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>{activeNotice.title}</h2>
                <p className="notice-date modal-date">
                  {activeNotice.date}
                  <span className={`notice-category ${activeNotice.category.toLowerCase()}`}>
                    {activeNotice.category}
                  </span>
                </p>
              </div>
              <button
                className="icon-button close-button"
                type="button"
                aria-label="Close notice details"
                onClick={() => setActiveNotice(null)}
              >
                X
              </button>
            </div>
            <p className="notice-preview">{activeNotice.body}</p>
            {activeNotice.attachments && activeNotice.attachments.length > 0 ? (
              <div className="attachment-list">
                <p className="attachment">Attachments</p>
                <ul>
                  {activeNotice.attachments.map((file) => (
                    <li key={file}>
                      <a className="text-link" href={`/assets/${file}`}>{file}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="attachment">Attachments: None</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
