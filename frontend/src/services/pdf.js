import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

function normalizePageText(items) {
  return items
    .map((item) => `${item.str}${item.hasEOL ? '\n' : ' '}`)
    .join('')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

function emitProgress(processedPages, totalPages) {
  const progress = totalPages > 0 ? processedPages / totalPages : 0
  window.dispatchEvent(new CustomEvent('ocr-progress', { detail: { progress } }))
}

async function renderPageToBlob(page) {
  const viewport = page.getViewport({ scale: 2 })
  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('No se pudo renderizar la página PDF')
  }
  await page.render({ canvasContext: context, viewport }).promise
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

async function extractPageText(page) {
  const content = await page.getTextContent()
  return normalizePageText(content.items)
}

async function extractImagePageText(page, extractImageText) {
  const image = await renderPageToBlob(page)
  if (!image) {
    return ''
  }
  const text = await extractImageText(image)
  return text.trim()
}

async function extractPdfPages(pdf) {
  const parts = []
  let extractImageText = null
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const text = (await extractPageText(page)).trim()
    if (text) parts.push(text)
    if (!text) {
      if (!extractImageText) extractImageText = (await import('./ocr.js')).extractImageText
      const ocrText = await extractImagePageText(page, extractImageText)
      if (ocrText) parts.push(ocrText)
    }
    emitProgress(i, pdf.numPages)
  }
  return parts.join('\n\n')
}

export async function extractPdfText(file) {
  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const loadingTask = pdfjsLib.getDocument({ data: bytes })
    const pdf = await loadingTask.promise
    return extractPdfPages(pdf)
  } catch {
    throw new Error('No se pudo extraer texto del PDF')
  }
}
