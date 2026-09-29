"""
TribEd FastAPI Application
Ministry of Tribal Affairs (MoTA) Orchestration API
"""

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db, engine, Base
from app.models import (
    User, Student, Scholarship, Application, Document, VerificationCheck,
    Deficiency, Payment, Notification, AuditLog
)
from app.schemas import (
    UserOut, StudentProfileOut, ScholarshipOut, ApplicationOut, ApplicationCreate,
    DocumentOut, PaymentOut, NotificationOut, AuditLogOut, JagoQuery, JagoResponseOut
)
from app.services.eligibility_engine import evaluate_eligibility
from app.services.verification_engine import run_verification_pipeline
from app.services.jago_service import process_jago_query
from app.adapters.mock_adapters import mock_institution

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TribEd - Ministry of Tribal Affairs Orchestration API",
    description="Unified Scholarship Mobile & Web Orchestration Platform for Tribal Students (SIH 2026)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "UP",
        "service": "TribEd-FastAPI-Orchestrator",
        "database": "PostgreSQL-Connected",
        "adapters": ["UIDAI", "DigiLocker", "APAAR", "AISHE", "PFMS"]
    }

@app.get("/api/users/me", response_model=UserOut)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.role == "student").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/students/{student_id}", response_model=StudentProfileOut)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.get("/api/scholarships", response_model=List[ScholarshipOut])
def get_scholarships(db: Session = Depends(get_db)):
    return db.query(Scholarship).all()

@app.post("/api/eligibility/screen")
def screen_scholarships(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    scholarships = db.query(Scholarship).all()
    results = [evaluate_eligibility(student, s) for s in scholarships]
    return {"student_id": student_id, "screened_schemes": results}

@app.get("/api/applications", response_model=List[ApplicationOut])
def get_applications(student_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Application)
    if student_id:
        query = query.filter(Application.student_id == student_id)
    return query.all()

@app.get("/api/applications/{app_id}", response_model=ApplicationOut)
def get_application(app_id: str, db: Session = Depends(get_db)):
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")
    return app_obj

@app.post("/api/applications", response_model=ApplicationOut)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    app_id = f"MOTA-2026-ST-{hash(payload.student_id + payload.scheme_id) % 9000 + 1000}"
    new_app = Application(
        id=app_id,
        student_id=payload.student_id,
        scheme_id=payload.scheme_id,
        scheme_name=payload.scheme_name or "Post-Matric Scholarship for ST Students",
        applied_date="2026-08-12",
        current_status="SUBMITTED",
        status_reason="Submitted by student. Queued for automated rule verification.",
        attached_document_ids=[]
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@app.post("/api/applications/{app_id}/verify")
def run_verification(app_id: str, db: Session = Depends(get_db)):
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")

    student = db.query(Student).filter(Student.id == app_obj.student_id).first()
    docs = db.query(Document).filter(Document.student_id == app_obj.student_id).all()

    pipeline_result = run_verification_pipeline(student, app_obj, docs)

    # Save checks
    for check in pipeline_result["checks"]:
        db_check = VerificationCheck(
            id=f"CHK-{check['check_type']}-{app_id}",
            application_id=app_id,
            check_type=check["check_type"],
            name=check["name"],
            status=check["status"],
            adapter_used=check["adapter_used"],
            details=check["details"],
            mismatch_reason=check.get("mismatch_reason")
        )
        db.merge(db_check)

    if pipeline_result["has_deficiency"]:
        app_obj.current_status = "DEFICIENCY_NOTED"
        app_obj.status_reason = "Automated verification completed with 1 deficiency: Institution Affiliation record requires confirmation."
        
        def_record = Deficiency(
            id=f"DEF-{app_id}",
            application_id=app_id,
            check_type="INSTITUTION",
            issue_title="Current Year Bonafide Certificate Required",
            issue_description="AISHE repository flags Demo Institute of Technology affiliation verification for AY 2026-27 under review.",
            required_action="Upload updated Bonafide Certificate for Academic Year 2026-27",
            status="OPEN"
        )
        db.merge(def_record)
    else:
        app_obj.current_status = "VERIFIED"
        app_obj.status_reason = "All statutory multi-source automated checks verified successfully."

    db.commit()
    return {"status": app_obj.current_status, "checks": pipeline_result["checks"]}

@app.post("/api/applications/{app_id}/deficiency/resolve")
def resolve_deficiency(app_id: str, db: Session = Depends(get_db)):
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")

    mock_institution.set_has_updated_bonafide(True)

    bonafide_doc = Document(
        id=f"DOC-BONA-2026-{app_id}",
        student_id=app_obj.student_id,
        type="BONAFIDE_CERTIFICATE",
        title="Current Academic Year 2026-27 Bonafide Certificate",
        document_number="DIT-REG-2026-BONA-4481",
        source="MANUAL_UPLOAD",
        verified_status="VERIFIED",
        issuer="Demo Institute of Technology (Dean Academic Office)",
        issued_date="2026-08-15",
        synthetic_hash="sha256-verified-bonafide-2026",
        file_size="480 KB"
    )
    db.merge(bonafide_doc)

    def_obj = db.query(Deficiency).filter(Deficiency.application_id == app_id).first()
    if def_obj:
        def_obj.status = "RESOLVED"
        def_obj.resolution_notes = "Updated Bonafide for AY 2026-27 submitted."

    app_obj.current_status = "CORRECTION_SUBMITTED"
    app_obj.status_reason = "Correction submitted by student with AY 2026-27 Bonafide Certificate. Ready for re-verification."

    db.commit()
    return {"success": True, "application_status": app_obj.current_status}

@app.post("/api/applications/{app_id}/sanction")
def sanction_application(app_id: str, amount: float = 48000, db: Session = Depends(get_db)):
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")

    student = db.query(Student).filter(Student.id == app_obj.student_id).first()
    order_no = f"MOTA/ST-SCHOL/2026/MAH/8491"
    
    app_obj.current_status = "SANCTIONED"
    app_obj.sanction_amount = amount
    app_obj.sanction_order_number = order_no
    app_obj.status_reason = f"Sanction Order {order_no} approved for ₹{amount:,.0f}."

    payment = Payment(
        id=f"PAY-{app_id}",
        application_id=app_id,
        student_id=student.id,
        student_name=student.full_name,
        scheme_name=app_obj.scheme_name,
        amount=amount,
        state="SANCTIONED",
        pfms_transaction_id="PFMS-MOTA-2026-9021",
        masked_account=student.bank_account_masked,
        sanction_date="2026-08-15",
        remarks="Sanction order approved. Bank credit instruction queued on PFMS."
    )
    db.merge(payment)
    db.commit()

    return {"application_id": app_id, "sanction_order": order_no, "amount": amount}

@app.post("/api/applications/{app_id}/disburse")
def disburse_dbt(app_id: str, db: Session = Depends(get_db)):
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    pay_obj = db.query(Payment).filter(Payment.application_id == app_id).first()

    if not app_obj or not pay_obj:
        raise HTTPException(status_code=404, detail="Application or Payment record not found")

    pay_obj.state = "PROCESSED"
    pay_obj.disbursed_date = "2026-08-16"
    pay_obj.remarks = "Amount credited to Aadhaar-linked Bank Account via APBS. UTR: SBIN2026901824."

    app_obj.current_status = "DBT_DISBURSED"
    app_obj.status_reason = f"₹{pay_obj.amount:,.0f} credited to account via PFMS APBS."

    db.commit()
    return {"status": "PROCESSED", "amount": pay_obj.amount}

@app.get("/api/documents", response_model=List[DocumentOut])
def get_documents(student_id: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Document)
    if student_id:
        q = q.filter(Document.student_id == student_id)
    return q.all()

@app.get("/api/payments", response_model=List[PaymentOut])
def get_payments(db: Session = Depends(get_db)):
    return db.query(Payment).all()

@app.get("/api/notifications", response_model=List[NotificationOut])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).all()

@app.get("/api/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).all()

@app.post("/api/jago/chat", response_model=JagoResponseOut)
def chat_with_jago(query: JagoQuery, db: Session = Depends(get_db)):
    app_obj = db.query(Application).first()
    res = process_jago_query(query.message, query.language or "en", active_app=app_obj)
    return res
