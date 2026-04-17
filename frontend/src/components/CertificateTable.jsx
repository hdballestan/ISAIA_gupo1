import { useState, useMemo } from 'react'

const STATUS_LABEL = {
  ok: 'Funcionando',
  error: 'Sin acceso',
  pending: 'Verificando...',
}

const THREAT_LABEL = {
  idle: 'Sin revisar',
  loading: 'Consultando...',
  safe: 'Sin amenaza',
  suspicious: 'Sospechoso',
  malicious: 'Riesgo alto',
  unavailable: 'No disponible',
}

function PortalStatus({ status }) {
  return (
    <span className={`cert-table__portal-status cert-table__portal-status--${status}`}>
      {STATUS_LABEL[status] ?? 'Verificando...'}
    </span>
  )
}

function formatLastChecked(date) {
  if (!date) return 'Consultando portales...'
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const time = date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  return isToday ? `Portales consultados hoy a las ${time}` : `Portales consultados ayer a las ${time}`
}

function buildRows(certificates, matchedIds) {
  const matched = certificates.filter((c) => matchedIds.has(c.id))
  const rest = certificates.filter((c) => !matchedIds.has(c.id))
  return [...matched, ...rest]
}

function ThreatStatus({ value }) {
  const level = value?.threat_level || 'idle'
  return (
    <div>
      <span className={`cert-table__threat cert-table__threat--${level}`}>
        {THREAT_LABEL[level] || THREAT_LABEL.unavailable}
      </span>
      {value?.note && level !== 'loading' && (
        <p className="cert-table__threat-note">{value.note}</p>
      )}
    </div>
  )
}

function CertificateTable({
  certificates = [],
  matchedIds = new Set(),
  healthMap = {},
  lastChecked = null,
  threatChecks = {},
  onThreatReview,
}) {
  const [search, setSearch] = useState('')
  const [filterPurpose, setFilterPurpose] = useState('')

  const purposes = useMemo(
    () => [...new Set(certificates.flatMap((c) => c.purposes || []))].sort(),
    [certificates]
  )

  const rows = useMemo(() => {
    const ordered = buildRows(certificates, matchedIds)
    return ordered.filter((cert) => {
      const matchSearch =
        !search ||
        cert.name.toLowerCase().includes(search.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(search.toLowerCase())
      const matchPurpose =
        !filterPurpose || (cert.purposes || []).includes(filterPurpose)
      return matchSearch && matchPurpose
    })
  }, [certificates, matchedIds, search, filterPurpose])

  return (
    <div>
      <p className="cert-table__last-checked">{formatLastChecked(lastChecked)}</p>
      <div className="cert-table__controls">
        <input
          type="text"
          placeholder="Buscar certificado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="cert-table__search"
        />
        {purposes.length > 0 && (
          <select
            value={filterPurpose}
            onChange={(e) => setFilterPurpose(e.target.value)}
            className="cert-table__filter"
          >
            <option value="">Todos los propósitos</option>
            {purposes.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="cert-table__empty">No se encontraron certificados.</p>
      ) : (
        <div className="cert-table-wrap">
          <table className="cert-table">
            <thead>
              <tr>
                <th>Certificado</th>
                <th>Emisor</th>
                <th>Tiempo est.</th>
                <th>Portal</th>
                <th>Estado del portal</th>
                <th>Revisar amenazas</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((cert) => {
                const isMatch = matchedIds.has(cert.id)
                const health = cert.portal_url ? (healthMap[cert.portal_url] || 'pending') : null
                const threat = threatChecks[cert.id] || { threat_level: 'idle' }
                const isLoadingThreat = threat.threat_level === 'loading'
                const isReviewedThreat = !['idle', 'loading', 'unavailable'].includes(threat.threat_level)
                return (
                  <tr
                    key={cert.id}
                    className={isMatch ? 'cert-table__row--match' : ''}
                  >
                    <td>
                      <div className="cert-table__name">
                        <span>{cert.name}</span>
                        {isMatch && (
                          <span className="cert-table__match-badge">Encontrado</span>
                        )}
                      </div>
                    </td>
                    <td>{cert.issuer}</td>
                    <td>{cert.estimated_days ? `${cert.estimated_days} días` : '—'}</td>
                    <td>
                      {cert.portal_url ? (
                        <a
                          href={cert.portal_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--sm btn-primary"
                        >
                          Ir al sitio
                        </a>
                      ) : '—'}
                    </td>
                    <td>
                      {health ? <PortalStatus status={health} /> : '—'}
                    </td>
                    <td>
                      <div className="cert-table__threat-cell">
                        <button
                          type="button"
                          className="btn btn--sm btn-secondary cert-table__threat-btn"
                          onClick={() => onThreatReview && onThreatReview(cert.id, cert.portal_url)}
                          disabled={isLoadingThreat || isReviewedThreat}
                        >
                          {isLoadingThreat ? 'Revisando...' : isReviewedThreat ? 'Revisado' : 'Revisar'}
                        </button>
                        <ThreatStatus value={threat} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CertificateTable
