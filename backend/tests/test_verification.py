"""
Unit Tests: Automated Rule-Based Verification Engine
Tests the intentional institution mismatch and subsequent resolution.
"""

from types import SimpleNamespace
from app.services.verification_engine import run_verification_pipeline
from app.adapters.mock_adapters import mock_institution

def test_intentional_mismatch_creates_deficiency():
    mock_institution.set_has_updated_bonafide(False)

    student = SimpleNamespace(
        id="STUDENT-ASHA-001",
        full_name="Asha Patil",
        category="ST",
        sub_tribe="Bhil",
        synthetic_aadhaar_ref="XXXXXXXX4892",
        family_annual_income=240000.0,
        course_name="B.Tech in Computer Engineering",
        current_year=3,
        institution_code="AISHE-C-49210",
        apaar_id="APAAR-2024-MH-9941"
    )

    application = SimpleNamespace(id="MOTA-2026-ST-1042")
    documents = [
        SimpleNamespace(type="ST_CERTIFICATE", title="ST Caste Cert"),
        SimpleNamespace(type="INCOME_CERTIFICATE", title="Income Cert"),
        SimpleNamespace(type="BONAFIDE_CERTIFICATE", title="College Bonafide (AY 2024-25)")
    ]

    res = run_verification_pipeline(student, application, documents)
    assert res["overall_status"] == "REVIEW_REQUIRED"
    assert res["has_deficiency"] is True
    assert res["deficiency_payload"]["check_type"] == "INSTITUTION"

    # Find the institution check
    inst_check = next(c for c in res["checks"] if c["check_type"] == "INSTITUTION")
    assert inst_check["status"] == "REVIEW_REQUIRED"

def test_updated_bonafide_passes_verification():
    mock_institution.set_has_updated_bonafide(True)

    student = SimpleNamespace(
        id="STUDENT-ASHA-001",
        full_name="Asha Patil",
        category="ST",
        sub_tribe="Bhil",
        synthetic_aadhaar_ref="XXXXXXXX4892",
        family_annual_income=240000.0,
        course_name="B.Tech in Computer Engineering",
        current_year=3,
        institution_code="AISHE-C-49210",
        apaar_id="APAAR-2024-MH-9941"
    )

    application = SimpleNamespace(id="MOTA-2026-ST-1042")
    documents = [
        SimpleNamespace(type="ST_CERTIFICATE", title="ST Caste Cert"),
        SimpleNamespace(type="INCOME_CERTIFICATE", title="Income Cert"),
        SimpleNamespace(type="BONAFIDE_CERTIFICATE", title="Current Academic Year 2026-27 Bonafide Certificate")
    ]

    res = run_verification_pipeline(student, application, documents)
    assert res["overall_status"] == "PASS"
    assert res["has_deficiency"] is False

    inst_check = next(c for c in res["checks"] if c["check_type"] == "INSTITUTION")
    assert inst_check["status"] == "PASS"
