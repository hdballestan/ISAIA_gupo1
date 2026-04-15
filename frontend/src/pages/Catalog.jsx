import { useEffect, useState } from 'react'
import { getCertificates } from '../services/api'
import CertificateList from '../components/CertificateList'

function Catalog() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCatalog()
  }, [])

  const fetchCatalog = async () => {
    try {
      setLoading(true)
      const data = await getCertificates()
      setCertificates(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="page-catalog"><p>Cargando...</p></div>
  if (error) return <div className="page-catalog"><p>Error: {error}</p></div>

  return (
    <div className="page-catalog">
      <h2>Catálogo de Certificados</h2>
      <p>Explora todos los certificados disponibles.</p>
      <CertificateList certificates={certificates} />
    </div>
  )
}

export default Catalog
