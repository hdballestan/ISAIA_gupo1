import { useState, useMemo } from 'react'
import CertificateCard from './CertificateCard'

function CertificateList({ certificates = [] }) {
  const [search, setSearch] = useState('')
  const [filterPurpose, setFilterPurpose] = useState('')

  const filtered = useMemo(() => {
    return certificates.filter((cert) => {
      const matchSearch =
        cert.name.toLowerCase().includes(search.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(search.toLowerCase())

      const matchPurpose = !filterPurpose || (cert.purposes || []).includes(filterPurpose)

      return matchSearch && matchPurpose
    })
  }, [certificates, search, filterPurpose])

  const purposes = [
    ...new Set(certificates.flatMap((c) => c.purposes || [])),
  ].sort()

  return (
    <div className="cert-list">
      <div className="cert-list__controls">
        <input
          type="text"
          placeholder="Buscar certificado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="cert-list__search"
        />

        {purposes.length > 0 && (
          <select
            value={filterPurpose}
            onChange={(e) => setFilterPurpose(e.target.value)}
            className="cert-list__filter"
          >
            <option value="">Todos los propósitos</option>
            {purposes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="cert-list__empty">No se encontraron certificados.</p>
      ) : (
        <div className="cert-list__grid">
          {filtered.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CertificateList

