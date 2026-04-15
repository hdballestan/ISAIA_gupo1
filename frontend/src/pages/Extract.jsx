import { useState } from 'react'
import DocumentUploader from '../components/DocumentUploader'
import CertificateList from '../components/CertificateList'

function Extract() {
  const [results, setResults] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDocumentExtracted = (certificates) => {
    setResults(certificates)
    setIsProcessing(false)
  }

  return (
    <div className="page-extract">
      <h2>Extraer Certificados</h2>
      <p>Carga un documento (PDF, imagen o texto) para identificar certificados.</p>

      <DocumentUploader onExtracted={handleDocumentExtracted} />

      {results.length > 0 && (
        <div className="results-section">
          <h3>Certificados Encontrados</h3>
          <CertificateList certificates={results} />
        </div>
      )}
    </div>
  )
}

export default Extract
