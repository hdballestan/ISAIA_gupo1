import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Extract from './pages/Extract'
import Catalog from './pages/Catalog'
import CertificateDetail from './pages/CertificateDetail'
import Admin from './pages/Admin'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/extract" element={<Extract />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<CertificateDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
