import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCertificateById } from '../services/api'

function CertificateDetail() {
  const { id } = useParams()
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCertificate()
  }, [id])

  const fetchCertificate = async () => {
    try {
      setLoading(true)
      const data = await getCertificateById(id)
      setCertificate(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="page-detail"><p>Cargando...</p></div>
  if (error) return <div className="page-detail"><p>Error: {error}</p></div>
  if (!certificate) return <div className="page-detail"><p>No encontrado.</p></div>

  return (
    <div className="page-detail">
      <h2>{certificate.name}</h2>
      <p><strong>Emisor:</strong> {certificate.issuer}</p>
      <a href={certificate.portal_url} target="_blank" rel="noopener noreferrer"
         className="btn btn-primary">
        Ir al portal oficial
      </a>
    </div>
  )
}

export default CertificateDetail
