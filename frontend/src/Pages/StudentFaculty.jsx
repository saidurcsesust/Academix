import Card from '../Components/Card'
import PageHeader from '../Components/PageHeader'

export default function StudentFaculty({ faculty }) {
  return (
    <section className="page" id="faculty">
      <PageHeader
        title="Faculty Directory"
        subtitle="Reach out to teachers and check their office hours."
        actions={(
          <div className="filter-row">
            <button className="filter-chip" type="button">All Departments</button>
            <button className="filter-chip" type="button">Science</button>
            <button className="filter-chip" type="button">Math</button>
          </div>
        )}
      />

      <div className="faculty-grid">
        {faculty.map((member) => (
          <Card className="faculty-card" key={`${member.name}-${member.department}`}>
            <div className="faculty-photo-wrap">
              <img className="faculty-photo" src={member.photo} alt={member.name} />
            </div>
            <div className="faculty-body">
              <p className="faculty-name">{member.name}</p>
              <p className="faculty-meta">{member.role} • {member.department}</p>
              <p className="faculty-detail">{member.education}</p>
              <div className="faculty-contacts">
                <p className="faculty-contact">{member.email}</p>
                <p className="faculty-contact">{member.phone}</p>
              </div>
              <p className="faculty-office">{member.office}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
