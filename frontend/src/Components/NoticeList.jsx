export default function NoticeList({ notices }) {
  return (
    <div className="notice-list">
      {notices.map((notice) => (
        <div className="notice-item" key={notice.title}>
          <div>
            <p className="notice-title">{notice.title}</p>
            <p className="notice-date">{notice.date}</p>
            <p className="notice-preview">{notice.preview}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
