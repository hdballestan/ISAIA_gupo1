const GENERIC_PREFIXES =
  "(certificado|constancia|paz\\s+y\\s+salvo|antecedentes|registro|" +
  "carta|documento|acta|declaracion|autorizacion|permiso)\\s+" +
  "(de|del|de\\s+la|de\\s+los|de\\s+las)\\s+([a-z\u00e0-\u00fc\\s]{3,40})";

const GENERIC_RE = new RegExp(GENERIC_PREFIXES, "gi");

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

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 60);
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

export function extractUnverifiedCertificates(text, matchedIds, catalog) {
  const normalized = normalizeText(text);
  const catalogNorms = catalog.flatMap((c) =>
    (c.regex_patterns || []).map((p) => compilePattern(p)).filter(Boolean)
  );

  const seen = new Set();
  const results = [];

  let match;
  GENERIC_RE.lastIndex = 0;
  while ((match = GENERIC_RE.exec(normalized)) !== null) {
    const full = match[0].trim();
    const slug = slugify(full);
    if (seen.has(slug)) continue;
    seen.add(slug);

    const alreadyInCatalog = catalogNorms.some((re) => re.test(normalized));
    const matchedByCatalog = catalog.some(
      (c) => matchedIds.has(c.id) && matchesCertificate(full, c.regex_patterns || [])
    );
    if (!alreadyInCatalog || !matchedByCatalog) {
      results.push({ key: `unv:${slug}`, label: full });
    }
  }
  return results;
}

export function matchDocument(text, catalog) {
  const matched = matchCertificates(text, catalog);
  const matchedIds = new Set(matched.map((c) => c.id));
  const unverified = extractUnverifiedCertificates(text, matchedIds, catalog);
  return { matched, unverified };
}
