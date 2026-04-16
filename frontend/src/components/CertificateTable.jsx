import { useState, useMemo } from 'react'

function HealthDot({ status }) {
  return (
    <span
      className={`cert-table__health cert-table__health--${status}`}
      title={status === 'ok' ? 'Portal disponible' : status === 'error' ? 'Portal no disponible' : 'Verificando...'}
    />
  )
}

function buildRows(certificates, matchedIds) {
  const matched = certificates.filter((c) => matchedIds.has(c.id))
  const rest = certificates.filter((c) => !matchedIds.has(c.id))
  return [...matched, ...rest]
}

function CertificateTable({ certificates = [], matchedIds = new Set(), healthMap = {} }) {
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
                <th>Estado</th>
                <th>Certificado</th>
                <th>Emisor</th>
                <th>Tiempo est.</th>
                <th>Portal</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((cert) => {
                const isMatch = matchedIds.has(cert.id)
                const health = cert.portal_url ? (healthMap[cert.portal_url] || 'pending') : null
                return (
                  <tr
                    key={cert.id}
                    className={isMatch ? 'cert-table__row--match' : ''}
                  >
                    <td>
                      {isMatch && (
                        <span className="cert-table__match-badge">Encontrado</span>
                      )}
                    </td>
                    <td>{cert.name}</td>
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
                      {health ? <HealthDot status={health} /> : '—'}
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
