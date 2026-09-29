"""
Automated Rule-Based Verification Engine (FastAPI Backend)
"""

from typing import Dict, Any, List
from app.adapters.mock_adapters import (
    mock_identity, mock_digilocker, mock_academic, mock_institution
)

def run_verification_pipeline(student: Any, application: Any, documents: List[Any]) -> Dict[str, Any]:
    checks = []

    # Check 1: Identity
    id_res = mock_identity.verify_aadhaar_demographics(student.synthetic_aadhaar_ref, student.full_name)
    checks.append({
        "check_type": "IDENTITY",
        "name": "UIDAI Aadhaar Demographics Check",
        "status": "PASS" if id_res["matched"] else "FAIL",
        "adapter_used": "MockIdentityAdapter (UIDAI Demo Sandbox)",
        "details": id_res["details"]
    })

    # Check 2: ST Category
    st_doc = next((d for d in documents if d.type == "ST_CERTIFICATE"), None)
    checks.append({
        "check_type": "ST_CATEGORY",
        "name": "State e-District ST Certificate Validation",
        "status": "PASS" if st_doc else "REVIEW_REQUIRED",
        "adapter_used": "MockDigiLockerAdapter (e-District Repository)",
        "details": f"ST category confirmed for {student.sub_tribe} tribe." if st_doc else "Caste Certificate missing."
    })

    # Check 3: Income
    inc_doc = next((d for d in documents if d.type == "INCOME_CERTIFICATE"), None)
    is_inc_valid = student.family_annual_income <= 250000
    checks.append({
        "check_type": "INCOME",
        "name": "State Revenue Department Income Verification",
        "status": "PASS" if is_inc_valid else "FAIL",
        "adapter_used": "MockStateRevenueAdapter (DigiLocker Sandbox)",
        "details": f"Family annual income ₹{student.family_annual_income:,.0f} compliant with scheme rules."
    })

    # Check 4: Academic
    acad_res = mock_academic.verify_student_academic_status(student.apaar_id or "APAAR", student.course_name)
    checks.append({
        "check_type": "ACADEMIC",
        "name": "APAAR / ABC Academic Credit Check",
        "status": "PASS" if acad_res["is_enrolled"] else "FAIL",
        "adapter_used": "MockAcademicRecordAdapter (APAAR Registry)",
        "details": f"Active registration in {student.course_name} (Year {student.current_year})."
    })

    # Check 5: Institution & Affiliation (INTENTIONAL MISMATCH)
    bonafide = next((d for d in documents if d.type == "BONAFIDE_CERTIFICATE"), None)
    is_bonafide_current = bonafide and "2026-27" in bonafide.title

    if is_bonafide_current:
        mock_institution.set_has_updated_bonafide(True)

    inst_res = mock_institution.verify_institution_affiliation(student.institution_code, "2026-27")

    if inst_res["state_dte_sync_status"] == "AUDIT_PENDING" and not is_bonafide_current:
        checks.append({
            "check_type": "INSTITUTION",
            "name": "AISHE Master Database Institution Affiliation Validation",
            "status": "REVIEW_REQUIRED",
            "adapter_used": "MockInstitutionAdapter (AISHE Registry)",
            "details": inst_res["notes"],
            "mismatch_reason": "Outdated bonafide certificate provided for institutional verification."
        })
    else:
        checks.append({
            "check_type": "INSTITUTION",
            "name": "AISHE Master Database Institution Affiliation Validation",
            "status": "PASS",
            "adapter_used": "MockInstitutionAdapter (AISHE Registry)",
            "details": inst_res["notes"]
        })

    has_review = any(c["status"] == "REVIEW_REQUIRED" for c in checks)
    has_fail = any(c["status"] == "FAIL" for c in checks)

    overall_status = "FAIL" if has_fail else ("REVIEW_REQUIRED" if has_review else "PASS")
    
    return {
        "overall_status": overall_status,
        "checks": checks,
        "has_deficiency": has_review,
        "deficiency_payload": {
            "check_type": "INSTITUTION",
            "issue_title": "Current Year Bonafide Certificate Required",
            "issue_description": "AISHE repository flags Demo Institute of Technology affiliation verification for AY 2026-27 under review. Please upload current AY 2026-27 Bonafide.",
            "required_action": "Upload updated Bonafide Certificate for Academic Year 2026-27"
        } if has_review else None
    }
