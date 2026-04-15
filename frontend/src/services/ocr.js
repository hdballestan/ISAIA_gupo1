import Tesseract from 'tesseract.js'

let worker = null

async function initWorker() {
  if (worker) return worker
  worker = await Tesseract.createWorker('spa', 1, {
    logger: (m) => {
      if (m.status === 'recognizing') {
        window.dispatchEvent(
          new CustomEvent('ocr-progress', {
            detail: { progress: m.progress },
          })
        )
      }
    },
  })
  return worker
}

export async function extractImageText(file) {
  try {
    const w = await initWorker()
    const { data } = await w.recognize(file)
    return data.text
  } catch (error) {
    throw new Error(`OCR error: ${error.message}`)
  }
}

export async function terminateOcrWorker() {
  if (worker) {
    await worker.terminate()
    worker = null
  }
}
