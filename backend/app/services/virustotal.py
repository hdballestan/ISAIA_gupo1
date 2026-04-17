import base64
import json
import time
from typing import Optional
from urllib import parse, request
from urllib.error import HTTPError, URLError

VT_BASE = "https://www.virustotal.com/api/v3"


def _url_id(url: str) -> str:
    return base64.urlsafe_b64encode(url.encode()).decode().rstrip("=")


def _decode_json_response(response) -> Optional[dict]:
    payload = response.read().decode("utf-8")
    return json.loads(payload)


def _vt_get(url: str, api_key: str) -> Optional[dict]:
    endpoint = f"{VT_BASE}/urls/{_url_id(url)}"
    req = request.Request(endpoint, headers={"x-apikey": api_key}, method="GET")
    with request.urlopen(req, timeout=8) as res:
        return _decode_json_response(res)


def _vt_enqueue(url: str, api_key: str) -> None:
    data = parse.urlencode({"url": url}).encode("utf-8")
    headers = {
        "x-apikey": api_key,
        "Content-Type": "application/x-www-form-urlencoded",
    }
    req = request.Request(f"{VT_BASE}/urls", data=data, headers=headers, method="POST")
    with request.urlopen(req, timeout=8):
        return


def fetch_url_report(url: str, api_key: str) -> Optional[dict]:
    if not api_key:
        return None
    try:
        return _vt_get(url, api_key)
    except HTTPError as err:
        if err.code == 404:
            try:
                _vt_enqueue(url, api_key)
                for _ in range(3):
                    time.sleep(1)
                    try:
                        report = _vt_get(url, api_key)
                        if report:
                            return report
                    except (HTTPError, URLError, TimeoutError):
                        continue
            except (HTTPError, URLError, TimeoutError):
                return None
        return None
    except (URLError, TimeoutError):
        return None


def extract_result(vt_response: Optional[dict]) -> dict:
    if not vt_response:
        return {"threat_level": "unavailable", "note": "No disponible"}
    try:
        attrs = vt_response["data"]["attributes"]
        stats = attrs.get("last_analysis_stats", {})
        malicious = stats.get("malicious", 0)
        suspicious = stats.get("suspicious", 0)
        total = sum(stats.values())
        if total <= 0:
            return {"threat_level": "unavailable", "note": "Analisis en curso"}
        if malicious > 0:
            note = f"{malicious} de {total} motores detectaron amenaza"
            return {"threat_level": "malicious", "note": note}
        if suspicious > 0:
            note = f"{suspicious} de {total} motores marcaron como sospechoso"
            return {"threat_level": "suspicious", "note": note}
        note = f"Revisado: {total} motores sin detecciones"
        return {"threat_level": "safe", "note": note}
    except (KeyError, TypeError, ValueError):
        return {"threat_level": "unavailable", "note": "No disponible"}
