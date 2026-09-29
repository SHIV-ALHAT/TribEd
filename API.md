# TribEd REST API Specification

---

## 1. System Health
- **`GET /api/health`**
  - Returns backend status and connected sandbox adapters.

## 2. Authentication & User Management
- **`GET /api/auth/me`**
  - Fetches the active demo session user.
- **`POST /api/auth/switch-user`**
  - Switches between `student`, `verifier`, and `admin` personas.

## 3. Students & Discovery
- **`GET /api/students/{id}`**
  - Retrieves student demographics, caste category, and bank details.
- **`GET /api/scholarships`**
  - Lists the 5 centrally sponsored MoTA scholarship schemes.
- **`POST /api/eligibility/screen`**
  - Evaluates student profile against scheme rules and returns match percentages.

## 4. Applications & Verification
- **`GET /api/applications`**
  - Returns applications with status and verification checks.
- **`POST /api/applications`**
  - Submits a new scholarship application.
- **`POST /api/applications/{id}/verify`**
  - Runs the 5-check automated verification pipeline.
- **`POST /api/applications/{id}/deficiency/resolve`**
  - Submits the corrected AY 2026-27 Bonafide certificate.
- **`POST /api/applications/{id}/admin/action`**
  - Records a human verifier decision (`APPROVE`, `REQUEST_CORRECTION`, `REJECT`).
- **`POST /api/applications/{id}/sanction`**
  - Approves a ministry sanction order for the verified application.
- **`POST /api/applications/{id}/disburse`**
  - Triggers PFMS / APBS direct beneficiary transfer credit.

## 5. JAGO Knowledge Assistant
- **`POST /api/jago/chat`**
  - Payload: `{"message": "...", "language": "en|hi|mr"}`
  - Returns structured grounded reply and follow-up chips.

## 6. Audit Trail & Demo Reset
- **`GET /api/audit-logs`**
  - Returns immutable log of system events.
- **`POST /api/demo/reset`**
  - Resets all data back to the initial intentional deficiency state.
