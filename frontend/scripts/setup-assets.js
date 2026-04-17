import { cpSync, createWriteStream, existsSync, mkdirSync, readdirSync } from 'fs'
import { get } from 'https'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function copy(src, dest) {
  if (existsSync(src)) cpSync(src, dest)
  else console.warn('Skipped (not found):', src)
}

function copyCoreFiles() {
  const src = join(ROOT, 'node_modules/tesseract.js-core')
  const dest = join(ROOT, 'public/tesseract')
  readdirSync(src)
    .filter((f) => f.startsWith('tesseract-core') && f.endsWith('.js'))
    .forEach((f) => copy(join(src, f), join(dest, f)))
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject)
      }
      const file = createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
      file.on('error', reject)
    }).on('error', reject)
  })
}

async function downloadLangData() {
  const dest = join(ROOT, 'public/tesseract/lang/spa.traineddata.gz')
  if (existsSync(dest)) return
  const url = 'https://github.com/naptha/tessdata/raw/4.0.0/spa.traineddata.gz'
  try {
    await downloadFile(url, dest)
  } catch (err) {
    console.warn('No se pudo descargar spa.traineddata.gz:', err.message)
    console.warn(`  Ejecutar manualmente: curl -fL -o public/tesseract/lang/spa.traineddata.gz ${url}`)
  }
}

ensureDir(join(ROOT, 'public/tesseract/lang'))
copy(
  join(ROOT, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
  join(ROOT, 'public/pdf.worker.min.js')
)
copy(
  join(ROOT, 'node_modules/tesseract.js/dist/worker.min.js'),
  join(ROOT, 'public/tesseract/worker.min.js')
)
copyCoreFiles()
await downloadLangData()
console.log('setup-assets: listo')
