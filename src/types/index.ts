/**
 * TribEd: Unified Scholarship Platform for Tribal Students
 * Core Type Definitions
 */

export type UserRole = 'student' | 'verifier' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
}

export type TribeCategory = 'ST';

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Female' | 'Male' | 'Other';
  category: TribeCategory;
  subTribe: string; // e.g. "Bhil", "Gond", "Santhal", "Warli", "Meena"
  syntheticAadhaarRef: string; // Masked e.g. "XXXXXXXX4892" (Synthetic UIDAI token)
  apaarId?: string; // Automated Permanent Academic Account Registry (Synthetic)
  stateOfDomicile: string;
  district: string;
  pincode: string;
  familyAnnualIncome: number;
  incomeCertificateNo: string;
  casteCertificateNo: string;
  currentEducationLevel: 'Pre-Matric' | 'Higher Secondary' | 'Undergraduate' | 'Postgraduate' | 'Doctoral';
  courseName: string; // e.g. "B.Tech in Computer Engineering"
  currentYear: number;
  institutionName: string;
  institutionCode: string; // AISHE code synthetic e.g. "AISHE-C-19402"
  bankAccountMasked: string; // "A/C Ending 6721" (Synthetic demo token)
  bankIfsc: string; // "SBIN0001234"
  aadhaarSeededBank: boolean; // Crucial for DBT
}

export type SchemeCategory = 
  | 'pre_matric'
  | 'post_matric'
  | 'top_class'
  | 'nfst'
  | 'nos';

export interface SchemeRule {
  minEducationLevel: string;
  maxEducationLevel: string;
  maxIncomeCeiling: number; // in INR
  applicableCategories: string[];
  minimumPreviousMarksPercent?: number;
  eligibleInstitutionsType: 'All_Recognized' | 'Top_Class_Institutes' | 'Centrally_Funded' | 'Foreign_Accredited';
  mandatoryDocuments: string[];
}

export interface ScholarshipScheme {
  id: string;
  code: SchemeCategory;
  name: string;
  hindiName: string;
  marathiName: string;
  ministry: string;
  description: string;
  annualBenefitMax: number;
  benefitsDescription: string;
  deadlineDate: string;
  rules: SchemeRule;
  targetBeneficiaries: string;
  applicationGuideUrl?: string;
}

export type ApplicationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VERIFICATION_IN_PROGRESS'
  | 'DEFICIENCY_NOTED'
  | 'CORRECTION_SUBMITTED'
  | 'VERIFIED'
  | 'SANCTIONED'
  | 'DBT_PROCESSING'
  | 'DBT_DISBURSED'
  | 'REJECTED';

export type CheckStatus = 'PASS' | 'FAIL' | 'REVIEW_REQUIRED' | 'NOT_CHECKED';

export interface VerificationCheck {
  id: string;
  checkType: 'IDENTITY' | 'ST_CATEGORY' | 'INCOME' | 'ACADEMIC' | 'INSTITUTION' | 'DOCUMENT_VALIDITY';
  name: string;
  status: CheckStatus;
  adapterUsed: string; // e.g. "MockIdentityAdapter (UIDAI)", "MockInstitutionAdapter (AISHE)"
  details: string;
  matchedValues?: Record<string, string>;
  mismatchReason?: string;
  checkedAt: string;
}

export interface DeficiencyRecord {
  id: string;
  applicationId: string;
  checkType: string;
  issueTitle: string;
  issueDescription: string;
  requiredAction: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  resolutionDocumentId?: string;
}

export interface DocumentItem {
  id: string;
  studentId: string;
  type: 'ST_CERTIFICATE' | 'INCOME_CERTIFICATE' | 'ACADEMIC_MARKSHEET' | 'BONAFIDE_CERTIFICATE' | 'DOMICILE_CERTIFICATE' | 'FOREIGN_OFFER_LETTER';
  title: string;
  documentNumber: string;
  source: 'DIGILOCKER' | 'MANUAL_UPLOAD' | 'STATE_PORTAL';
  verifiedStatus: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  issuer: string;
  issuedDate: string;
  syntheticHash: string;
  fileSize: string;
  downloadUrl?: string;
}

export interface Application {
  id: string; // e.g. "MOTA-2026-ST-1042"
  studentId: string;
  schemeId: string;
  schemeName: string;
  appliedDate: string;
  currentStatus: ApplicationStatus;
  statusReason: string;
  attachedDocumentIds: string[];
  verificationChecks: VerificationCheck[];
  deficiency?: DeficiencyRecord;
  sanctionAmount?: number;
  sanctionOrderNumber?: string;
  paymentRef?: string;
  updatedAt: string;
}

export type PaymentState = 'NOT_STARTED' | 'SANCTIONED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';

export interface PaymentRecord {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  schemeName: string;
  amount: number;
  state: PaymentState;
  pfmsTransactionId?: string; // Synthetic PFMS ref
  dbtPaymentMode: 'Aadhaar_Payment_Bridge_System' | 'NACH_NEFT';
  maskedAccount: string;
  sanctionDate?: string;
  processingDate?: string;
  disbursedDate?: string;
  remarks: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'action_required';
  linkRoute?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jago';
  text: string;
  timestamp: string;
  language?: 'en' | 'hi' | 'mr';
  actionSuggestions?: string[];
  quickContext?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole | 'SYSTEM';
  action: string;
  entityType: 'APPLICATION' | 'VERIFICATION' | 'DEFICIENCY' | 'PAYMENT' | 'DOCUMENT';
  entityId: string;
  details: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'mr';
