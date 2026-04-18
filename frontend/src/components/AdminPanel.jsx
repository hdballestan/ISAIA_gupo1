import { useState, useEffect } from 'react'

function AdminPanel() {
  const [certificates, setCertificates] = useState([])
  const [tickets, setTickets] = useState([])
  const [activeTab, setActiveTab] = useState('certificates')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage('No autorizado. Accede primero.')
        return
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }

      const [certsRes, ticketsRes] = await Promise.all([
        fetch('/api/v1/certificates', { headers }),
        fetch('/api/v1/admin/tickets', { headers }),
      ])

      if (certsRes.ok) setCertificates(await certsRes.json())
      if (ticketsRes.ok) setTickets(await ticketsRes.json())
    } catch (err) {
      setMessage(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCert = async (id) => {
    if (!confirm('¿Eliminar este certificado?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/v1/admin/certificates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) {
        setCertificates(certificates.filter((c) => c.id !== id))
        setMessage('Certificado eliminado.')
      }
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin__tabs">
        <button
          className={`admin__tab ${activeTab === 'certificates' ? 'admin__tab--active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          Certificados ({certificates.length})
        </button>
        <button
          className={`admin__tab ${activeTab === 'tickets' ? 'admin__tab--active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          Solicitudes ({tickets.length})
        </button>
      </div>

      {message && (
        <div className="admin__message">{message}</div>
      )}

      {activeTab === 'certificates' && (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Emisor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id}>
                  <td>{cert.name}</td>
                  <td>{cert.issuer}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteCert(cert.id)}
                      className="btn btn-secondary btn--sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.description.substring(0, 50)}...</td>
                  <td>{ticket.status}</td>
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPanel

