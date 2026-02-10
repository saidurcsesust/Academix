import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'
import AdminUsers from './AdminUsers'

const directoryCards = [
  {
    title: 'Student List',
    description: 'Browse students by class, section, and roll.',
    href: '/admin/directory/students',
  },
  {
    title: 'Teacher List',
    description: 'Browse faculty by department and role.',
    href: '/admin/directory/teachers',
  },
]

export default function AdminDirectory({ apiBase = '/api' }) {
  return (
    <section className="page" id="admin-directory">
      <PageHeader title="User Directory" subtitle="Pick a directory to explore." />

      <div className="grid-2 admin-grid admin-directory-home">
        {directoryCards.map((card) => (
          <Card className="admin-panel admin-directory-panel" key={card.title}>
            <CardHeader>
              <div>
                <h2>{card.title}</h2>
                <p className="card-note">{card.description}</p>
              </div>
              <a className="text-link" href={card.href}>Open</a>
            </CardHeader>
          </Card>
        ))}
      </div>
      <AdminUsers apiBase={apiBase} embedded />
    </section>
  )
}
