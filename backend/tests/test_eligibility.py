"""
Unit Tests: Eligibility Pre-Screening Engine
"""

from types import SimpleNamespace
from app.services.eligibility_engine import evaluate_eligibility

def test_asha_patil_post_matric_eligibility():
    student = SimpleNamespace(
        category="ST",
        family_annual_income=240000.0,
        current_education_level="Undergraduate",
        sub_tribe="Bhil"
    )

    scholarship = SimpleNamespace(
        id="SCHEME-POST-MATRIC",
        name="Post-Matric Scholarship for ST Students",
        rule=SimpleNamespace(
            applicable_categories=["ST"],
            max_income_ceiling=250000.0,
            min_education_level="Higher Secondary",
            max_education_level="Postgraduate"
        )
    )

    res = evaluate_eligibility(student, scholarship)
    assert res["is_potentially_applicable"] is True
    assert res["match_percentage"] == 100
    assert len(res["unmet_criteria"]) == 0

def test_income_exceeded_ineligibility():
    student = SimpleNamespace(
        category="ST",
        family_annual_income=450000.0,
        current_education_level="Undergraduate",
        sub_tribe="Bhil"
    )

    scholarship = SimpleNamespace(
        id="SCHEME-POST-MATRIC",
        name="Post-Matric Scholarship for ST Students",
        rule=SimpleNamespace(
            applicable_categories=["ST"],
            max_income_ceiling=250000.0,
            min_education_level="Higher Secondary",
            max_education_level="Postgraduate"
        )
    )

    res = evaluate_eligibility(student, scholarship)
    assert res["is_potentially_applicable"] is False
    assert any("exceeds limit" in c for c in res["unmet_criteria"])
