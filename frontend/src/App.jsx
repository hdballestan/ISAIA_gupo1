import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Extract from './pages/Extract'
import Admin from './pages/Admin'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/extract" replace />} />
          <Route path="/extract" element={<Extract />} />
          <Route path="/catalog" element={<Navigate to="/extract" replace />} />
          <Route path="/catalog/:id" element={<Navigate to="/extract" replace />} />
          <Route path="/administration" element={<Admin />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
