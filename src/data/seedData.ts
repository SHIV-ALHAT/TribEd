/**
 * Deterministic Seed Data for TribEd SIH Demonstration
 * Realistic synthetic fixtures. No real personal data or government API credentials.
 */

import { 
  User, 
  StudentProfile, 
  DocumentItem, 
  Application, 
  PaymentRecord, 
  NotificationItem, 
  AuditLogItem 
} from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'USER-ASHA-001',
    name: 'Asha Patil',
    email: 'asha.patil@demo.ac.in',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210'
  },
  {
    id: 'USER-VERIFIER-001',
    name: 'Suresh Rao',
    email: 'verifier.mota@tribed.gov.in',
    role: 'verifier',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 94220 12345'
  },
  {
    id: 'USER-ADMIN-001',
    name: 'Dr. Ananya Sharma',
    email: 'admin.tribed@mota.gov.in',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98110 56789'
  }
];

export const PRIMARY_STUDENT: StudentProfile = {
  id: 'STUDENT-ASHA-001',
  userId: 'USER-ASHA-001',
  fullName: 'Asha Patil',
  dateOfBirth: '2004-06-14',
  gender: 'Female',
  category: 'ST',
  subTribe: 'Bhil',
  syntheticAadhaarRef: 'XXXXXXXX4892',
  apaarId: 'APAAR-2024-MH-9941',
  stateOfDomicile: 'Maharashtra',
  district: 'Nandurbar',
  pincode: '425412',
  familyAnnualIncome: 240000, // ₹2,40,000 (Within ₹2.50L ceiling)
  incomeCertificateNo: 'REV-MH-2025-INC-3391',
  casteCertificateNo: 'MH-CAST-2022-ST-88194',
  currentEducationLevel: 'Undergraduate',
  courseName: 'B.Tech in Computer Engineering',
  currentYear: 3,
  institutionName: 'Demo Institute of Technology',
  institutionCode: 'AISHE-C-49210',
  bankAccountMasked: 'A/C Ending 6721',
  bankIfsc: 'SBIN0001234',
  aadhaarSeededBank: true
};

export const OTHER_STUDENTS: StudentProfile[] = [
  {
    id: 'STUDENT-RAMESH-002',
    userId: 'USER-RAMESH-002',
    fullName: 'Ramesh Gond',
    dateOfBirth: '2009-08-20',
    gender: 'Male',
    category: 'ST',
    subTribe: 'Gond',
    syntheticAadhaarRef: 'XXXXXXXX3114',
    apaarId: 'APAAR-2025-MP-3012',
    stateOfDomicile: 'Madhya Pradesh',
    district: 'Dindori',
    pincode: '481880',
    familyAnnualIncome: 120000,
    incomeCertificateNo: 'MP-REV-2025-9921',
    casteCertificateNo: 'MP-ST-2020-44123',
    currentEducationLevel: 'Pre-Matric',
    courseName: 'Class X (Secondary)',
    currentYear: 10,
    institutionName: 'Eklavya Model Residential School, Dindori',
    institutionCode: 'UDISE-23150201101',
    bankAccountMasked: 'A/C Ending 4019',
    bankIfsc: 'BKID0009941',
    aadhaarSeededBank: true
  },
  {
    id: 'STUDENT-PRIYA-003',
    userId: 'USER-PRIYA-003',
    fullName: 'Priya Maravi',
    dateOfBirth: '1999-11-03',
    gender: 'Female',
    category: 'ST',
    subTribe: 'Kol',
    syntheticAadhaarRef: 'XXXXXXXX9081',
    apaarId: 'APAAR-2021-TS-5541',
    stateOfDomicile: 'Telangana',
    district: 'Hyderabad',
    pincode: '500046',
    familyAnnualIncome: 450000,
    incomeCertificateNo: 'TS-REV-2025-1109',
    casteCertificateNo: 'TS-ST-2018-77124',
    currentEducationLevel: 'Doctoral',
    courseName: 'Ph.D. in Tribal Folklore & Linguistics',
    currentYear: 2,
    institutionName: 'University of Hyderabad (Central University)',
    institutionCode: 'AISHE-U-0012',
    bankAccountMasked: 'A/C Ending 1120',
    bankIfsc: 'UBIN0543219',
    aadhaarSeededBank: true
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'DOC-ST-001',
    studentId: 'STUDENT-ASHA-001',
    type: 'ST_CERTIFICATE',
    title: 'Scheduled Tribe Caste Certificate',
    documentNumber: 'MH-CAST-2022-ST-88194',
    source: 'DIGILOCKER',
    verifiedStatus: 'VERIFIED',
    issuer: 'Sub-Divisional Officer (SDO), Nandurbar',
    issuedDate: '2022-07-18',
    syntheticHash: 'sha256-demo-e8f192b10a',
    fileSize: '412 KB'
  },
  {
    id: 'DOC-INC-001',
    studentId: 'STUDENT-ASHA-001',
    type: 'INCOME_CERTIFICATE',
    title: 'Annual Family Income Certificate (FY 2025-26)',
    documentNumber: 'REV-MH-2025-INC-3391',
    source: 'DIGILOCKER',
    verifiedStatus: 'VERIFIED',
    issuer: 'Office of Tahasildar, Nandurbar',
    issuedDate: '2025-05-10',
    syntheticHash: 'sha256-demo-72a391c491',
    fileSize: '320 KB'
  },
  {
    id: 'DOC-ACAD-001',
    studentId: 'STUDENT-ASHA-001',
    type: 'ACADEMIC_MARKSHEET',
    title: 'B.Tech Semester IV Official Marksheet',
    documentNumber: 'APAAR-EXAM-2025-SEM4-88',
    source: 'DIGILOCKER',
    verifiedStatus: 'VERIFIED',
    issuer: 'Demo Institute of Technology Examination Controller',
    issuedDate: '2025-07-22',
    syntheticHash: 'sha256-demo-19fa3002b8',
    fileSize: '650 KB'
  },
  {
    id: 'DOC-DOM-001',
    studentId: 'STUDENT-ASHA-001',
    type: 'DOMICILE_CERTIFICATE',
    title: 'State Domicile Certificate',
    documentNumber: 'DOM-MH-2021-99214',
    source: 'DIGILOCKER',
    verifiedStatus: 'VERIFIED',
    issuer: 'Competent Authority, Maharashtra State',
    issuedDate: '2021-04-12',
    syntheticHash: 'sha256-demo-aa591c28f3',
    fileSize: '290 KB'
  },
  {
    id: 'DOC-BONAFIDE-OLD',
    studentId: 'STUDENT-ASHA-001',
    type: 'BONAFIDE_CERTIFICATE',
    title: 'College Bonafide Certificate (Previous Academic Year)',
    documentNumber: 'DIT-BONA-2024-912',
    source: 'MANUAL_UPLOAD',
    verifiedStatus: 'FLAGGED',
    issuer: 'Demo Institute of Technology (Dean Academic Office)',
    issuedDate: '2024-08-01',
    syntheticHash: 'sha256-demo-oldbonafide',
    fileSize: '510 KB'
  }
];

export const INITIAL_APPLICATION: Application = {
  id: 'MOTA-2026-ST-1042',
  studentId: 'STUDENT-ASHA-001',
  schemeId: 'SCHEME-POST-MATRIC',
  schemeName: 'Post-Matric Scholarship for ST Students',
  appliedDate: '2026-08-12',
  currentStatus: 'DEFICIENCY_NOTED',
  statusReason: 'Automated verification completed with 1 deficiency: Institution Affiliation record requires confirmation.',
  attachedDocumentIds: ['DOC-ST-001', 'DOC-INC-001', 'DOC-ACAD-001', 'DOC-DOM-001', 'DOC-BONAFIDE-OLD'],
  verificationChecks: [
    {
      id: 'CHK-UIDAI-01',
      checkType: 'IDENTITY',
      name: 'UIDAI Aadhaar Demographics & Biometric Seed Check',
      status: 'PASS',
      adapterUsed: 'MockIdentityAdapter (UIDAI Demo Sandbox)',
      details: 'Demographic match: Name (Asha Patil), DOB (14-06-2004), Gender (Female) matched with 99.8% confidence score.',
      matchedValues: {
        'Aadhaar Vault Ref': 'XXXXXXXX4892',
        'Authentication Type': 'Demo OTP Biometric Token',
        'Match Confidence': '99.8%'
      },
      checkedAt: '2026-08-12T14:32:00Z'
    },
    {
      id: 'CHK-CASTE-02',
      checkType: 'ST_CATEGORY',
      name: 'State e-District ST Certificate Validation',
      status: 'PASS',
      adapterUsed: 'MockDigiLockerAdapter (e-District Maharashtra)',
      details: 'ST category verified under Bhil Tribe (Entry 14 of Presidential Order, Maharashtra). Certificate active & authentic.',
      matchedValues: {
        'Caste Registry': 'MH-CAST-2022-ST-88194',
        'Recognized Sub-Tribe': 'Bhil (Scheduled Tribe)',
        'Issuing SDO': 'Nandurbar'
      },
      checkedAt: '2026-08-12T14:32:05Z'
    },
    {
      id: 'CHK-INCOME-03',
      checkType: 'INCOME',
      name: 'State Revenue Department Income Verification',
      status: 'PASS',
      adapterUsed: 'MockStateRevenueAdapter (DigiLocker Sandbox)',
      details: 'Family annual income ₹2,40,000 is within the statutory ceiling of ₹2,50,000 for Post-Matric scheme.',
      matchedValues: {
        'Declared Income': '₹2,40,000',
        'Certified Income': '₹2,40,000',
        'Scheme Ceiling': '₹2,50,000 (Compliant)'
      },
      checkedAt: '2026-08-12T14:32:10Z'
    },
    {
      id: 'CHK-ACAD-04',
      checkType: 'ACADEMIC',
      name: 'APAAR / ABC Academic Credit & Progression Check',
      status: 'PASS',
      adapterUsed: 'MockAcademicRecordAdapter (APAAR / ABC)',
      details: 'Academic progression confirmed: Passed Sem IV with 8.4 CGPA. Regular full-time enrollment.',
      matchedValues: {
        'APAAR ID': 'APAAR-2024-MH-9941',
        'Course': 'B.Tech Computer Engineering (Year 3)',
        'CGPA': '8.4 / 10'
      },
      checkedAt: '2026-08-12T14:32:14Z'
    },
    {
      id: 'CHK-INST-05',
      checkType: 'INSTITUTION',
      name: 'AISHE Master Database Institution Affiliation Validation',
      status: 'REVIEW_REQUIRED',
      adapterUsed: 'MockInstitutionAdapter (AISHE Registry)',
      details: 'AISHE repository flags Demo Institute of Technology affiliation verification for AY 2026-27 under review. Please provide an updated college Bonafide Certificate bearing current AISHE Code (C-49210) & Principal endorsement.',
      mismatchReason: 'Institution AISHE code C-49210 annual affiliation sync pending from State DTE. Student attached an outdated AY 2024-25 Bonafide Certificate.',
      matchedValues: {
        'Claimed College': 'Demo Institute of Technology',
        'AISHE Registry Status': 'Affiliation Audit Sync Pending',
        'Provided Bonafide Year': '2024-25 (Expired)'
      },
      checkedAt: '2026-08-12T14:32:18Z'
    }
  ],
  deficiency: {
    id: 'DEF-2026-01',
    applicationId: 'MOTA-2026-ST-1042',
    checkType: 'INSTITUTION',
    issueTitle: 'Current Year Bonafide Certificate Required',
    issueDescription: 'Your application contains a Bonafide Certificate from the previous academic year (2024-25). As per MoTA guidelines, an updated Bonafide Certificate for the current Academic Year (2026-27) stating your active enrollment in 3rd Year B.Tech and signed by the Institute Principal/Registrar is required to validate institution affiliation.',
    requiredAction: 'Upload updated Bonafide Certificate for Academic Year 2026-27',
    status: 'OPEN',
    createdAt: '2026-08-12T14:35:00Z'
  },
  sanctionAmount: 48000,
  sanctionOrderNumber: 'MOTA/ST-SCHOL/2026/MAH/8491',
  paymentRef: 'PFMS-MOTA-2026-9021',
  updatedAt: '2026-08-12T14:35:00Z'
};

export const INITIAL_PAYMENT: PaymentRecord = {
  id: 'PAY-MOTA-1042',
  applicationId: 'MOTA-2026-ST-1042',
  studentId: 'STUDENT-ASHA-001',
  studentName: 'Asha Patil',
  schemeName: 'Post-Matric Scholarship for ST Students',
  amount: 48000,
  state: 'SANCTIONED',
  pfmsTransactionId: 'PFMS-MOTA-2026-9021',
  dbtPaymentMode: 'Aadhaar_Payment_Bridge_System',
  maskedAccount: 'SBI A/C Ending 6721',
  sanctionDate: '2026-08-15',
  remarks: 'Sanction order approved for ₹48,000 (Tuition grant ₹33,600 + Hosteller Maintenance allowance ₹14,400).'
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    userId: 'USER-ASHA-001',
    title: 'Action Required: Bonafide Certificate Renewal',
    message: 'Your Post-Matric Scholarship application (MOTA-2026-ST-1042) requires an updated Bonafide Certificate for AY 2026-27.',
    type: 'action_required',
    linkRoute: '/applications/MOTA-2026-ST-1042',
    createdAt: '2026-08-12T14:35:10Z',
    isRead: false
  },
  {
    id: 'NOTIF-02',
    userId: 'USER-ASHA-001',
    title: 'Verification Milestone',
    message: 'Identity, ST Category, and Income checks have successfully passed automated validation.',
    type: 'info',
    linkRoute: '/applications/MOTA-2026-ST-1042',
    createdAt: '2026-08-12T14:33:00Z',
    isRead: true
  },
  {
    id: 'NOTIF-03',
    userId: 'USER-ASHA-001',
    title: 'Application Submitted',
    message: 'Application MOTA-2026-ST-1042 submitted to Ministry of Tribal Affairs portal.',
    type: 'success',
    linkRoute: '/applications/MOTA-2026-ST-1042',
    createdAt: '2026-08-12T14:30:00Z',
    isRead: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-08-12T14:30:00Z',
    actor: 'Asha Patil (Student)',
    actorRole: 'student',
    action: 'APPLICATION_SUBMITTED',
    entityType: 'APPLICATION',
    entityId: 'MOTA-2026-ST-1042',
    details: 'Application submitted for Post-Matric Scholarship for ST Students with 5 attached digital documents.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-08-12T14:32:00Z',
    actor: 'RuleEngine v2.4 (Automated Service)',
    actorRole: 'SYSTEM',
    action: 'VERIFICATION_EXECUTED',
    entityType: 'VERIFICATION',
    entityId: 'MOTA-2026-ST-1042',
    details: 'Ran 5 automated checks. Identity: PASS, ST Category: PASS, Income: PASS, Academic: PASS, Institution: REVIEW_REQUIRED.'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-08-12T14:35:00Z',
    actor: 'RuleEngine v2.4 (Automated Service)',
    actorRole: 'SYSTEM',
    action: 'DEFICIENCY_GENERATED',
    entityType: 'DEFICIENCY',
    entityId: 'DEF-2026-01',
    details: 'Flagged mismatch between submitted bonafide date (AY 2024-25) and required active enrollment term.'
  }
];
