import Tesseract from 'tesseract.js'

const OCR_OPTIONS = {
  workerPath: '/tesseract/worker.min.js',
  corePath: '/tesseract/',
  langPath: '/tesseract/lang',
  workerBlobURL: false,
}

let worker = null

function emitOcrProgress(progress) {
  window.dispatchEvent(new CustomEvent('ocr-progress', { detail: { progress } }))
}

function buildWorkerOptions(useCustomPaths) {
  return {
    ...(useCustomPaths ? OCR_OPTIONS : {}),
    logger: (event) => {
      if (typeof event.progress === 'number') {
        emitOcrProgress(event.progress)
      }
    },
  }
}

function sanitizeOcrError(error) {
  const message = error?.message || 'Error desconocido de OCR'
  if (message.includes('data:application/octet-stream;base64')) {
    return 'No se pudo cargar el motor OCR en el navegador'
  }
  return message
}

async function initWorker() {
  if (worker) return worker
  try {
    worker = await Tesseract.createWorker('spa', 1, buildWorkerOptions(true))
  } catch {
    try {
      worker = await Tesseract.createWorker('spa', 1, buildWorkerOptions(false))
    } catch {
      worker = await Tesseract.createWorker('eng', 1, buildWorkerOptions(false))
    }
  }
  return worker
}

export async function extractImageText(file) {
  try {
    const w = await initWorker()
    const { data } = await w.recognize(file)
    return data.text || ''
  } catch (error) {
    const message = sanitizeOcrError(error)
    throw new Error(`OCR error: ${message}`)
  }
}

export async function terminateOcrWorker() {
  if (worker) {
    await worker.terminate()
    worker = null
  }
}
