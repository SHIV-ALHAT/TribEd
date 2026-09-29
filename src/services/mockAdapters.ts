/**
 * Mock & Sandbox Adapters for TribEd Orchestration Layer
 * 
 * ARCHITECTURE PRINCIPLE:
 * In accordance with Ministry of Tribal Affairs guidelines, TribEd is an
 * orchestration layer and student interface. It interacts with upstream
 * sovereign systems (UIDAI, DigiLocker, APAAR, AISHE, PFMS) via standard adapters.
 * 
 * In this demonstration environment, these adapters run against deterministic
 * sandbox fixtures with zero real personal data. When moving to production,
 * authorized REST/SOAP connectors replace these mock implementations with
 * no changes required to the verification engine or UI.
 */

import { DocumentItem, StudentProfile } from '../types';

export interface IdentityAdapter {
  verifyAadhaarDemographics(syntheticRef: string, profile: Partial<StudentProfile>): Promise<{
    matched: boolean;
    confidenceScore: number;
    authProvider: string;
    details: string;
  }>;
}

export interface DigiLockerAdapter {
  fetchStudentCertificates(studentId: string): Promise<DocumentItem[]>;
  verifyCertificateSignature(documentNumber: string): Promise<{
    isValid: boolean;
    digitalSignatureIssuer: string;
    timestamp: string;
  }>;
}

export interface AcademicRecordAdapter {
  verifyStudentAcademicStatus(apaarId: string, claimedCourse: string, claimedYear: number): Promise<{
    isEnrolled: boolean;
    verifiedInstitution: string;
    verifiedCourse: string;
    currentSemester: number;
    cgpaPercentage: number;
    creditsEarned: number;
  }>;
}

export interface InstitutionAdapter {
  verifyInstitutionAffiliation(aisheCode: string, academicYear: string): Promise<{
    isRecognized: boolean;
    institutionName: string;
    managementType: string;
    stateDteSyncStatus: 'SYNCED' | 'AUDIT_PENDING' | 'DISAFFILIATED';
    eligibleSchemes: string[];
    notes: string;
  }>;
}

export interface PaymentAdapter {
  initiateDbtTransfer(params: {
    applicationId: string;
    studentAadhaarRef: string;
    amount: number;
    schemeCode: string;
  }): Promise<{
    transactionRef: string;
    status: 'SANCTIONED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
    channel: string;
    settlementTimestamp: string;
  }>;
  checkDbtStatus(transactionRef: string): Promise<{
    status: 'SANCTIONED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
    bankAckNumber?: string;
    utrNumber?: string;
    creditedDate?: string;
  }>;
}

// --------------------------------------------------------------------------
// MOCK IMPLEMENTATIONS (Sandbox Fixtures)
// --------------------------------------------------------------------------

export class MockIdentityAdapter implements IdentityAdapter {
  async verifyAadhaarDemographics(syntheticRef: string, profile: Partial<StudentProfile>) {
    // Simulates UIDAI Sandbox Authentication v2.5
    await new Promise(r => setTimeout(r, 400));
    return {
      matched: true,
      confidenceScore: 0.998,
      authProvider: 'UIDAI Demo e-KYC Sandbox (Auth Type: OTP/FaceAuth Simulated)',
      details: `Demographic match: Full Name '${profile.fullName || 'Student'}' and Category '${profile.category || 'ST'}' verified in sandbox vault.`
    };
  }
}

export class MockDigiLockerAdapter implements DigiLockerAdapter {
  async fetchStudentCertificates(studentId: string): Promise<DocumentItem[]> {
    await new Promise(r => setTimeout(r, 500));
    return [
      {
        id: `DOC-DIGI-ST-${Date.now()}`,
        studentId,
        type: 'ST_CERTIFICATE',
        title: 'Scheduled Tribe Caste Certificate',
        documentNumber: 'MH-CAST-2022-ST-88194',
        source: 'DIGILOCKER',
        verifiedStatus: 'VERIFIED',
        issuer: 'Sub-Divisional Officer (SDO), Nandurbar',
        issuedDate: '2022-07-18',
        syntheticHash: 'sha256-digi-verified-st',
        fileSize: '412 KB'
      },
      {
        id: `DOC-DIGI-INC-${Date.now()}`,
        studentId,
        type: 'INCOME_CERTIFICATE',
        title: 'Annual Income Certificate (FY 2025-26)',
        documentNumber: 'REV-MH-2025-INC-3391',
        source: 'DIGILOCKER',
        verifiedStatus: 'VERIFIED',
        issuer: 'Office of Tahasildar, Nandurbar',
        issuedDate: '2025-05-10',
        syntheticHash: 'sha256-digi-verified-inc',
        fileSize: '320 KB'
      }
    ];
  }

  async verifyCertificateSignature(documentNumber: string) {
    await new Promise(r => setTimeout(r, 300));
    return {
      isValid: true,
      digitalSignatureIssuer: 'National Informatics Centre (NIC) CA for Maharashtra e-District',
      timestamp: new Date().toISOString()
    };
  }
}

export class MockAcademicRecordAdapter implements AcademicRecordAdapter {
  async verifyStudentAcademicStatus(apaarId: string, claimedCourse: string, claimedYear: number) {
    await new Promise(r => setTimeout(r, 450));
    return {
      isEnrolled: true,
      verifiedInstitution: 'Demo Institute of Technology',
      verifiedCourse: 'B.Tech in Computer Engineering',
      currentSemester: claimedYear * 2,
      cgpaPercentage: 84.0,
      creditsEarned: 132
    };
  }
}

export class MockInstitutionAdapter implements InstitutionAdapter {
  private hasUpdatedAffiliationBonafide: boolean = false;

  setUpdatedAffiliationBonafide(val: boolean) {
    this.hasUpdatedAffiliationBonafide = val;
  }

  async verifyInstitutionAffiliation(aisheCode: string, academicYear: string) {
    await new Promise(r => setTimeout(r, 500));
    
    // If the student has uploaded the new Bonafide Certificate for AY 2026-27,
    // this check passes! If still relying on outdated record, returns AUDIT_PENDING.
    if (this.hasUpdatedAffiliationBonafide) {
      return {
        isRecognized: true,
        institutionName: 'Demo Institute of Technology',
        managementType: 'Government Aided Autonomous Institute',
        stateDteSyncStatus: 'SYNCED' as const,
        eligibleSchemes: ['pre_matric', 'post_matric', 'top_class'],
        notes: 'Updated institutional bonafide & AY 2026-27 affiliation endorsement validated successfully.'
      };
    }

    return {
      isRecognized: true,
      institutionName: 'Demo Institute of Technology',
      managementType: 'Government Aided Autonomous Institute',
      stateDteSyncStatus: 'AUDIT_PENDING' as const,
      eligibleSchemes: ['pre_matric', 'post_matric'],
      notes: 'AISHE repository flags Demo Institute of Technology affiliation verification for AY 2026-27 under review. Updated bonafide required.'
    };
  }
}

export class MockPaymentAdapter implements PaymentAdapter {
  async initiateDbtTransfer(params: {
    applicationId: string;
    studentAadhaarRef: string;
    amount: number;
    schemeCode: string;
  }) {
    await new Promise(r => setTimeout(r, 600));
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    return {
      transactionRef: `PFMS-MOTA-2026-${randomHex}`,
      status: 'PROCESSING' as const,
      channel: 'Aadhaar Payment Bridge System (APBS - NPCI)',
      settlementTimestamp: new Date().toISOString()
    };
  }

  async checkDbtStatus(transactionRef: string) {
    await new Promise(r => setTimeout(r, 400));
    return {
      status: 'PROCESSED' as const,
      bankAckNumber: `NPCI-ACK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      utrNumber: `SBIN${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      creditedDate: new Date().toISOString()
    };
  }
}

// Singletons for runtime orchestration
export const mockIdentity = new MockIdentityAdapter();
export const mockDigiLocker = new MockDigiLockerAdapter();
export const mockAcademic = new MockAcademicRecordAdapter();
export const mockInstitution = new MockInstitutionAdapter();
export const mockPayment = new MockPaymentAdapter();
