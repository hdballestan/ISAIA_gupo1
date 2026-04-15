import re
import unicodedata
from typing import Optional


def normalize_text(text: str) -> str:
    """Normalize text: lowercase, remove accents, collapse whitespace."""
    text = text.lower()
    text = "".join(
        c
        for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )
    text = re.sub(r"\s+", " ", text).strip()
    return text


def compile_pattern(pattern_str: str) -> Optional[re.Pattern]:
    """Compile a regex pattern string, return None on error."""
    try:
        return re.compile(pattern_str, re.IGNORECASE)
    except re.error:
        return None


def matches_certificate(text: str, patterns: list[str]) -> bool:
    """Check if any pattern matches the normalized text."""
    normalized = normalize_text(text)
    for pattern_str in patterns:
        compiled = compile_pattern(pattern_str)
        if compiled and compiled.search(normalized):
            return True
    return False


def match_certificates(text: str, catalog: list[dict]) -> list[dict]:
    """Match text against all certificates and return matching entries."""
    results = []
    for cert in catalog:
        patterns = cert.get("regex_patterns", [])
        if patterns and matches_certificate(text, patterns):
            results.append(cert)
    return results
