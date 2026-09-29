"""
Mock Adapters for Sovereign Government Integration Layer (FastAPI Backend)
Connects cleanly to UIDAI, DigiLocker, APAAR, AISHE, and PFMS sandbox environments.
"""

from typing import Dict, Any, List

class MockIdentityAdapter:
    def verify_aadhaar_demographics(self, synthetic_ref: str, student_name: str) -> Dict[str, Any]:
        return {
            "matched": True,
            "confidence_score": 0.998,
            "auth_provider": "UIDAI Demo e-KYC Sandbox",
            "details": f"Demographic match verified for student '{student_name}'."
        }

class MockDigiLockerAdapter:
    def verify_certificate_signature(self, document_number: str) -> Dict[str, Any]:
        return {
            "is_valid": True,
            "digital_signature_issuer": "National Informatics Centre (NIC) CA for Maharashtra e-District",
            "timestamp": "2026-08-12T14:32:05Z"
        }

class MockAcademicRecordAdapter:
    def verify_student_academic_status(self, apaar_id: str, claimed_course: str) -> Dict[str, Any]:
        return {
            "is_enrolled": True,
            "verified_institution": "Demo Institute of Technology",
            "verified_course": claimed_course,
            "current_semester": 5,
            "cgpa_percentage": 84.0
        }

class MockInstitutionAdapter:
    def __init__(self):
        self.has_updated_bonafide = False

    def set_has_updated_bonafide(self, val: bool):
        self.has_updated_bonafide = val

    def verify_institution_affiliation(self, aishe_code: str, academic_year: str) -> Dict[str, Any]:
        if self.has_updated_bonafide:
            return {
                "is_recognized": True,
                "institution_name": "Demo Institute of Technology",
                "state_dte_sync_status": "SYNCED",
                "notes": "Updated institutional bonafide & AY 2026-27 affiliation endorsement validated successfully."
            }
        return {
            "is_recognized": True,
            "institution_name": "Demo Institute of Technology",
            "state_dte_sync_status": "AUDIT_PENDING",
            "notes": "AISHE repository flags Demo Institute of Technology affiliation verification for AY 2026-27 under review. Updated bonafide required."
        }

class MockPaymentAdapter:
    def initiate_dbt(self, application_id: str, amount: float) -> Dict[str, Any]:
        return {
            "transaction_ref": f"PFMS-MOTA-2026-{application_id.split('-')[-1]}",
            "status": "PROCESSING",
            "channel": "Aadhaar Payment Bridge System (APBS - NPCI)"
        }

mock_identity = MockIdentityAdapter()
mock_digilocker = MockDigiLockerAdapter()
mock_academic = MockAcademicRecordAdapter()
mock_institution = MockInstitutionAdapter()
mock_payment = MockPaymentAdapter()
