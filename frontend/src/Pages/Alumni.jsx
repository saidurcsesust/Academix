import { useMemo, useState } from 'react'
import Card from '../Components/Card'
import PageHeader from '../Components/PageHeader'

export default function StudentAlumni({ alumni }) {
  const [yearFilter, setYearFilter] = useState('all')

  const yearOptions = useMemo(() => {
    const years = new Set()
    alumni.forEach((person) => years.add(String(person.gradYear)))
    return Array.from(years).sort((a, b) => Number(b) - Number(a))
  }, [alumni])

  const filteredAlumni = useMemo(() => {
    if (yearFilter === 'all') return alumni
    return alumni.filter((person) => String(person.gradYear) === yearFilter)
  }, [alumni, yearFilter])

  return (
    <section className="page alumni-page" id="alumni">
      <PageHeader
        title="Alumni Network"
        subtitle="Connect with alumni mentors."
        actions={(
          <div className="filter-row">
            <select
              className="filter-select"
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              aria-label="Filter by graduation year"
            >
              <option value="all">All Years</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}
      />

      <div className="alumni-grid">
        {filteredAlumni.map((person) => (
          <Card className="alumni-card" key={`${person.name}-${person.gradYear}`}>
            <div className="alumni-header">
              <div>
                <p className="alumni-name">{person.name}</p>
                <p className="alumni-meta">Batch of {person.gradYear}</p>
              </div>
              <span className="pill alumni-role">{person.currentRole}</span>
            </div>
            <div className="alumni-detail">
              <p>{person.organization},</p>
              <p>{person.location}</p>
            </div>

            <p className="alumni-contact">{person.email}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
