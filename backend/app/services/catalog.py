from app.models.certificate import Certificate


def serialize_certificate(cert: Certificate) -> dict:
    return {
        "id": cert.id,
        "name": cert.name,
        "issuer": cert.issuer,
        "purposes": cert.purposes,
        "legal_basis": cert.legal_basis,
        "requirements": cert.requirements,
        "portal_url": cert.portal_url,
        "estimated_days": cert.estimated_days,
        "validity_days": cert.validity_days,
        "is_mandatory_for_minors": cert.is_mandatory_for_minors,
        "practical_notes": cert.practical_notes,
        "regex_patterns": cert.regex_patterns,
        "last_verified": cert.last_verified,
    }
