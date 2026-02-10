import { useEffect, useMemo, useRef, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

function resolveRoleFromRoute(route) {
  if (route?.startsWith('/admin')) return 'admin'
  if (route?.startsWith('/teacher')) return 'teacher'
  return 'student'
}

export default function ChatSection({ apiBase = '/api', currentRoute, userProfile }) {
  const role = useMemo(() => resolveRoleFromRoute(currentRoute), [currentRoute])
  const [rooms, setRooms] = useState([])
  const [activeRoomId, setActiveRoomId] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState('')
  const lastMessageIdRef = useRef(null)

  const principalId = userProfile?.id
  const activeRoom = rooms.find((room) => room.id === activeRoomId) || null

  const mergeMessages = (previous, incoming) => {
    if (!incoming.length) return previous
    const seen = new Set(previous.map((item) => item.id))
    const appended = incoming.filter((item) => !seen.has(item.id))
    return appended.length ? [...previous, ...appended] : previous
  }

  useEffect(() => {
    if (!principalId) {
      setRooms([])
      setActiveRoomId(null)
      setError('Profile ID is missing for this account.')
      return
    }

    const queryKey = role === 'admin' ? 'admin' : role === 'teacher' ? 'teacher' : 'student'

    setLoadingRooms(true)
    setError('')

    fetch(`${apiBase}/chat-rooms/?${queryKey}=${principalId}`)
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setRooms(list)
        setActiveRoomId((prev) => {
          if (prev && list.some((item) => item.id === prev)) return prev
          return list.length ? list[0].id : null
        })
      })
      .catch(() => setError('Failed to load chat rooms.'))
      .finally(() => setLoadingRooms(false))
  }, [apiBase, principalId, role])

  useEffect(() => {
    if (!activeRoomId) {
      setMessages([])
      lastMessageIdRef.current = null
      return
    }

    setLoadingMessages(true)
    setError('')

    fetch(`${apiBase}/chat-messages/?room=${activeRoomId}`)
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setMessages(list)
        lastMessageIdRef.current = list.length ? list[list.length - 1].id : null
      })
      .catch(() => setError('Failed to load messages.'))
      .finally(() => setLoadingMessages(false))
  }, [apiBase, activeRoomId])

  useEffect(() => {
    if (!activeRoomId) return undefined

    const interval = window.setInterval(() => {
      const afterId = lastMessageIdRef.current || ''
      const url = afterId
        ? `${apiBase}/chat-messages/?room=${activeRoomId}&after_id=${afterId}`
        : `${apiBase}/chat-messages/?room=${activeRoomId}`

      fetch(url)
        .then((response) => (response.ok ? response.json() : []))
        .then((data) => {
          const incoming = Array.isArray(data) ? data : []
          if (!incoming.length) return
          setMessages((prev) => {
            const merged = mergeMessages(prev, incoming)
            lastMessageIdRef.current = merged.length ? merged[merged.length - 1].id : null
            return merged
          })
        })
        .catch(() => {})
    }, 2000)

    return () => window.clearInterval(interval)
  }, [apiBase, activeRoomId])

  const sendMessage = async (event) => {
    event.preventDefault()

    const content = draft.trim()
    if ((!content && selectedFiles.length === 0) || !activeRoomId || !principalId) return

    const payload = new FormData()
    payload.append('room', String(activeRoomId))
    payload.append('content', content)
    payload.append('sender_role', role)
    if (role === 'student') payload.append('sender_student', String(principalId))
    if (role === 'teacher') payload.append('sender_teacher', String(principalId))
    if (role === 'admin') payload.append('sender_admin', String(principalId))
    selectedFiles.forEach((file) => payload.append('attachments', file))

    try {
      const response = await fetch(`${apiBase}/chat-messages/`, {
        method: 'POST',
        body: payload,
      })

      if (!response.ok) {
        setError('Unable to send message.')
        return
      }

      const created = await response.json()
      setMessages((prev) => {
        const merged = mergeMessages(prev, [created])
        lastMessageIdRef.current = merged.length ? merged[merged.length - 1].id : null
        return merged
      })
      setDraft('')
      setSelectedFiles([])
    } catch {
      setError('Unable to send message.')
    }
  }

  return (
    <section className="page" id="chat-section">
      <PageHeader
        title="Chat"
        subtitle="Class-subject rooms with teacher moderation and admin oversight."
      />

      {error ? <p className="empty-state">{error}</p> : null}

      <div className="grid-2">
        <Card>
          <CardHeader>
            <h2>Rooms</h2>
          </CardHeader>
          {loadingRooms ? <p className="empty-state">Loading rooms...</p> : null}
          {!loadingRooms && rooms.length === 0 ? <p className="empty-state">No chat rooms found.</p> : null}
          <div className="chat-room-list">
            {rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                className={`chat-room-item${room.id === activeRoomId ? ' active' : ''}`}
                onClick={() => setActiveRoomId(room.id)}
              >
                <p className="chat-room-name">{room.name}</p>
                <p className="chat-room-code">ID: {room.room_code}</p>
                <p className="chat-room-meta">{room.member_count || 0} members</p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <h2>{activeRoom ? activeRoom.name : 'Messages'}</h2>
          </CardHeader>
          {activeRoom ? <p className="chat-room-code chat-room-code-header">Chat ID: {activeRoom.room_code}</p> : null}

          {!activeRoomId ? <p className="empty-state">Select a room to view messages.</p> : null}
          {activeRoomId && loadingMessages ? <p className="empty-state">Loading messages...</p> : null}

          {activeRoomId ? (
            <>
              <div className="chat-message-list">
                {messages.length === 0 ? <p className="empty-state">No messages yet.</p> : null}
                {messages.map((message) => (
                  <div className="chat-message" key={message.id}>
                    <p className="chat-message-meta">
                      <strong>{message.sender_name || message.sender_role}</strong>
                      {' '}
                      <span>({message.sender_role})</span>
                    </p>
                    <p className="chat-message-content">{message.content}</p>
                    {Array.isArray(message.attachments) && message.attachments.length > 0 ? (
                      <div className="chat-attachments">
                        {message.attachments.map((attachment) => (
                          attachment.is_image ? (
                            <a
                              key={attachment.id}
                              href={attachment.file_url || attachment.file}
                              target="_blank"
                              rel="noreferrer"
                              className="chat-attachment-image-link"
                            >
                              <img
                                src={attachment.file_url || attachment.file}
                                alt={attachment.original_name || 'attachment'}
                                className="chat-attachment-image"
                              />
                            </a>
                          ) : (
                            <a
                              key={attachment.id}
                              href={attachment.file_url || attachment.file}
                              target="_blank"
                              rel="noreferrer"
                              className="chat-attachment-file"
                            >
                              {attachment.original_name || 'Download file'}
                            </a>
                          )
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <form className="chat-form" onSubmit={sendMessage}>
                <div className="chat-form-fields">
                  <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type a message..."
                  />
                  <input
                    type="file"
                    multiple
                    onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
                  />
                  {selectedFiles.length > 0 ? (
                    <p className="chat-file-note">{selectedFiles.length} file(s) selected</p>
                  ) : null}
                </div>
                <button type="submit" className="primary">Send</button>
              </form>
            </>
          ) : null}
        </Card>
      </div>
    </section>
  )
}
