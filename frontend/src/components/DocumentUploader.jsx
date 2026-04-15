import { useState, useEffect } from 'react'
import { getCertificates } from '../services/api'
import { extractPdfText } from '../services/pdf'
import { extractImageText } from '../services/ocr'
import { matchCertificates } from '../utils/matcher'

function DocumentUploader({ onExtracted }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [useTextMode, setUseTextMode] = useState(false)
  const [progress, setProgress] = useState(0)
  const [catalog, setCatalog] = useState([])

  const VALID_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain']
  const MAX_SIZE = 10 * 1024 * 1024

  useEffect(() => {
    loadCatalog()
    const handleOcrProgress = (e) => setProgress(Math.round(e.detail.progress * 100))
    window.addEventListener('ocr-progress', handleOcrProgress)
    return () => window.removeEventListener('ocr-progress', handleOcrProgress)
  }, [])

  const loadCatalog = async () => {
    try {
      const data = await getCertificates()
      setCatalog(data || [])
    } catch (err) {
      console.warn('No catalog loaded:', err.message)
    }
  }

  const validateFile = (file) => {
    if (!VALID_TYPES.includes(file.type)) {
      setError('Solo PDF, JPG, PNG, TXT — máx 10MB')
      return false
    }
    if (file.size > MAX_SIZE) {
      setError('Archivo muy grande — máx 10MB')
      return false
    }
    return true
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) {
      processFile(file)
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      processFile(file)
    }
  }

  const extractText = async (file) => {
    if (file.type === 'text/plain') {
      return file.text()
    }
    if (file.type === 'application/pdf') {
      return extractPdfText(file)
    }
    if (file.type.startsWith('image/')) {
      setProgress(0)
      return extractImageText(file)
    }
    throw new Error('Tipo de archivo no soportado')
  }

  const processFile = async (file) => {
    setError(null)
    setIsLoading(true)
    setProgress(0)
    try {
      const text = await extractText(file)
      if (!text?.trim()) {
        setError('Texto vacío')
        return
      }
      const matches = matchCertificates(text, catalog)
      handleExtraction(matches)
    } catch (err) {
      setError(err.message || 'Error procesando archivo')
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const handleExtraction = (matches) => {
    setTextInput('')
    setUseTextMode(false)
    if (onExtracted) {
      onExtracted(matches)
    }
  }

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      setError('Ingresa texto para continuar')
      return
    }
    const matches = matchCertificates(textInput, catalog)
    handleExtraction(matches)
  }

  return (
    <div className="uploader">
      <div className="uploader__tabs">
        <button
          className={`uploader__tab ${!useTextMode ? 'uploader__tab--active' : ''}`}
          onClick={() => setUseTextMode(false)}
        >
          Archivo
        </button>
        <button
          className={`uploader__tab ${useTextMode ? 'uploader__tab--active' : ''}`}
          onClick={() => setUseTextMode(true)}
        >
          Texto
        </button>
      </div>

      {!useTextMode && (
        <div
          className={`uploader__drop ${isDragging ? 'uploader__drop--active' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <p>Arrastra un archivo aquí</p>
          <input
            type="file"
            id="file-input"
            onChange={handleFileInput}
            className="uploader__input"
            accept=".pdf,.jpg,.jpeg,.png,.txt"
            disabled={isLoading}
          />
          <label htmlFor="file-input" className="btn btn-secondary">
            O selecciona uno
          </label>
          <p className="uploader__hint">PDF, JPG, PNG, TXT — máx 10MB</p>
        </div>
      )}

      {useTextMode && (
        <div className="uploader__text">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="uploader__textarea"
            placeholder="Pega o escribe el texto del documento..."
            disabled={isLoading}
          />
          <button
            onClick={handleTextSubmit}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Procesando...' : 'Procesar texto'}
          </button>
        </div>
      )}

      {isLoading && progress > 0 && (
        <div className="uploader__progress">
          <div className="uploader__progress-bar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {error && <div className="uploader__error">{error}</div>}
    </div>
  )
}

export default DocumentUploader


