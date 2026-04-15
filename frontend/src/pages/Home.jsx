import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="page-home">
      <h2>Bienvenido a CertiDoc</h2>
      <p>
        Identifica y obtén enlaces a los certificados colombianos que necesitas.
      </p>
      <div className="cta-buttons">
        <Link to="/extract" className="btn btn-primary">
          Extraer Certificados
        </Link>
        <Link to="/catalog" className="btn btn-secondary">
          Ver Catálogo
        </Link>
      </div>
    </div>
  )
}

export default Home
