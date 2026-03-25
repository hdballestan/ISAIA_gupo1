# Problem Ideation Session

## Context

Asynchronous brainstorming to select the business problem the project will solve.

### Evaluation Criteria

- Real problem applicable to Colombia
- No widely available public solution
- Clear actors, business rules, and regulatory constraints
- Viable to build before April 25

### Suggested Areas (from course guide)

- Tax management (DIAN, ICA, withholdings, declarations)
- Enrollment and retention in public universities (SPADIES, dropout)
- Social subsidies and benefits (Sisbén, Colombia Mayor, Familias en Acción)
- Sectoral regulatory processes (health, construction, transportation)
- Internal administrative flows of public entities

---

## Ideas

### William

> Ideas generated with AI support

1. **Tax management assistant (DIAN / ICA)**
   - Help SMEs and independent workers understand their tax obligations, calculate withholdings, and prepare declarations.
   - Actors: taxpayers, DIAN, accountants.
   - Regulatory context: Tax Statute, DIAN resolutions.

2. **University dropout early warning system**
   - Detect students at risk of dropping out based on academic, economic, and social indicators, integrating with SPADIES.
   - Actors: students, academic advisors, financial aid offices.
   - Regulatory context: MEN policies, SPADIES reporting.

3. **Sisbén eligibility and benefits navigator**
   - Guide citizens through verifying their Sisbén score, understanding associated programs (Colombia Mayor, Familias en Acción), and filing corrections.
   - Actors: citizens, municipal offices, DNP.
   - Regulatory context: CONPES 150, Sisbén IV methodology.

4. **Construction permit tracker**
   - Track the status of construction permits and regulatory approvals with curadurías urbanas, automating document checklists.
   - Actors: builders, curadurías, planning offices.
   - Regulatory context: NSR-10, POT, Law 400/1997.

5. **Health regulatory compliance tool**
   - Assist clinics and pharmacies in managing INVIMA permits, health registries, and sanitary certifications.
   - Actors: health establishments, INVIMA, territorial health entities.
   - Regulatory context: Decree 677/1995, Resolution 1403/2007.

---

### Hever

1. **Unified certificate management portal**
   - Obtaining certificates in Colombia is fragmented and inconsistent. Simple ones (judicial background from the Policía Nacional) are accessible online, but others — such as certificates for crimes against minors (ICBF/Fiscalía) or certificates required for working with vulnerable populations — require navigating multiple portals, some only accessible through a VPN or with an institutional account.
   - **Pain point:** There is no single place to know which certificates you need for a specific purpose, where to request each one, what the requirements are, or what the current processing status is.
   - Actors: citizens, employers, educational institutions, Policía Nacional, ICBF, Fiscalía, Procuraduría.
   - Regulatory context: Law 1918/2018 (prohibition register for crimes against minors), Decree 19/2012 (anti-paperwork), data protection Law 1581/2012.

2. **Payment portal authenticity verifier**
   - Public service payment pages (EPM, ETB, Codensa, gas companies, etc.) are frequently spoofed by phishing sites that steal credentials and payment data from citizens who cannot easily distinguish the real site from the fake one.
   - **Pain point:** There is no lightweight, accessible tool that allows a non-technical user to verify in real time whether a payment portal is legitimate before entering sensitive information.
   - Actors: citizens, public service companies, CRC (Comisión de Regulación de Comunicaciones), CCI (Centro Cibernético de la Policía).
   - Regulatory context: Law 1273/2009 (cybercrime), SFC circulars on digital channels, CONPES 3995 (digital security policy).

---

### Cristhian

1. **Public procurement opportunity matcher (SECOP 3.0.)**
   - Help independent contractors navigate the public procurement platform (SECOP II) by translating technical UNSPSC codes into natural language business categories. The system uses NLP to scan "Planes Anuales de Adquisiciones" and tender documents, alerting users about relevant opportunities and summarizing key requirements (budget, eligibility, deadlines) that match their profile.
  - **Pain point:** Small businesses miss out on government contracts because they cannot translate their commercial services into the specific technical codes used by the state, nor do they have time to read hundreds of complex PDF tender documents.
   - Actors: SMEs, independent contractors, Colombia Compra Eficiente, public entities.
   - Regulatory context: Law 80/1993 (Public Contracting Statute), Decree 1082/2015, SECOP II resolutions.
   
2. **Traffic fine legality analyzer**
   - Assist citizens in verifying the validity of traffic tickets (comparendos) by analyzing scanned tickets against the National Traffic Code. Using OCR and rule-based AI, the tool detects procedural errors (e.g., wrong location, missing signatures, notification deadlines) and generates a draft appeal letter (recurso de reposición) based on valid legal arguments.
  - **Pain point:** There is a significant information asymmetry; citizens are unaware of their legal rights and procedures, often paying unjust fines because they do not know how to identify formal errors in the ticket or how to formulate a legal defense.
   - Actors: Drivers, Traffic Secretariats (local authorities), Ministry of Transport, Fondo de Prevención Vial.
   - Regulatory context: Law 769/2002 (National Traffic Code), Law 1843/2017, Constitutional Court rulings on due process.
---

### Andrés

## Project 1: Independent Contractor Social Security & Tax Compliance Engine (UGPP-Ready)

### Overview
Calculating social security contributions and taxes for independent contractors in Colombia is a significant administrative burden. The complexity arises from the 40% IBC (Income Base for Contributions) rule, varying ARL risk levels, and the specific deductible costs associated with different economic activities (CIIU codes).

### The Problem
Independent workers often miscalculate their contributions, leading to either overpayment or, more dangerously, severe financial penalties from the **UGPP** (*Unidad de Gestión Pensional y Parafiscales*) and the **DIAN**. There is no unified solution that connects a service contract’s value, the monthly invoice, and the exact generation of a PILA-ready liquidation.

### Pain Point
Contractors spend hours every month manually calculating "Net vs. Gross" income, trying to interpret the latest tax reforms, and fearing an audit because they cannot prove their cost deductions were legally applied under the "Presumptive Costs" scheme.

### Actors
* **Independent Contractors:** Users needing to calculate their monthly payments.
* **Freelance Accountants:** Professionals managing multiple contractor portfolios.
* **UGPP / DIAN:** Regulatory bodies (as the standard for compliance).
* **Social Security Operators (PILA):** External systems where the final payment is executed.

### Regulatory Context
* **Law 1955 of 2019:** IBC calculation rules for independent workers.
* **Decree 1601 of 2022:** New contribution standards for independents.
* **Resolution 209 of 2020:** UGPP Presumptive Cost Scheme.
* **Law 2277 of 2022:** Latest Colombian Tax Reform.

---

## Project 2: Public University "Gratuity Policy" Eligibility & Retention Auditor

### Overview
With the national implementation of the "Política de Gratuidad" (Zero Tuition), public universities face a massive administrative challenge: they must certify to the Ministry of Education (MEN) that every enrolled student meets strict socio-economic and academic criteria to receive state funding.

### The Problem
Verification is currently fragmented. Universities must cross-reference internal academic records with external databases (Sisbén IV, victim registries, and prior degree databases) to ensure a student isn't "double-dipping" or exceeding the allowed number of funded semesters. Failure to validate correctly results in the university losing the funding for that student.

### Pain Point
Manual auditing causes massive delays in enrollment cycles and high "financial desertion" risk. Furthermore, there is no automated system to predict which "Gratuity" students are at risk of losing their benefit due to academic failure, which would force them to pay out of pocket or drop out.

### Actors
* **University Registrars:** Administrators responsible for certifying students to the Ministry.
* **Students:** Beneficiaries who need to track their eligibility status.
* **Ministry of Education (MEN):** The funding entity.
* **DNP (Sisbén) / ICETEX:** External data providers for socio-economic validation.

### Regulatory Context
* **Law 2307 of 2023:** Gratuity in Higher Education (Zero Tuition Law).
* **Decree 1667 of 2021:** Establishment of the "Generación E" successor and gratuity rules.
* **Law 1740 of 2014:** Inspection and oversight of Higher Education in Colombia.

## Decision

- [ ] Vote / discussion pending — to be resolved by end of day **2026-03-24**
- Selected problem: _(to be filled in)_
