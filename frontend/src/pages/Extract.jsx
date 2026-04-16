import { useState, useEffect } from 'react'
import DocumentUploader from '../components/DocumentUploader'
import CertificateTable from '../components/CertificateTable'
import { getCertificates } from '../services/api'
import { checkCatalogHealth } from '../services/health'

function ExtractSummary({ extracted, count }) {
  if (!extracted) return null
  if (count > 0) {
    return (
      <div className="extract-summary extract-summary--found">
        {count} certificado{count !== 1 ? 's' : ''} encontrado{count !== 1 ? 's' : ''} en el documento
      </div>
    )
  }
  return (
    <div className="extract-summary extract-summary--empty">
      No se encontraron certificados en el documento
    </div>
  )
}

function Extract() {
  const [catalog, setCatalog] = useState([])
  const [matchedIds, setMatchedIds] = useState(new Set())
  const [extracted, setExtracted] = useState(false)
  const [healthMap, setHealthMap] = useState({})
  const [catalogError, setCatalogError] = useState(null)

  useEffect(() => {
    getCertificates()
      .then((data) => {
        const items = data?.items || (Array.isArray(data) ? data : [])
        setCatalog(items)
        checkCatalogHealth(items).then(setHealthMap)
      })
      .catch((err) => setCatalogError(err.message))
  }, [])

  const handleExtracted = (matches) => {
    setMatchedIds(new Set(matches.map((m) => m.id)))
    setExtracted(true)
  }

  return (
    <div className="page-extract">
      <h2>CertiDoc</h2>
      <p>Carga un documento para identificar certificados colombianos.</p>

      <DocumentUploader catalog={catalog} onExtracted={handleExtracted} />

      <ExtractSummary extracted={extracted} count={matchedIds.size} />

      {catalogError && (
        <p style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-md)' }}>
          No se pudo cargar el catálogo: {catalogError}
        </p>
      )}

      <CertificateTable
        certificates={catalog}
        matchedIds={matchedIds}
        healthMap={healthMap}
      />
    </div>
  )
}

export default Extract
