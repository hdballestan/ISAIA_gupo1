import { Link } from 'react-router-dom'

function CertificateCard({ certificate }) {
  const {
    id,
    name,
    issuer,
    portal_url,
    purposes = [],
    estimated_days,
    validity_days,
    is_mandatory_for_minors,
  } = certificate

  return (
    <div className="cert-card">
      <div className="cert-card__header">
        <h3 className="cert-card__title">{name}</h3>
        {is_mandatory_for_minors && (
          <span className="cert-card__badge">Menores</span>
        )}
      </div>

      <p className="cert-card__issuer">{issuer}</p>

      {purposes.length > 0 && (
        <div className="cert-card__purposes">
          {purposes.map((p) => (
            <span key={p} className="cert-card__purpose-tag">{p}</span>
          ))}
        </div>
      )}

      {(estimated_days || validity_days) && (
        <div className="cert-card__meta">
          {estimated_days && <p>Tiempo: {estimated_days} días</p>}
          {validity_days && <p>Vigencia: {validity_days} días</p>}
        </div>
      )}

      <div className="cert-card__actions">
        <Link to={`/catalog/${id}`} className="btn btn-secondary">
          Detalle
        </Link>
        {portal_url && (
          <a
            href={portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Ir al sitio
          </a>
        )}
      </div>
    </div>
  )
}

export default CertificateCard

