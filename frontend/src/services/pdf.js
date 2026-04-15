import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?raw'

const workerBlob = new Blob([workerSrc], { type: 'application/javascript' })
pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob)

async function renderPageToBlob(page) {
  const viewport = page.getViewport({ scale: 2.0 })
  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

export async function extractPdfText(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const { extractImageText } = await import('./ocr.js')

    const parts = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const blob = await renderPageToBlob(page)
      const text = await extractImageText(blob)
      parts.push(text)
      window.dispatchEvent(
        new CustomEvent('ocr-progress', { detail: { progress: i / pdf.numPages } })
      )
    }

    return parts.join('\n\n')
  } catch (error) {
    throw new Error(`PDF error: ${error.message}`)
  }
}
