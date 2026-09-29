"""
Rule-Based Eligibility Pre-Screening Engine (FastAPI Backend)
"""

from typing import Dict, Any, List

def evaluate_eligibility(student: Any, scholarship: Any) -> Dict[str, Any]:
    matched_criteria = []
    unmet_criteria = []
    score_points = 0
    total_points = 3

    # Category check
    if student.category in scholarship.rule.applicable_categories:
        score_points += 1
        matched_criteria.append("Scheduled Tribe category verified.")
    else:
        unmet_criteria.append("Category does not match ST reservation.")

    # Income check
    if student.family_annual_income <= scholarship.rule.max_income_ceiling:
        score_points += 1
        matched_criteria.append(
            f"Income ₹{student.family_annual_income:,.0f} complies with ceiling of ₹{scholarship.rule.max_income_ceiling:,.0f}."
        )
    else:
        unmet_criteria.append(
            f"Family income ₹{student.family_annual_income:,.0f} exceeds limit of ₹{scholarship.rule.max_income_ceiling:,.0f}."
        )

    # Education level check
    if student.current_education_level in ["Undergraduate", "Higher Secondary", "Postgraduate"]:
        score_points += 1
        matched_criteria.append(f"Education stage {student.current_education_level} matches criteria.")
    else:
        unmet_criteria.append("Education level does not match.")

    match_percent = round((score_points / total_points) * 100)
    is_applicable = len(unmet_criteria) == 0

    return {
        "scheme_id": scholarship.id,
        "scheme_name": scholarship.name,
        "is_potentially_applicable": is_applicable,
        "match_percentage": match_percent,
        "matched_criteria": matched_criteria,
        "unmet_criteria": unmet_criteria,
        "verification_needed": ["AISHE Affiliation", "DigiLocker Certified Signatures", "APBS Bank Seeding"]
    }
