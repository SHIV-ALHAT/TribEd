# TribEd (ट्राइबएड)
## Unified Scholarship Orchestration Platform for Tribal Students
### Ministry of Tribal Affairs (MoTA), Government of India
**Smart India Hackathon (SIH 2026)** | **Problem Statement:** SIH26238 | **Theme:** Smart Automation

---

## 📌 Executive Summary
TribEd is a production-grade, demo-ready orchestration layer built to solve the fragmentation, high rejection rates, and communication opacity faced by Scheduled Tribe (ST) students applying for central and state scholarships. 

**Core Product Principle:** TribEd does **not** seek to replace existing sovereign systems (such as NSP, DigiLocker, APAAR, UIDAI, AISHE, and PFMS). Instead, it acts as a unified student experience and automation bridge around them via clean **Sandbox Adapters**.

---

## 🌟 Key Differentiators
1. **Unified Student Experience:** Single identity across mobile (Flutter) and web (React/Express/FastAPI), pre-populating attributes and certificates.
2. **Rule-Based Eligibility Pre-Screening:** Transparent criteria engine matching 5 MoTA schemes, displaying exact reasons and needed verifications without deceptive claims of official approval.
3. **Automated Multi-Layer Verification:** Orchestrates identity, caste certificate, income ceiling, academic credits, and institution affiliation checks.
4. **Human-in-the-Loop Deficiency Workflow:** When discrepancies occur (such as an institution affiliation sync pending), applications are **never** rejected blindly; they enter a deficiency remediation flow with instant student alerting.
5. **JAGO Multilingual Assistant:** Scholarship guide answering questions in English, Hindi, and Marathi with strict factual grounding in structured backend data (never hallucinating status or funds).
6. **Direct Beneficiary Transfer (DBT) Visibility:** End-to-end state machine tracking sanction orders and Aadhaar Payment Bridge System (APBS) credits.
7. **Sovereign Audit Trail:** Cryptographically recorded, timestamped audit log of all automated checks and verifier actions.

---

## 🏛️ Supported MoTA Schemes
1. **Pre-Matric Scholarship for ST Students (Classes IX & X)** (Up to ₹7,000/yr)
2. **Post-Matric Scholarship for ST Students** (Up to ₹48,000/yr)
3. **National Scholarship for Higher Education (Top Class Scheme)** (Up to ₹2,00,000/yr)
4. **National Fellowship for ST Students (NFST - M.Phil / Ph.D.)** (Up to ₹4,20,000/yr)
5. **National Overseas Scholarship for ST Candidates (NOS)** (Up to ₹18,00,000/yr)

---

## 📂 Repository Structure
```
├── src/                      # React + TypeScript Web Application & Mobile Simulator
│   ├── components/           # UI Components (Dashboard, Tracker, JAGO, Admin Queue, Wallet)
│   ├── data/                 # Centralized Scholarship Rules & Deterministic Seed Data
│   ├── services/             # Verification Engine, Eligibility Engine, JAGO, Mock Adapters, Store
│   └── types/                # Core TypeScript Interfaces
├── server.ts                 # Full-Stack Express Server (Port 3000) with REST API & Vite Middleware
├── backend/                  # Python + FastAPI Production Backend
│   ├── app/                  # FastAPI Routers, Models (SQLAlchemy), Schemas, Services
│   ├── tests/                # Pytest Test Suite (Eligibility, Verification, Deficiency)
│   ├── Dockerfile            # Container configuration
│   └── docker-compose.yml    # PostgreSQL + FastAPI container orchestration
├── mobile_flutter/           # Standalone Native Android (Flutter) Application
│   ├── lib/                  # Dart source (Main, Models, Screens)
│   └── pubspec.yaml          # Flutter dependencies
├── README.md                 # Project Overview & Quick Start
├── ARCHITECTURE.md           # System Architecture & Adapter Design
├── SETUP.md                  # Local Development & Deployment Instructions
├── API.md                    # REST API Endpoints Documentation
├── DEMO.md                   # Step-by-Step SIH 2026 Evaluation Script
└── SECURITY.md               # Data Minimization, DPDP Act 2023, & Prototype Security
```

---

## 🚀 Quick Run (Web Prototype)
The interactive full-stack web application runs directly on Port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access:
- **Student Web Portal:** Asha Patil's dashboard, scholarship discovery, and document wallet.
- **Admin & Verifier Queue:** Exception review console to inspect mismatches and approve.
- **Android Mobile App View:** Interactive simulation of the native Flutter Android mobile app.

---

## 👥 Demo Personas & Credentials
- **Student:** Asha Patil (`asha.patil@demo.ac.in`) · ST (Bhil Tribe) · B.Tech 3rd Year · Maharashtra
- **Verifier:** Suresh Rao (`verifier.mota@tribed.gov.in`) · Ministry Verification Officer
- **Admin:** Dr. Ananya Sharma (`admin.tribed@mota.gov.in`) · MoTA Scheme Director
*(One-click persona switcher available in top header).*
