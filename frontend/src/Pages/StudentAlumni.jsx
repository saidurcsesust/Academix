import Card from '../Components/Card'
import PageHeader from '../Components/PageHeader'

export default function StudentAlumni({ alumni }) {
  return (
    <section className="page" id="alumni">
      <PageHeader
        title="Alumni Network"
        subtitle="Connect with alumni mentors and see where they are now."
        actions={(
          <div className="filter-row">
            <button className="filter-chip" type="button">All Years</button>
            <button className="filter-chip" type="button">2022</button>
            <button className="filter-chip" type="button">2021</button>
          </div>
        )}
      />

      <div className="alumni-grid">
        {alumni.map((person) => (
          <Card className="alumni-card" key={`${person.name}-${person.gradYear}`}>
            <div className="alumni-header">
              <div>
                <p className="alumni-name">{person.name}</p>
                <p className="alumni-meta">Class of {person.gradYear} • {person.major}</p>
              </div>
              <span className="pill subtle">{person.currentRole}</span>
            </div>
            <p className="alumni-detail">{person.organization}</p>
            <p className="alumni-detail">{person.location}</p>
            <p className="alumni-contact">{person.email}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
