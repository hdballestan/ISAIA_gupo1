import { useState, useEffect } from 'react'
import DocumentUploader from '../components/DocumentUploader'
import CertificateTable from '../components/CertificateTable'
import { getCertificates, reviewThreat } from '../services/api'
import { checkCatalogHealth } from '../services/health'
import { getChecklist, toggleItem, clearChecklist } from '../services/checklist'

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

const HEALTH_INTERVAL_MS = 10 * 60 * 1000

function Extract() {
  const [catalog, setCatalog] = useState([])
  const [matchedIds, setMatchedIds] = useState(new Set())
  const [unverifiedList, setUnverifiedList] = useState([])
  const [extracted, setExtracted] = useState(false)
  const [healthMap, setHealthMap] = useState({})
  const [lastChecked, setLastChecked] = useState(null)
  const [catalogError, setCatalogError] = useState(null)
  const [threatChecks, setThreatChecks] = useState({})
  const [checklist, setChecklist] = useState(() => getChecklist())

  function runHealthCheck(items) {
    checkCatalogHealth(items).then((map) => {
      setHealthMap(map)
      setLastChecked(new Date())
    })
  }

  useEffect(() => {
    getCertificates()
      .then((data) => {
        const items = data?.items || (Array.isArray(data) ? data : [])
        setCatalog(items)
        runHealthCheck(items)
      })
      .catch((err) => setCatalogError(err.message))
  }, [])

  useEffect(() => {
    if (catalog.length === 0) return
    const id = setInterval(() => runHealthCheck(catalog), HEALTH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [catalog])

  const handleExtracted = ({ matched, unverified }) => {
    setMatchedIds(new Set(matched.map((m) => m.id)))
    setUnverifiedList(unverified)
    setExtracted(true)
  }

  function handleToggle(key) {
    setChecklist(toggleItem(key))
  }

  function handleClearChecklist() {
    if (window.confirm('¿Eliminar todo el progreso guardado?')) {
      setChecklist(clearChecklist())
    }
  }

  async function handleThreatReview(certificateId, portalUrl) {
    const previous = threatChecks[certificateId]
    if (previous && !['idle', 'unavailable'].includes(previous.threat_level)) {
      return
    }
    if (!portalUrl) {
      setThreatChecks((prev) => ({
        ...prev,
        [certificateId]: { threat_level: 'unavailable', note: 'Certificado sin portal URL' },
      }))
      return
    }
    setThreatChecks((prev) => ({
      ...prev,
      [certificateId]: { threat_level: 'loading', note: 'Consultando...' },
    }))
    const result = await reviewThreat(certificateId, portalUrl)
    setThreatChecks((prev) => ({ ...prev, [certificateId]: result }))
  }

  const allKeys = [
    ...catalog.map((c) => `cat:${c.id}`),
    ...unverifiedList.map((u) => u.key),
  ]
  const doneCount = allKeys.filter((k) => checklist[k]).length
  const totalItems = allKeys.length

  return (
    <div className="page-extract">
      <h2>CertiDoc</h2>
      <p>Carga un documento para identificar certificados colombianos.</p>

      <DocumentUploader catalog={catalog} onExtracted={handleExtracted} />

      <ExtractSummary extracted={extracted} count={matchedIds.size} />

      {catalogError && (
        <p className="extract__catalog-error">
          No se pudo cargar el catálogo: {catalogError}
        </p>
      )}

      {totalItems > 0 && (
        <div className="extract__checklist-header">
          <span className="extract__checklist-counter">
            {doneCount}/{totalItems} completados
          </span>
          {doneCount > 0 && (
            <button
              type="button"
              className="btn btn--sm btn-secondary"
              onClick={handleClearChecklist}
            >
              Limpiar progreso
            </button>
          )}
        </div>
      )}

      <CertificateTable
        certificates={catalog}
        matchedIds={matchedIds}
        unverifiedList={unverifiedList}
        checklist={checklist}
        onToggle={handleToggle}
        healthMap={healthMap}
        lastChecked={lastChecked}
        threatChecks={threatChecks}
        onThreatReview={handleThreatReview}
      />
    </div>
  )
}

export default Extract
