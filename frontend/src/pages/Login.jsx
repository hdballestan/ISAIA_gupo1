import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Completa todos los campos.')
      return
    }

    if (isRegister && password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setIsLoading(true)

    try {
      if (isRegister) {
        await register(email, password)
        setError('')
        setIsRegister(false)
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        alert('Cuenta creada. Ahora accede.')
      } else {
        const response = await login(email, password)
        localStorage.setItem('token', response.access_token)
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Error al procesar solicitud.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-login">
      <div className="login-card">
        <h2>{isRegister ? 'Registrarse' : 'Acceder'}</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Confirma contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />
          )}
          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? 'Procesando...' : isRegister ? 'Registrarse' : 'Acceder'}
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <p className="login-toggle">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="link-button"
          >
            {isRegister ? 'Acceder' : 'Registrarse'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login

