from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)  # 'student', 'verifier', 'admin'
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student_profile = relationship("Student", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    category = Column(String, default="ST")
    sub_tribe = Column(String, nullable=False)
    synthetic_aadhaar_ref = Column(String, nullable=False)
    apaar_id = Column(String, nullable=True)
    state_of_domicile = Column(String, nullable=False)
    district = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    family_annual_income = Column(Float, nullable=False)
    income_certificate_no = Column(String, nullable=False)
    caste_certificate_no = Column(String, nullable=False)
    current_education_level = Column(String, nullable=False)
    course_name = Column(String, nullable=False)
    current_year = Column(Integer, nullable=False)
    institution_name = Column(String, nullable=False)
    institution_code = Column(String, nullable=False)
    bank_account_masked = Column(String, nullable=False)
    bank_ifsc = Column(String, nullable=False)
    aadhaar_seeded_bank = Column(Boolean, default=True)

    user = relationship("User", back_populates="student_profile")
    applications = relationship("Application", back_populates="student")
    documents = relationship("Document", back_populates="student")

class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(String, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    hindi_name = Column(String, nullable=True)
    marathi_name = Column(String, nullable=True)
    ministry = Column(String, default="Ministry of Tribal Affairs, Govt. of India")
    description = Column(Text, nullable=False)
    annual_benefit_max = Column(Float, nullable=False)
    benefits_description = Column(Text, nullable=False)
    deadline_date = Column(String, nullable=False)
    target_beneficiaries = Column(Text, nullable=False)

    rule = relationship("ScholarshipRule", back_populates="scholarship", uselist=False)
    applications = relationship("Application", back_populates="scholarship")

class ScholarshipRule(Base):
    __tablename__ = "scholarship_rules"

    id = Column(String, primary_key=True, index=True)
    scholarship_id = Column(String, ForeignKey("scholarships.id"), nullable=False)
    min_education_level = Column(String, nullable=False)
    max_education_level = Column(String, nullable=False)
    max_income_ceiling = Column(Float, nullable=False)
    applicable_categories = Column(JSON, default=["ST"])
    minimum_marks_percent = Column(Float, nullable=True)
    eligible_institutions_type = Column(String, default="All_Recognized")
    mandatory_documents = Column(JSON, default=[])

    scholarship = relationship("Scholarship", back_populates="rule")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    scheme_id = Column(String, ForeignKey("scholarships.id"), nullable=False)
    scheme_name = Column(String, nullable=False)
    applied_date = Column(String, nullable=False)
    current_status = Column(String, nullable=False)
    status_reason = Column(Text, nullable=False)
    attached_document_ids = Column(JSON, default=[])
    sanction_amount = Column(Float, nullable=True)
    sanction_order_number = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="applications")
    scholarship = relationship("Scholarship", back_populates="applications")
    verification_checks = relationship("VerificationCheck", back_populates="application")
    deficiencies = relationship("Deficiency", back_populates="application")
    payments = relationship("Payment", back_populates="application")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    document_number = Column(String, nullable=False)
    source = Column(String, default="DIGILOCKER")
    verified_status = Column(String, default="VERIFIED")
    issuer = Column(String, nullable=False)
    issued_date = Column(String, nullable=False)
    synthetic_hash = Column(String, nullable=False)
    file_size = Column(String, default="350 KB")

    student = relationship("Student", back_populates="documents")

class VerificationCheck(Base):
    __tablename__ = "verification_checks"

    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    check_type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    adapter_used = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    mismatch_reason = Column(Text, nullable=True)
    matched_values = Column(JSON, nullable=True)
    checked_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="verification_checks")

class Deficiency(Base):
    __tablename__ = "deficiencies"

    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    check_type = Column(String, nullable=False)
    issue_title = Column(String, nullable=False)
    issue_description = Column(Text, nullable=False)
    required_action = Column(Text, nullable=False)
    status = Column(String, default="OPEN")
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    resolution_notes = Column(Text, nullable=True)

    application = relationship("Application", back_populates="deficiencies")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    student_id = Column(String, nullable=False)
    student_name = Column(String, nullable=False)
    scheme_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    state = Column(String, default="SANCTIONED")
    pfms_transaction_id = Column(String, nullable=True)
    dbt_payment_mode = Column(String, default="Aadhaar_Payment_Bridge_System")
    masked_account = Column(String, nullable=False)
    sanction_date = Column(String, nullable=True)
    processing_date = Column(String, nullable=True)
    disbursed_date = Column(String, nullable=True)
    remarks = Column(Text, nullable=True)

    application = relationship("Application", back_populates="payments")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info")
    link_route = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    actor = Column(String, nullable=False)
    actor_role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    details = Column(Text, nullable=False)
