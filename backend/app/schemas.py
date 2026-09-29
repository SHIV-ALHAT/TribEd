from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True

class StudentProfileOut(BaseModel):
    id: str
    user_id: str
    full_name: str
    date_of_birth: str
    gender: str
    category: str
    sub_tribe: str
    synthetic_aadhaar_ref: str
    apaar_id: Optional[str] = None
    state_of_domicile: str
    district: str
    pincode: str
    family_annual_income: float
    income_certificate_no: str
    caste_certificate_no: str
    current_education_level: str
    course_name: str
    current_year: int
    institution_name: str
    institution_code: str
    bank_account_masked: str
    bank_ifsc: str
    aadhaar_seeded_bank: bool

    class Config:
        from_attributes = True

class ScholarshipRuleOut(BaseModel):
    min_education_level: str
    max_education_level: str
    max_income_ceiling: float
    applicable_categories: List[str]
    minimum_marks_percent: Optional[float] = None
    eligible_institutions_type: str
    mandatory_documents: List[str]

    class Config:
        from_attributes = True

class ScholarshipOut(BaseModel):
    id: str
    code: str
    name: str
    hindi_name: Optional[str] = None
    marathi_name: Optional[str] = None
    ministry: str
    description: str
    annual_benefit_max: float
    benefits_description: str
    deadline_date: str
    target_beneficiaries: str
    rule: Optional[ScholarshipRuleOut] = None

    class Config:
        from_attributes = True

class VerificationCheckOut(BaseModel):
    id: str
    check_type: str
    name: str
    status: str
    adapter_used: str
    details: str
    mismatch_reason: Optional[str] = None
    matched_values: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class DeficiencyOut(BaseModel):
    id: str
    application_id: str
    check_type: str
    issue_title: str
    issue_description: str
    required_action: str
    status: str
    resolution_notes: Optional[str] = None

    class Config:
        from_attributes = True

class ApplicationOut(BaseModel):
    id: str
    student_id: str
    scheme_id: str
    scheme_name: str
    applied_date: str
    current_status: str
    status_reason: str
    attached_document_ids: List[str]
    sanction_amount: Optional[float] = None
    sanction_order_number: Optional[str] = None
    verification_checks: List[VerificationCheckOut] = []
    deficiencies: List[DeficiencyOut] = []

    class Config:
        from_attributes = True

class ApplicationCreate(BaseModel):
    student_id: str
    scheme_id: str
    scheme_name: Optional[str] = None

class DocumentOut(BaseModel):
    id: str
    student_id: str
    type: str
    title: str
    document_number: str
    source: str
    verified_status: str
    issuer: str
    issued_date: str
    synthetic_hash: str
    file_size: str

    class Config:
        from_attributes = True

class PaymentOut(BaseModel):
    id: str
    application_id: str
    student_id: str
    student_name: str
    scheme_name: str
    amount: float
    state: str
    pfms_transaction_id: Optional[str] = None
    dbt_payment_mode: str
    masked_account: str
    sanction_date: Optional[str] = None
    disbursed_date: Optional[str] = None
    remarks: Optional[str] = None

    class Config:
        from_attributes = True

class NotificationOut(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str
    link_route: Optional[str] = None
    is_read: bool

    class Config:
        from_attributes = True

class AuditLogOut(BaseModel):
    id: str
    actor: str
    actor_role: str
    action: str
    entity_type: str
    entity_id: str
    details: str

    class Config:
        from_attributes = True

class JagoQuery(BaseModel):
    message: str
    language: Optional[str] = "en"

class JagoResponseOut(BaseModel):
    message: str
    intent: str
    action_suggestions: List[str] = []
    factual_context: Optional[str] = None
