/**
 * TribEd Automated Rule-Based Verification Engine
 * Orchestrates multi-source validation against adapter endpoints.
 */

import { Application, DocumentItem, StudentProfile, VerificationCheck, CheckStatus } from '../types';
import { 
  mockIdentity, 
  mockDigiLocker, 
  mockAcademic, 
  mockInstitution 
} from './mockAdapters';

export interface VerificationExecutionResult {
  checks: VerificationCheck[];
  overallStatus: 'PASS' | 'REVIEW_REQUIRED' | 'FAIL';
  summary: string;
  hasDeficiency: boolean;
  deficiencyDetails?: {
    checkType: string;
    issueTitle: string;
    issueDescription: string;
    requiredAction: string;
  };
}

export async function runAutomatedVerification(
  student: StudentProfile,
  application: Application,
  documents: DocumentItem[]
): Promise<VerificationExecutionResult> {
  const timestamp = new Date().toISOString();
  const checks: VerificationCheck[] = [];

  // Check 1: Identity & Aadhaar Demographic Verification
  const idResult = await mockIdentity.verifyAadhaarDemographics(student.syntheticAadhaarRef, student);
  checks.push({
    id: `CHK-UIDAI-${Date.now()}`,
    checkType: 'IDENTITY',
    name: 'UIDAI Aadhaar Demographics & Biometric Seed Check',
    status: idResult.matched ? 'PASS' : 'FAIL',
    adapterUsed: 'MockIdentityAdapter (UIDAI Demo Sandbox)',
    details: idResult.details,
    matchedValues: {
      'Synthetic UIDAI Vault': student.syntheticAadhaarRef,
      'Demographic Name': student.fullName,
      'Confidence Score': `${(idResult.confidenceScore * 100).toFixed(1)}%`
    },
    checkedAt: timestamp
  });

  // Check 2: ST/Category Certificate Check (DigiLocker / e-District)
  const stDoc = documents.find(d => d.type === 'ST_CERTIFICATE');
  let stStatus: CheckStatus = 'NOT_CHECKED';
  let stDetails = '';
  if (stDoc) {
    const certSig = await mockDigiLocker.verifyCertificateSignature(stDoc.documentNumber);
    if (certSig.isValid && student.category === 'ST') {
      stStatus = 'PASS';
      stDetails = `ST category verified under ${student.subTribe} community. Digital signature valid (${certSig.digitalSignatureIssuer}).`;
    } else {
      stStatus = 'FAIL';
      stDetails = 'Digital signature on caste certificate could not be validated.';
    }
  } else {
    stStatus = 'REVIEW_REQUIRED';
    stDetails = 'Mandatory ST Caste Certificate missing from document bundle.';
  }

  checks.push({
    id: `CHK-CASTE-${Date.now()}`,
    checkType: 'ST_CATEGORY',
    name: 'State e-District ST Certificate Validation',
    status: stStatus,
    adapterUsed: 'MockDigiLockerAdapter (e-District Repository)',
    details: stDetails,
    matchedValues: {
      'Caste Cert No': stDoc?.documentNumber || 'N/A',
      'Recognized Tribe': student.subTribe,
      'Prescribed Category': student.category
    },
    checkedAt: timestamp
  });

  // Check 3: Income Verification
  const incDoc = documents.find(d => d.type === 'INCOME_CERTIFICATE');
  let incStatus: CheckStatus = 'NOT_CHECKED';
  let incDetails = '';
  if (incDoc) {
    if (student.familyAnnualIncome <= 250000) {
      incStatus = 'PASS';
      incDetails = `Income ₹${student.familyAnnualIncome.toLocaleString('en-IN')} complies with scheme ceiling of ₹2,50,000. Certificate issued by ${incDoc.issuer}.`;
    } else {
      incStatus = 'FAIL';
      incDetails = `Declared income ₹${student.familyAnnualIncome.toLocaleString('en-IN')} exceeds allowable threshold.`;
    }
  } else {
    incStatus = 'REVIEW_REQUIRED';
    incDetails = 'Revenue Income Certificate missing.';
  }

  checks.push({
    id: `CHK-INCOME-${Date.now()}`,
    checkType: 'INCOME',
    name: 'State Revenue Department Income Verification',
    status: incStatus,
    adapterUsed: 'MockStateRevenueAdapter (DigiLocker Sandbox)',
    details: incDetails,
    matchedValues: {
      'Certified Income': `₹${student.familyAnnualIncome.toLocaleString('en-IN')}`,
      'Scheme Maximum': '₹2,50,000',
      'Certificate Ref': incDoc?.documentNumber || 'N/A'
    },
    checkedAt: timestamp
  });

  // Check 4: Academic Progression (APAAR / ABC)
  const acadResult = await mockAcademic.verifyStudentAcademicStatus(
    student.apaarId || 'APAAR-DEMO',
    student.courseName,
    student.currentYear
  );
  checks.push({
    id: `CHK-ACAD-${Date.now()}`,
    checkType: 'ACADEMIC',
    name: 'APAAR / ABC Academic Credit & Progression Check',
    status: acadResult.isEnrolled ? 'PASS' : 'FAIL',
    adapterUsed: 'MockAcademicRecordAdapter (APAAR Registry)',
    details: `Active registration in ${acadResult.verifiedCourse} (Semester ${acadResult.currentSemester}). Academic record verified.`,
    matchedValues: {
      'APAAR ID': student.apaarId || 'N/A',
      'Course Enrolled': acadResult.verifiedCourse,
      'Academic Record': `${acadResult.cgpaPercentage}% aggregate`
    },
    checkedAt: timestamp
  });

  // Check 5: Institution & Bonafide Affiliation Check (THE INTENTIONAL DEMO MISMATCH)
  const bonafideDoc = documents.find(d => d.type === 'BONAFIDE_CERTIFICATE');
  const isBonafideCurrent = bonafideDoc && bonafideDoc.title.includes('2026-27');
  
  if (isBonafideCurrent) {
    mockInstitution.setUpdatedAffiliationBonafide(true);
  }

  const instResult = await mockInstitution.verifyInstitutionAffiliation(student.institutionCode, '2026-27');
  
  let instStatus: CheckStatus = 'PASS';
  let mismatchReason: string | undefined = undefined;
  let instDetails = instResult.notes;

  if (instResult.stateDteSyncStatus === 'AUDIT_PENDING' && !isBonafideCurrent) {
    instStatus = 'REVIEW_REQUIRED';
    mismatchReason = 'Institution AISHE code C-49210 annual affiliation sync pending from State DTE. Student attached an outdated AY 2024-25 Bonafide Certificate.';
    instDetails = 'AISHE repository flags Demo Institute of Technology affiliation verification for AY 2026-27 under review. Please provide an updated college Bonafide Certificate bearing current AISHE Code (C-49210) & Principal endorsement.';
  }

  checks.push({
    id: `CHK-INST-${Date.now()}`,
    checkType: 'INSTITUTION',
    name: 'AISHE Master Database Institution Affiliation Validation',
    status: instStatus,
    adapterUsed: 'MockInstitutionAdapter (AISHE Registry)',
    details: instDetails,
    mismatchReason,
    matchedValues: {
      'Claimed College': student.institutionName,
      'AISHE Registry Status': instResult.stateDteSyncStatus,
      'Active Bonafide Attached': isBonafideCurrent ? 'Verified AY 2026-27' : 'AY 2024-25 (Expired)'
    },
    checkedAt: timestamp
  });

  // Summary & routing
  const hasFail = checks.some(c => c.status === 'FAIL');
  const hasReview = checks.some(c => c.status === 'REVIEW_REQUIRED');

  let overallStatus: 'PASS' | 'REVIEW_REQUIRED' | 'FAIL' = 'PASS';
  let summary = 'All statutory verification checks passed successfully.';
  let deficiencyDetails: VerificationExecutionResult['deficiencyDetails'] = undefined;

  if (hasFail) {
    overallStatus = 'FAIL';
    summary = 'One or more mandatory eligibility verification checks failed statutory requirements.';
  } else if (hasReview) {
    overallStatus = 'REVIEW_REQUIRED';
    summary = 'Application routed to Exception & Deficiency Workflow: Institution Affiliation record requires updated Bonafide document.';
    deficiencyDetails = {
      checkType: 'INSTITUTION',
      issueTitle: 'Current Year Bonafide Certificate Required',
      issueDescription: 'Your application contains a Bonafide Certificate from the previous academic year (2024-25). As per MoTA guidelines, an updated Bonafide Certificate for the current Academic Year (2026-27) stating your active enrollment in 3rd Year B.Tech and signed by the Institute Principal/Registrar is required to validate institution affiliation.',
      requiredAction: 'Upload updated Bonafide Certificate for Academic Year 2026-27'
    };
  }

  return {
    checks,
    overallStatus,
    summary,
    hasDeficiency: hasReview,
    deficiencyDetails
  };
}
