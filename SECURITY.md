# TribEd Security & Privacy Architecture
## Compliance with the Digital Personal Data Protection (DPDP) Act 2023

---

## 1. Zero Real-World Data Principle
- **Synthetic Fixtures:** All student names, Aadhaar vaults, bank accounts, and certificate identifiers within this prototype are synthetic demo tokens.
- **No Aadhaar Storage:** Full 12-digit Aadhaar numbers are never collected, transmitted, or stored on application disks. All demographic checks communicate via masked vault tokens (`XXXXXXXX4892`).

## 2. Adapter Sandbox Boundary
- TribEd uses explicit `Adapter` contracts (`IdentityAdapter`, `DigiLockerAdapter`, `InstitutionAdapter`, `PaymentAdapter`).
- Production deployments swap sandbox connectors for authorized sovereign APIs with mTLS and PKI certificate pinning without modifying core business logic.

## 3. Sovereign Audit Trail & Immutable Logging
- Every automated check result, human exception approval, and DBT credit instruction is timestamped and immutably recorded in the `audit_logs` table.
- Verifier decisions require mandatory notes recorded alongside reviewer role metadata.

## 4. Role-Based Access Control (RBAC)
- Strict separation between `student` (beneficiary actions, consent, document uploads) and `verifier` / `admin` (exception approval, scheme definition, sanction order issuance).
