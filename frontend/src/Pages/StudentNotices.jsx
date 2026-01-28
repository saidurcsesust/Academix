import Card from '../Components/Card'
import PageHeader from '../Components/PageHeader'

export default function StudentNotices({ notices }) {
  return (
    <section className="page" id="notices">
      <PageHeader
        title="Notices"
        subtitle="Search and filter important announcements."
        actions={(
          <div className="filter-row">
            <button className="filter-chip" type="button">Search notice...</button>
            <button className="filter-chip" type="button">General</button>
            <button className="filter-chip" type="button">Jan 2026</button>
          </div>
        )}
      />

      <Card className="notice-board">
        {notices.map((notice) => (
          <div className="notice-row" key={`full-${notice.title}`}>
            <div>
              <p className="notice-title">{notice.title}</p>
              <p className="notice-date">{notice.date}</p>
              <p className="notice-preview">{notice.preview}</p>
            </div>
            <button className="secondary" type="button">Read More</button>
          </div>
        ))}
      </Card>
      <Card className="notice-detail">
        <h2>Notice Details</h2>
        <p className="notice-title">Science Fair Registration</p>
        <p className="notice-date">24 Jan 2026 • Category: General</p>
        <p className="notice-preview">
          Students participating in the science fair should form teams of 2-3 members.
          Submit your project title, mentor name, and required lab materials.
        </p>
        <p className="attachment">Attachments: ScienceFairGuidelines.pdf</p>
      </Card>
    </section>
  )
}
