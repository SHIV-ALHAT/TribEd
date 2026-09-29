# TribEd Architecture & Design Document
## Ministry of Tribal Affairs (MoTA) Orchestration Layer

---

## 1. Architectural Philosophy
TribEd operates on the core principle of **Sovereign Interoperability**. Indian scholarship administration involves multiple distinct authority systems:
- **UIDAI:** Demographics and biometric authentication tokens
- **DigiLocker / State e-District:** Issued Caste and Income certificates with digital signatures
- **APAAR / Academic Bank of Credits (ABC):** Official higher-education credits and enrollments
- **AISHE / UDISE+:** Master registry of accredited colleges and schools
- **PFMS / NPCI:** Public Financial Management System and Aadhaar Payment Bridge System (APBS)

TribEd does not attempt to displace these systems; it orchestrates the student journey between them through standard **Adapter Interfaces**.

---

## 2. Component Diagram
```
                     +----------------------------------+
                     |       Student Interaction        |
                     |  (Android Flutter / Web React)   |
                     +-----------------+----------------+
                                       |
                                       v
                     +----------------------------------+
                     |    TribEd Orchestration Layer    |
                     |       (FastAPI / Express)        |
                     +--+--------+--------+--------+----+
                        |        |        |        |
         +--------------+        |        |        +---------------+
         |                       |        |                        |
         v                       v        v                        v
+-----------------+      +-------------+ +-------------+  +-----------------+
| IdentityAdapter |      | DigiLocker  | | Institution |  | PaymentAdapter  |
|  (UIDAI e-KYC)  |      |   Adapter   | |   Adapter   |  |  (PFMS / APBS)  |
+-----------------+      +-------------+ +-------------+  +-----------------+
         |                       |              |                  |
         v                       v              v                  v
[UIDAI Sandbox Vault]  [e-District Records] [AISHE DB]     [NPCI APBS Switch]
```

---

## 3. Data Flow & Verification Pipeline
1. **Student Registration / Profile Analysis:** Profile attributes are screened against the centralized `ScholarshipRule` schema.
2. **Document Ingestion:** Reusable digital documents are pulled from DigiLocker or uploaded.
3. **Application Submission:** A new application entity is created in `SUBMITTED` state.
4. **Automated Verification:** The engine runs 5 concurrent checks:
   - `IDENTITY`: Demographics check against UIDAI token.
   - `ST_CATEGORY`: Caste certificate validation against State e-District database.
   - `INCOME`: Income ceiling check (₹2.40L <= ₹2.50L).
   - `ACADEMIC`: APAAR progression confirmation.
   - `INSTITUTION`: AISHE master database affiliation check.
5. **Exception Handling:** If a mismatch is detected (e.g., outdated AY 2024-25 Bonafide vs pending state DTE sync), the status transitions to `DEFICIENCY_NOTED`.
6. **Remediation:** The student receives an in-app notification; JAGO explains the exact issue; student uploads AY 2026-27 Bonafide.
7. **Resolution & Sanction:** Verification is rerun or approved by a human verifier; status transitions to `VERIFIED` -> `SANCTIONED` -> `DBT_DISBURSED`.
