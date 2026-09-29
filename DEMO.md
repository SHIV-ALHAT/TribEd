# TribEd SIH 2026 Presentation & Demonstration Script

---

## 🎯 Purpose of Demo
To prove that TribEd is a functional orchestration layer that prevents unjust scholarship rejections through automated verification, smart deficiency detection, and human-in-the-loop exception handling.

---

## ⏱️ Exact 5-Minute Demo Flow

### Step 1: Open the Application & Profile Overview (0:00 - 0:45)
1. Launch the web app (`http://localhost:3000`).
2. Point out the government-grade design: Ministry of Tribal Affairs (MoTA) branding, trilingual toggle (English, हिन्दी, मराठी), and persona selector.
3. Observe **Asha Patil's Profile**: Scheduled Tribe (Bhil Tribe), B.Tech 3rd Year at *Demo Institute of Technology*, Annual Family Income ₹2,40,000.

### Step 2: Scholarship Discovery & Pre-Screening (0:45 - 1:30)
1. Click the **"Scholarships"** tab.
2. Note the **Pre-Screening Engine**: It compares Asha's profile against the 5 MoTA schemes.
3. Expand **Post-Matric Scholarship for ST Students**: Show the 100% criteria match (Category: PASS, Education: PASS, Income: ₹2.40L <= ₹2.50L).
4. Highlight that TribEd responsibly displays *"Potentially Applicable"* instead of deceptively claiming official eligibility before statutory verification.

### Step 3: Application & The Intentional Verification Mismatch (1:30 - 2:30)
1. Click the **"My Applications"** tab (Application ID: `MOTA-2026-ST-1042`).
2. Show the **Multi-Source Verification Engine**:
   - `Check 1: Identity` -> PASS (UIDAI Sandbox e-KYC)
   - `Check 2: ST Category` -> PASS (State e-District Maharashtra)
   - `Check 3: Income` -> PASS (State Revenue ₹2.40L)
   - `Check 4: Academic` -> PASS (APAAR Sem 4 marksheet)
   - `Check 5: Institution` -> **REVIEW_REQUIRED** (AISHE Registry flags annual affiliation sync pending; attached bonafide was from AY 2024-25).
3. **The Core Differentiator:** In traditional portals, this application would be silently rejected or frozen for months. In TribEd, it automatically enters the **Deficiency Workflow**.

### Step 4: JAGO Assistance & Remediation (2:30 - 3:30)
1. Click **"Ask JAGO"** or open the JAGO tab.
2. In Hindi or English, ask: *"Why is my application flagged?"*
3. Show that JAGO explains the exact issue: *"Your college bonafide certificate corresponds to AY 2024-25. Please upload the current AY 2026-27 certificate."*
4. Return to the application screen and click **"Upload AY 2026-27 Bonafide"**.
5. Click **"Rerun Automated Verification"**: Watch Check 5 turn green (`PASS`) and status become `VERIFIED`!

### Step 5: Verifier Queue & DBT Sanction (3:30 - 4:30)
1. In the top bar, switch the view to **"Verifier Queue"** (or switch persona to Suresh Rao).
2. Show the **Human-in-the-Loop Inspection Console**: The verifier sees the student claim side-by-side with the mock AISHE registry data.
3. Show the **Audit Trail**: Every action is cryptographically logged with actor, entity ID, and timestamp.
4. Issue the **Sanction Order** for ₹48,000.
5. In the **"DBT & Payments"** tab, click **"Simulate APBS / DBT Clearance"** to demonstrate the automated transfer to Asha's Aadhaar-seeded bank account.

### Step 6: Android Mobile App View (4:30 - 5:00)
1. Switch to **"Android App"** mode.
2. Demonstrate the native 4-tab mobile experience (Home, Schemes, JAGO, Profile) showing that the student can monitor their entire scholarship journey on mobile in low-connectivity tribal areas.
