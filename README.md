# University Dropout Early Warning System

### For Colombian Public Universities

> **Working document (all deliverables):**
> [Google Docs — Project Document](https://docs.google.com/document/d/1EhfuCNT7FTHISwdVtMusnq5gW1kcwQ8M6SCS3SApwjY/edit?tab=t.0)

---

## Team

| Name | GitHub |
|------|--------|
| William | [@Willisk8](https://github.com/Willisk8) |
| Hever | [@hdballestan](https://github.com/hdballestan) |
| Cristhian | [@cecordobat](https://github.com/cecordobat) |
| Andrés | [@afarenass](https://github.com/afarenass) |

---

## Project Timeline

| Delivery | Date | Scope |
|----------|------|-------|
| Entrega 1 | Mar 28, 2025 | Problem Definition & Business Context |
| Entrega 2 | Apr 8, 2025 | Architecture & Design |
| Entrega 3 | Apr 15, 2025 | Construction, Code, Testing & Quality |
| Entrega 4 | Apr 22, 2025 | GenAI Usage & Ethical Considerations |
| Final | Apr 25, 2025 | Final Product |

---

## Table of Contents

1. [Problem Definition & Business Context](#1-problem-definition--business-context)
2. [Key Differentiator: Why This Is Not SPADIES](#2-key-differentiator-why-this-is-not-spadies)
3. [Architecture & Design](#3-architecture--design)
4. [Construction & Code](#4-construction--code)
5. [Testing & Quality](#5-testing--quality)
6. [GenAI Usage](#6-genai-usage)
7. [Ethical Considerations](#7-ethical-considerations)
8. [Final Product](#8-final-product)

---

## 1. Problem Definition & Business Context

### The Problem

University dropout in Colombia is a structural crisis. Approximately **1 in 3 students never graduates**. According to [SPADIES (MEN, 2024)][1], the annual dropout rate reached **8.08% in 2022**, while cohort-level dropout stands at **23.15%** for universities and **33.52%** for technical institutions (2023) ([LEE Informe N°74, U. Javeriana, 2023][6]). Regional inequality is stark: **La Guajira** reports dropout rates of **21.6%**, while **Cundinamarca** sits at **4.2%** ([SPADIES][1]).

The core issue: **universities react after dropout has already occurred** instead of predicting and preventing it. The *Gratuidad* policy (Ley 2307/2023) has expanded access to higher education, but without retention tools, **public funding is wasted** on students who leave without completing their degrees.

### Actors

| Actor | Role |
|-------|------|
| **Students** | Receive risk alerts; connect with institutional support services |
| **Academic Advisors** | View per-student risk dashboards; log interventions |
| **Wellbeing & Financial Aid** | Allocate limited resources based on risk level |
| **Registrar** | Provides enrollment, grades, and attendance data |
| **Institutional Leadership** | Strategic dashboards with SPADIES-aligned KPIs |
| **MEN / SPADIES** | External regulator; defines official dropout metrics |

### Business Rules

| # | Rule |
|---|------|
| 1 | **Dropout definition:** no enrollment in any HEI for 2+ consecutive academic periods ([SPADIES definition][1]) |
| 2 | Risk scores are recalculated **at least once per semester**, ideally at mid-term |
| 3 | Risk levels (**low / medium / high / critical**) trigger escalating interventions |
| 4 | Every risk score must display its **top contributing factors** (explainability) |
| 5 | **Data minimization** in compliance with Ley 1581/2012 (Habeas Data) |

### Regulatory Constraints

| Regulation | Relevance |
|------------|-----------|
| [Ley 30/1992][2] | Higher education framework; requires retention reporting |
| Ley 1581/2012 | Data protection (Habeas Data); consent required for personal data processing |
| Ley 2307/2023 | *Gratuidad* — public funding tied to retention KPIs |

### Problem-Specific Constraints

- **Budget:** Public universities operate on tight budgets — the solution must be cloud-friendly and lightweight.
- **Calendar variability:** Academic calendars differ across institutions (semester vs. trimester).
- **Data quality:** Historical records are often incomplete or not digitized.
- **MVP data strategy:** The MVP will use **synthetic data** generated from [SPADIES public distributions][1] to train and validate the model.

---

## 2. Key Differentiator: Why This Is Not SPADIES

### Comparison

| Aspect | SPADIES | This Project |
|--------|--------|--------------|
| **Scope** | National aggregate statistics | Per-student, per-institution |
| **Timing** | Retrospective (after dropout) | Predictive (before dropout) |
| **Granularity** | Cohort-level rates | Individual risk scores |
| **Actionability** | Measurement dashboard | Intervention workflows + alerts |
| **Integration** | No institutional API | Ingests university SIA data |
| **AI** | None | ML classification model + GenAI advisor assistant |

SPADIES tells the country **how many** students dropped out. This system tells a university **which** students are about to drop out, and **what** to do about it. SPADIES is a national measurement instrument — essential for policy, but not designed for intervention. This project operates on a completely different layer: **institutional, predictive, and actionable**. As documented by [EconStor (2021)][5], SPADIES has improved national visibility into dropout trends, but a gap remains at the institutional level where decisions about individual students are made.

### Solution Overview

> *Architecture details will be delivered in Entrega 2 (Apr 8).*

The system is composed of the following components (to be detailed later):

- **ML Prediction Engine** — Classification model (XGBoost / Random Forest) trained on tabular features: GPA, credits completed, Saber 11 score, financial aid status, socioeconomic stratum, and intersemestral absence history.
- **Synthetic Training Data** — Generated from SPADIES public distributions to bootstrap the model before real institutional data is available.
- **Advisor Dashboard** — Role-based interface with per-student explainability (top risk factors).
- **Alert & Notification System** — Automated alerts triggered by risk-level thresholds.
- **GenAI Component** — Claude integrated as an AI assistant: advisors can consult it about student risk profiles and receive intervention suggestions.
- **CI/CD Pipeline** — Continuous deployment for iterative releases.
- **SPADIES-Compatible Reporting** — Output aligned with MEN reporting requirements.

---

## 3. Architecture & Design

> *To be delivered in Entrega 2 — Apr 8, 2025.*

---

## 4. Construction & Code

> *To be delivered in Entrega 3 — Apr 15, 2025.*

---

## 5. Testing & Quality

> *To be delivered in Entrega 3 — Apr 15, 2025.*

---

## 6. GenAI Usage

> *To be delivered in Entrega 4 — Apr 22, 2025.*

---

## 7. Ethical Considerations

> *To be delivered in Entrega 4 — Apr 22, 2025.*

---

## 8. Final Product

> *To be delivered — Apr 25, 2025.*

---

## References

1. [SPADIES — Estadísticas de Deserción (MEN, 2024)](https://www.mineducacion.gov.co/sistemasinfo/spadies/secciones/Estadisticas-de-desercion/)
2. [Ley 30/1992 — Higher Education](http://www.secretariasenado.gov.co/senado/basedoc/ley_0030_1992.html)
3. Ley 1581/2012 — Habeas Data
4. Ley 2307/2023 — Gratuidad
5. [How SPADIES improved outcomes in Colombia (EconStor, 2021)](https://www.econstor.eu/bitstream/10419/233065/1/1753935849.pdf)
6. [LEE Informe N°74 — Deserción en Educación Superior (U. Javeriana, 2023, PDF)](https://www.javeriana.edu.co/recursosdb/5581483/8102914/INFORME-74-DESERCIO%CC%81N-EDU-SUPERIOR2023.pdf)

[1]: https://www.mineducacion.gov.co/sistemasinfo/spadies/secciones/Estadisticas-de-desercion/
[2]: http://www.secretariasenado.gov.co/senado/basedoc/ley_0030_1992.html
[5]: https://www.econstor.eu/handle/10419/233065
[6]: https://www.javeriana.edu.co/recursosdb/5581483/8102914/INFORME-74-DESERCIO%CC%81N-EDU-SUPERIOR2023.pdf
