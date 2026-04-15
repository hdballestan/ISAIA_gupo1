import { useState } from 'react'
import { createTicket } from '../services/api'

function TicketForm() {
  const [description, setDescription] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (honeypot.trim()) {
      setMessage('Bot detectado.')
      return
    }

    if (!description.trim() || description.length < 10) {
      setMessage('Descripción debe tener al menos 10 caracteres.')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      await createTicket({ description, honeypot: '' })
      setIsSuccess(true)
      setMessage('Solicitud registrada. Gracias.')
      setDescription('')
    } catch (err) {
      setIsSuccess(false)
      setMessage(err.message || 'Error al enviar solicitud.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="description">
          Describe el trámite que necesitas:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
          placeholder="Ej: Necesito antecedentes judiciales para..."
          minLength={10}
          maxLength={5000}
        />
        <span className="form-hint">
          {description.length}/5000 caracteres
        </span>
      </div>

      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="form-honeypot"
        tabIndex="-1"
        autoComplete="off"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? 'Enviando...' : 'Enviar solicitud'}
      </button>

      {message && (
        <div
          className={`form-message ${isSuccess ? 'form-message--success' : 'form-message--error'}`}
        >
          {message}
        </div>
      )}
    </form>
  )
}

export default TicketForm
