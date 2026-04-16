import { Outlet, Link } from 'react-router-dom'

function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <h1>CertiDoc</h1>
            <p>Portal de Certificados Colombianos</p>
          </div>
          <nav className="nav">
            <Link to="/">Inicio</Link>
            <Link to="/extract">Certificados</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/login">Acceder</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          <strong>Aviso legal:</strong> CertiDoc orienta sobre certificados
          colombianos. No emite certificados. Para trámites oficiales, diríjase
          a los portales de cada entidad.
        </p>
        <p>&copy; 2026 CertiDoc. Privacidad garantizada — Ley 1581/2012.</p>
      </footer>
    </div>
  )
}

export default Layout
