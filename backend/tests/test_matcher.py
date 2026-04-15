from app.services.matcher import match_certificates


def test_matcher_returns_known_certificate() -> None:
    catalog = [
        {
            "id": 1,
            "name": "Antecedentes Judiciales",
            "regex_patterns": [r"antecedentes\\s+judiciales", r"policia"],
        }
    ]
    text = "Se requiere certificado de antecedentes judiciales de policia"
    matches = match_certificates(text, catalog)
    assert len(matches) == 1
    assert matches[0]["id"] == 1


def test_matcher_returns_empty_for_unknown_text() -> None:
    catalog = [{"id": 1, "name": "X", "regex_patterns": [r"procuraduria"]}]
    text = "Recibo de servicios publicos y copia de cedula"
    matches = match_certificates(text, catalog)
    assert matches == []
