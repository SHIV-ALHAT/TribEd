"""
Deterministic Database Seed Script (FastAPI Backend)
Seeds Asha Patil, the 5 MoTA schemes, documents, application with deficiency, and payment.
"""

from app.database import SessionLocal, engine, Base
from app.models import (
    User, Student, Scholarship, ScholarshipRule, Application, Document,
    VerificationCheck, Deficiency, Payment, Notification, AuditLog
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.id == "USER-ASHA-001").first():
            print("Database already contains seed fixtures.")
            return

        # Users
        user_asha = User(
            id="USER-ASHA-001",
            name="Asha Patil",
            email="asha.patil@demo.ac.in",
            role="student",
            phone="+91 98765 43210"
        )
        user_verifier = User(
            id="USER-VERIFIER-001",
            name="Suresh Rao",
            email="verifier.mota@tribed.gov.in",
            role="verifier",
            phone="+91 94220 12345"
        )
        db.add_all([user_asha, user_verifier])

        # Primary Student
        student_asha = Student(
            id="STUDENT-ASHA-001",
            user_id="USER-ASHA-001",
            full_name="Asha Patil",
            date_of_birth="2004-06-14",
            gender="Female",
            category="ST",
            sub_tribe="Bhil",
            synthetic_aadhaar_ref="XXXXXXXX4892",
            apaar_id="APAAR-2024-MH-9941",
            state_of_domicile="Maharashtra",
            district="Nandurbar",
            pincode="425412",
            family_annual_income=240000.0,
            income_certificate_no="REV-MH-2025-INC-3391",
            caste_certificate_no="MH-CAST-2022-ST-88194",
            current_education_level="Undergraduate",
            course_name="B.Tech in Computer Engineering",
            current_year=3,
            institution_name="Demo Institute of Technology",
            institution_code="AISHE-C-49210",
            bank_account_masked="A/C Ending 6721",
            bank_ifsc="SBIN0001234",
            aadhaar_seeded_bank=True
        )
        db.add(student_asha)

        # 5 Scholarships
        schemes_data = [
            {
                "id": "SCHEME-PRE-MATRIC",
                "code": "pre_matric",
                "name": "Pre-Matric Scholarship for ST Students (Classes IX & X)",
                "hindi_name": "अनुसूचित जनजाति के छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति",
                "annual_benefit_max": 7000.0,
                "description": "Financial assistance to reduce drop-out rates in secondary school stage.",
                "benefits_description": "Day scholars: ₹3,500/year; Hostellers: ₹7,000/year.",
                "deadline_date": "2026-11-30",
                "target_beneficiaries": "ST students in Classes IX-X.",
                "min_ed": "Pre-Matric", "max_ed": "Pre-Matric", "income": 250000.0
            },
            {
                "id": "SCHEME-POST-MATRIC",
                "code": "post_matric",
                "name": "Post-Matric Scholarship for ST Students",
                "hindi_name": "अनुसूचित जनजाति के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति",
                "annual_benefit_max": 48000.0,
                "description": "Flagship scheme providing comprehensive financial support for post-secondary studies.",
                "benefits_description": "Covers tuition fees plus monthly hosteller maintenance allowance.",
                "deadline_date": "2026-12-15",
                "target_beneficiaries": "ST students admitted to recognized post-matric degree/diploma courses.",
                "min_ed": "Higher Secondary", "max_ed": "Postgraduate", "income": 250000.0
            },
            {
                "id": "SCHEME-TOP-CLASS",
                "code": "top_class",
                "name": "National Scholarship for Higher Education (Top Class Scheme)",
                "hindi_name": "शीर्ष श्रेणी के संस्थानों में उच्च शिक्षा हेतु राष्ट्रीय छात्रवृत्ति",
                "annual_benefit_max": 200000.0,
                "description": "Financial aid for ST students studying in 250+ notified premier institutes.",
                "benefits_description": "Full tuition fee reimbursement + ₹3,000/month living expenses.",
                "deadline_date": "2026-11-15",
                "target_beneficiaries": "ST students in IITs, NITs, IIMs, AIIMS, and NLUs.",
                "min_ed": "Undergraduate", "max_ed": "Postgraduate", "income": 600000.0
            },
            {
                "id": "SCHEME-NFST",
                "code": "nfst",
                "name": "National Fellowship for ST Students (NFST)",
                "hindi_name": "एसटी छात्रों के लिए राष्ट्रीय फैलोशिप (एम.फिल/पीएच.डी)",
                "annual_benefit_max": 420000.0,
                "description": "Supports 750 fresh ST scholars annually pursuing regular M.Phil. and Ph.D. degrees.",
                "benefits_description": "JRF: ₹31,000/month; SRF: ₹35,000/month + contingency grant.",
                "deadline_date": "2026-12-31",
                "target_beneficiaries": "ST scholars enrolled in full-time M.Phil/Ph.D. programs.",
                "min_ed": "Doctoral", "max_ed": "Doctoral", "income": 800000.0
            },
            {
                "id": "SCHEME-NOS",
                "code": "nos",
                "name": "National Overseas Scholarship for ST Candidates (NOS)",
                "hindi_name": "एसटी उम्मीदवारों के लिए राष्ट्रीय प्रवासी छात्रवृत्ति",
                "annual_benefit_max": 1800000.0,
                "description": "Financial assistance for meritorious ST students to pursue Master's/Ph.D. abroad.",
                "benefits_description": "Actual tuition fees + annual maintenance ($15,400) + air passage.",
                "deadline_date": "2026-10-31",
                "target_beneficiaries": "ST candidates admitted to top 500 QS world ranked universities.",
                "min_ed": "Postgraduate", "max_ed": "Doctoral", "income": 600000.0
            }
        ]

        for s_data in schemes_data:
            sch = Scholarship(
                id=s_data["id"],
                code=s_data["code"],
                name=s_data["name"],
                hindi_name=s_data["hindi_name"],
                annual_benefit_max=s_data["annual_benefit_max"],
                description=s_data["description"],
                benefits_description=s_data["benefits_description"],
                deadline_date=s_data["deadline_date"],
                target_beneficiaries=s_data["target_beneficiaries"]
            )
            rule = ScholarshipRule(
                id=f"RULE-{s_data['code'].upper()}",
                scholarship_id=s_data["id"],
                min_education_level=s_data["min_ed"],
                max_education_level=s_data["max_ed"],
                max_income_ceiling=s_data["income"],
                applicable_categories=["ST"],
                mandatory_documents=["ST_CERTIFICATE", "INCOME_CERTIFICATE", "BONAFIDE_CERTIFICATE"]
            )
            db.add(sch)
            db.add(rule)

        # Initial Documents for Asha
        docs = [
            Document(
                id="DOC-ST-001",
                student_id="STUDENT-ASHA-001",
                type="ST_CERTIFICATE",
                title="Scheduled Tribe Caste Certificate",
                document_number="MH-CAST-2022-ST-88194",
                source="DIGILOCKER",
                verified_status="VERIFIED",
                issuer="Sub-Divisional Officer (SDO), Nandurbar",
                issued_date="2022-07-18",
                synthetic_hash="sha256-demo-e8f192b10a"
            ),
            Document(
                id="DOC-INC-001",
                student_id="STUDENT-ASHA-001",
                type="INCOME_CERTIFICATE",
                title="Annual Family Income Certificate",
                document_number="REV-MH-2025-INC-3391",
                source="DIGILOCKER",
                verified_status="VERIFIED",
                issuer="Office of Tahasildar, Nandurbar",
                issued_date="2025-05-10",
                synthetic_hash="sha256-demo-72a391c491"
            ),
            Document(
                id="DOC-BONA-OLD",
                student_id="STUDENT-ASHA-001",
                type="BONAFIDE_CERTIFICATE",
                title="College Bonafide Certificate (AY 2024-25)",
                document_number="DIT-BONA-2024-912",
                source="MANUAL_UPLOAD",
                verified_status="FLAGGED",
                issuer="Demo Institute of Technology",
                issued_date="2024-08-01",
                synthetic_hash="sha256-demo-oldbonafide"
            )
        ]
        db.add_all(docs)

        # Application with Intentional Deficiency
        app_asha = Application(
            id="MOTA-2026-ST-1042",
            student_id="STUDENT-ASHA-001",
            scheme_id="SCHEME-POST-MATRIC",
            scheme_name="Post-Matric Scholarship for ST Students",
            applied_date="2026-08-12",
            current_status="DEFICIENCY_NOTED",
            status_reason="Automated verification completed with 1 deficiency: Institution Affiliation record requires confirmation.",
            attached_document_ids=["DOC-ST-001", "DOC-INC-001", "DOC-BONA-OLD"],
            sanction_amount=48000.0,
            sanction_order_number="MOTA/ST-SCHOL/2026/MAH/8491"
        )
        db.add(app_asha)

        def_obj = Deficiency(
            id="DEF-2026-01",
            application_id="MOTA-2026-ST-1042",
            check_type="INSTITUTION",
            issue_title="Current Year Bonafide Certificate Required",
            issue_description="Application contains an outdated AY 2024-25 Bonafide. Please upload current AY 2026-27 Bonafide.",
            required_action="Upload updated Bonafide Certificate for Academic Year 2026-27",
            status="OPEN"
        )
        db.add(def_obj)

        pay_obj = Payment(
            id="PAY-MOTA-1042",
            application_id="MOTA-2026-ST-1042",
            student_id="STUDENT-ASHA-001",
            student_name="Asha Patil",
            scheme_name="Post-Matric Scholarship for ST Students",
            amount=48000.0,
            state="SANCTIONED",
            pfms_transaction_id="PFMS-MOTA-2026-9021",
            masked_account="SBI A/C Ending 6721",
            sanction_date="2026-08-15",
            remarks="Sanction order approved for ₹48,000."
        )
        db.add(pay_obj)

        audit_log = AuditLog(
            id="AUD-001",
            actor="RuleEngine v2.4 (Automated Service)",
            actor_role="SYSTEM",
            action="DEFICIENCY_GENERATED",
            entity_type="DEFICIENCY",
            entity_id="DEF-2026-01",
            details="Flagged mismatch between submitted bonafide date (AY 2024-25) and required active enrollment term."
        )
        db.add(audit_log)

        db.commit()
        print("Database deterministic seed completed successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
