import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

async function extractTextFromPage(page) {
  const textContent = await page.getTextContent({
    includeMarkedContent: false,
    disableNormalization: false,
  })

  let fullText = ''
  let lastY = null

  for (const item of textContent.items) {
    if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
      fullText += '\n'
    }
    fullText += item.str || ''
    lastY = item.transform[5]
  }

  return fullText
}

export async function extractPdfText(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise

    const textParts = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const text = await extractTextFromPage(page)
      textParts.push(text)
    }

    return textParts.join('\n\n')
  } catch (error) {
    throw new Error(`PDF error: ${error.message}`)
  }
}
