async function checkUrl(url) {
  try {
    await fetch(url, { mode: 'no-cors', method: 'HEAD' })
    return 'ok'
  } catch {
    return 'error'
  }
}

export async function checkCatalogHealth(certificates) {
  const urls = [...new Set(certificates.map((c) => c.portal_url).filter(Boolean))]
  const results = await Promise.allSettled(urls.map((url) => checkUrl(url)))
  const healthMap = {}
  urls.forEach((url, i) => {
    healthMap[url] = results[i].status === 'fulfilled' ? results[i].value : 'error'
  })
  return healthMap
}
