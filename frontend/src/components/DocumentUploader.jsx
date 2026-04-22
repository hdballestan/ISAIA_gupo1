import { useState, useEffect } from 'react'
import { extractImageText } from '../services/ocr'
import { extractPdfText } from '../services/pdf'
import { matchDocument } from '../utils/matcher'

const VALID_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain']
const TYPE_BY_EXTENSION = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  txt: 'text/plain',
}
const MAX_SIZE = 10 * 1024 * 1024

function resolveFileType(file) {
  if (VALID_TYPES.includes(file.type)) return file.type
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  return TYPE_BY_EXTENSION[ext] || file.type
}

function DocumentUploader({ catalog = [], onExtracted }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [useTextMode, setUseTextMode] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleOcrProgress = (e) => {
      const value = Number(e.detail?.progress || 0)
      setProgress(Math.round(value * 100))
    }
    window.addEventListener('ocr-progress', handleOcrProgress)
    return () => window.removeEventListener('ocr-progress', handleOcrProgress)
  }, [])

  const validateFile = (file) => {
    const fileType = resolveFileType(file)
    if (!VALID_TYPES.includes(fileType)) {
      setError('Solo PDF, JPG, PNG, TXT — máx 10MB')
      return null
    }
    if (file.size > MAX_SIZE) {
      setError('Archivo muy grande — máx 10MB')
      return null
    }
    return fileType
  }

  const extractText = async (file, fileType) => {
    if (fileType === 'text/plain') return file.text()
    if (fileType === 'application/pdf') return extractPdfText(file)
    if (fileType.startsWith('image/')) return extractImageText(file)
    throw new Error('Tipo de archivo no soportado')
  }

  const process = async (getText) => {
    setError(null)
    setIsLoading(true)
    setProgress(0)
    try {
      const text = await getText()
      if (!text?.trim()) {
        setError('No se pudo extraer texto del archivo')
        return
      }
      const result = matchDocument(text, catalog)
      if (onExtracted) onExtracted(result)
    } catch (err) {
      setError(err.message || 'Error procesando archivo')
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    const fileType = file ? validateFile(file) : null
    if (fileType) process(() => extractText(file, fileType))
  }

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    const fileType = file ? validateFile(file) : null
    if (fileType) process(() => extractText(file, fileType))
  }

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      setError('Ingresa texto para continuar')
      return
    }
    process(() => Promise.resolve(textInput))
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
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
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

      {isLoading && (
        <div className="uploader__progress">
          {progress > 0 ? (
            <div className="uploader__progress-bar" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          ) : (
            <p className="uploader__status">Procesando...</p>
          )}
        </div>
      )}

      {error && <div className="uploader__error">{error}</div>}
    </div>
  )
}

export default DocumentUploader
