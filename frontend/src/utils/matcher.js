function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function compilePattern(patternStr) {
  try {
    return new RegExp(patternStr, "i");
  } catch {
    return null;
  }
}

function matchesCertificate(text, patterns) {
  const normalized = normalizeText(text);
  for (const patternStr of patterns) {
    const compiled = compilePattern(patternStr);
    if (compiled && compiled.test(normalized)) {
      return true;
    }
  }
  return false;
}

export function matchCertificates(text, catalog) {
  const results = [];
  for (const cert of catalog) {
    const patterns = cert.regex_patterns || [];
    if (patterns.length > 0 && matchesCertificate(text, patterns)) {
      results.push(cert);
    }
  }
  return results;
}
