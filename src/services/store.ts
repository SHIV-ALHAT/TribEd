/**
 * TribEd State Management & Local Orchestration Store
 * Provides transactional mutations, audit logging, and demo resets.
 */

import { 
  User, 
  StudentProfile, 
  DocumentItem, 
  Application, 
  PaymentRecord, 
  NotificationItem, 
  AuditLogItem,
  SupportedLanguage 
} from '../types';
import { 
  SEED_USERS, 
  PRIMARY_STUDENT, 
  OTHER_STUDENTS, 
  INITIAL_DOCUMENTS, 
  INITIAL_APPLICATION, 
  INITIAL_PAYMENT, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/seedData';
import { runAutomatedVerification } from './verificationEngine';
import { mockInstitution } from './mockAdapters';

const STORAGE_KEY = 'tribed_app_state_v1';

export interface AppState {
  currentUser: User;
  students: StudentProfile[];
  primaryStudentId: string;
  documents: DocumentItem[];
  applications: Application[];
  payments: PaymentRecord[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  language: SupportedLanguage;
}

function getInitialState(): AppState {
  return {
    currentUser: SEED_USERS[0], // Asha Patil
    students: [PRIMARY_STUDENT, ...OTHER_STUDENTS],
    primaryStudentId: PRIMARY_STUDENT.id,
    documents: [...INITIAL_DOCUMENTS],
    applications: [{ ...INITIAL_APPLICATION }],
    payments: [{ ...INITIAL_PAYMENT }],
    notifications: [...INITIAL_NOTIFICATIONS],
    auditLogs: [...INITIAL_AUDIT_LOGS],
    language: 'en'
  };
}

class Store {
  private state: AppState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return getInitialState();
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AppState {
    return this.state;
  }

  // Set Current User (Switch between Student, Verifier, Admin)
  setCurrentUser(user: User) {
    this.state.currentUser = user;
    this.saveState();
  }

  setLanguage(lang: SupportedLanguage) {
    this.state.language = lang;
    this.saveState();
  }

  getActiveStudent(): StudentProfile {
    const student = this.state.students.find(s => s.id === this.state.primaryStudentId);
    return student || PRIMARY_STUDENT;
  }

  getStudentDocuments(studentId: string): DocumentItem[] {
    return this.state.documents.filter(d => d.studentId === studentId);
  }

  getStudentApplications(studentId: string): Application[] {
    return this.state.applications.filter(a => a.studentId === studentId);
  }

  getApplicationById(id: string): Application | undefined {
    return this.state.applications.find(a => a.id === id);
  }

  getPaymentForApplication(appId: string): PaymentRecord | undefined {
    return this.state.payments.find(p => p.applicationId === appId);
  }

  // Audit Log Helper
  private addAudit(action: string, entityType: AuditLogItem['entityType'], entityId: string, details: string) {
    const log: AuditLogItem = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: `${this.state.currentUser.name} (${this.state.currentUser.role})`,
      actorRole: this.state.currentUser.role,
      action,
      entityType,
      entityId,
      details
    };
    this.state.auditLogs = [log, ...this.state.auditLogs];
  }

  // Notifications Helper
  private addNotification(userId: string, title: string, message: string, type: NotificationItem['type'], linkRoute?: string) {
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId,
      title,
      message,
      type,
      linkRoute,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    this.state.notifications = [notif, ...this.state.notifications];
  }

  markNotificationAsRead(id: string) {
    this.state.notifications = this.state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    this.saveState();
  }

  markAllNotificationsAsRead() {
    this.state.notifications = this.state.notifications.map(n => ({ ...n, isRead: true }));
    this.saveState();
  }

  // Add / Upload Document
  addDocument(doc: Omit<DocumentItem, 'id'>) {
    const newDoc: DocumentItem = {
      ...doc,
      id: `DOC-${Date.now()}`
    };
    this.state.documents = [newDoc, ...this.state.documents];
    this.addAudit('DOCUMENT_UPLOADED', 'DOCUMENT', newDoc.id, `Uploaded ${newDoc.title} (${newDoc.documentNumber})`);
    this.saveState();
    return newDoc;
  }

  // Fetch from Mock DigiLocker
  async fetchFromDigiLocker(studentId: string, docType: DocumentItem['type']) {
    const existing = this.state.documents.find(d => d.studentId === studentId && d.type === docType);
    if (existing) return existing;

    const newDoc: DocumentItem = {
      id: `DOC-DIGI-${Date.now()}`,
      studentId,
      type: docType,
      title: docType === 'ST_CERTIFICATE' ? 'Scheduled Tribe Caste Certificate' : 'Income Certificate (FY 2025-26)',
      documentNumber: `DIGI-${Math.floor(100000 + Math.random() * 900000)}`,
      source: 'DIGILOCKER',
      verifiedStatus: 'VERIFIED',
      issuer: 'DigiLocker Sovereign Locker Sandbox',
      issuedDate: new Date().toISOString().split('T')[0],
      syntheticHash: `sha256-${Date.now()}`,
      fileSize: '380 KB'
    };

    this.state.documents = [newDoc, ...this.state.documents];
    this.addAudit('DIGILOCKER_FETCH', 'DOCUMENT', newDoc.id, `Retrieved ${newDoc.title} from DigiLocker repository`);
    this.saveState();
    return newDoc;
  }

  // Create Application
  createApplication(studentId: string, schemeId: string, schemeName: string) {
    const student = this.getActiveStudent();
    const studentDocs = this.getStudentDocuments(studentId);
    
    const newApp: Application = {
      id: `MOTA-2026-ST-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId,
      schemeId,
      schemeName,
      appliedDate: new Date().toISOString().split('T')[0],
      currentStatus: 'SUBMITTED',
      statusReason: 'Application submitted by student. Queued for automated rule verification.',
      attachedDocumentIds: studentDocs.map(d => d.id),
      verificationChecks: [],
      updatedAt: new Date().toISOString()
    };

    this.state.applications = [newApp, ...this.state.applications];
    this.addAudit('APPLICATION_SUBMITTED', 'APPLICATION', newApp.id, `Created application for ${schemeName}`);
    this.addNotification(
      student.userId,
      'Application Submitted Successfully',
      `Your application ${newApp.id} for ${schemeName} is being queued for automated verification.`,
      'success',
      `/applications/${newApp.id}`
    );

    this.saveState();
    return newApp;
  }

  // Run or Rerun Verification on Application
  async executeVerification(applicationId: string) {
    const appIndex = this.state.applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) return;

    const student = this.getActiveStudent();
    const app = this.state.applications[appIndex];
    const docs = this.state.documents.filter(d => app.attachedDocumentIds.includes(d.id));

    // Update status to VERIFICATION_IN_PROGRESS
    this.state.applications[appIndex] = {
      ...app,
      currentStatus: 'VERIFICATION_IN_PROGRESS',
      statusReason: 'Executing automated multi-layer verification checks against UIDAI, DigiLocker, APAAR, and AISHE adapters...',
      updatedAt: new Date().toISOString()
    };
    this.saveState();

    const result = await runAutomatedVerification(student, app, docs);

    if (result.hasDeficiency && result.deficiencyDetails) {
      const defRecord = {
        id: `DEF-${Date.now()}`,
        applicationId: app.id,
        checkType: result.deficiencyDetails.checkType,
        issueTitle: result.deficiencyDetails.issueTitle,
        issueDescription: result.deficiencyDetails.issueDescription,
        requiredAction: result.deficiencyDetails.requiredAction,
        status: 'OPEN' as const,
        createdAt: new Date().toISOString()
      };

      this.state.applications[appIndex] = {
        ...this.state.applications[appIndex],
        currentStatus: 'DEFICIENCY_NOTED',
        statusReason: result.summary,
        verificationChecks: result.checks,
        deficiency: defRecord,
        updatedAt: new Date().toISOString()
      };

      this.addAudit('DEFICIENCY_FLAGGED', 'DEFICIENCY', defRecord.id, `Deficiency noted: ${defRecord.issueTitle}`);
      this.addNotification(
        student.userId,
        `Action Required: ${defRecord.issueTitle}`,
        `Your application ${app.id} needs correction: ${defRecord.requiredAction}.`,
        'action_required',
        `/applications/${app.id}`
      );
    } else if (result.overallStatus === 'PASS') {
      this.state.applications[appIndex] = {
        ...this.state.applications[appIndex],
        currentStatus: 'VERIFIED',
        statusReason: 'All multi-layer automated checks successfully validated. Application forwarded for sanction order.',
        verificationChecks: result.checks,
        deficiency: undefined,
        updatedAt: new Date().toISOString()
      };

      this.addAudit('VERIFICATION_PASSED', 'APPLICATION', app.id, 'All statutory automated checks passed.');
      this.addNotification(
        student.userId,
        'Verification Complete: Verified',
        `Your application ${app.id} has successfully cleared all statutory checks!`,
        'success',
        `/applications/${app.id}`
      );
    }

    this.saveState();
  }

  // Student Resolves Deficiency by Uploading Updated AY 2026-27 Bonafide
  resolveDeficiencyWithUpdatedBonafide(applicationId: string) {
    const student = this.getActiveStudent();
    
    // 1. Create the new Bonafide document
    const updatedBonafide: DocumentItem = {
      id: `DOC-BONAFIDE-2026-${Date.now()}`,
      studentId: student.id,
      type: 'BONAFIDE_CERTIFICATE',
      title: 'Current Academic Year 2026-27 Bonafide Certificate',
      documentNumber: 'DIT-REG-2026-BONA-4481',
      source: 'MANUAL_UPLOAD',
      verifiedStatus: 'VERIFIED',
      issuer: 'Demo Institute of Technology (Principal & Dean Academic Affairs)',
      issuedDate: new Date().toISOString().split('T')[0],
      syntheticHash: 'sha256-verified-bonafide-2026',
      fileSize: '480 KB'
    };

    // Remove old bonafide from document list and add new one
    this.state.documents = [
      updatedBonafide,
      ...this.state.documents.filter(d => d.type !== 'BONAFIDE_CERTIFICATE')
    ];

    // Inform mock institution adapter
    mockInstitution.setUpdatedAffiliationBonafide(true);

    const appIndex = this.state.applications.findIndex(a => a.id === applicationId);
    if (appIndex !== -1) {
      const app = this.state.applications[appIndex];
      const attachedDocIds = Array.from(new Set([...app.attachedDocumentIds, updatedBonafide.id]));

      const updatedDeficiency = app.deficiency ? {
        ...app.deficiency,
        status: 'RESOLVED' as const,
        resolvedAt: new Date().toISOString(),
        resolutionNotes: 'Student uploaded certified Bonafide Certificate for AY 2026-27 with official Principal seal & AISHE code.',
        resolutionDocumentId: updatedBonafide.id
      } : undefined;

      this.state.applications[appIndex] = {
        ...app,
        attachedDocumentIds: attachedDocIds,
        currentStatus: 'CORRECTION_SUBMITTED',
        statusReason: 'Correction submitted by student with AY 2026-27 Bonafide Certificate. Ready for re-verification / verifier review.',
        deficiency: updatedDeficiency,
        updatedAt: new Date().toISOString()
      };

      this.addAudit('DEFICIENCY_RESOLVED_BY_STUDENT', 'DEFICIENCY', app.deficiency?.id || 'DEF', 'Uploaded updated AY 2026-27 Bonafide Certificate.');
      this.addNotification(
        student.userId,
        'Correction Submitted',
        `Your updated document has been submitted for application ${app.id}. Verification in queue.`,
        'info',
        `/applications/${app.id}`
      );
    }

    this.saveState();
  }

  // Admin / Verifier Action
  adminReviewAction(
    applicationId: string, 
    action: 'APPROVE' | 'REQUEST_CORRECTION' | 'REJECT' | 'SEND_MANUAL_REVIEW',
    notes: string
  ) {
    const appIndex = this.state.applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) return;

    const student = this.getActiveStudent();
    const app = this.state.applications[appIndex];
    let newStatus = app.currentStatus;
    let reason = notes;

    if (action === 'APPROVE') {
      newStatus = 'VERIFIED';
      reason = notes || 'Institutional affiliation and student documents manually inspected and approved by Verifier.';
      
      // Update check 5 status to PASS
      const updatedChecks = app.verificationChecks.map(c => 
        c.checkType === 'INSTITUTION' ? { ...c, status: 'PASS' as const, details: 'Manually verified and confirmed by Ministry Verifier.' } : c
      );

      this.state.applications[appIndex] = {
        ...app,
        currentStatus: newStatus,
        statusReason: reason,
        verificationChecks: updatedChecks,
        deficiency: app.deficiency ? { ...app.deficiency, status: 'RESOLVED', resolutionNotes: notes } : undefined,
        updatedAt: new Date().toISOString()
      };

      this.addAudit('VERIFIER_APPROVED', 'APPLICATION', app.id, `Manual verification approval: ${reason}`);
      this.addNotification(
        student.userId,
        'Application Verified by Reviewer',
        `Application ${app.id} was verified by the Ministry Reviewer. Next step: Sanction order generation.`,
        'success',
        `/applications/${app.id}`
      );
    } else if (action === 'REQUEST_CORRECTION') {
      newStatus = 'DEFICIENCY_NOTED';
      reason = notes || 'Additional clarification required.';
      this.state.applications[appIndex] = {
        ...app,
        currentStatus: newStatus,
        statusReason: reason,
        updatedAt: new Date().toISOString()
      };
      this.addAudit('VERIFIER_REQUESTED_CORRECTION', 'APPLICATION', app.id, reason);
      this.addNotification(student.userId, 'Correction Requested', reason, 'action_required', `/applications/${app.id}`);
    } else if (action === 'REJECT') {
      newStatus = 'REJECTED';
      reason = notes || 'Application rejected by Verifier.';
      this.state.applications[appIndex] = {
        ...app,
        currentStatus: newStatus,
        statusReason: reason,
        updatedAt: new Date().toISOString()
      };
      this.addAudit('VERIFIER_REJECTED', 'APPLICATION', app.id, reason);
      this.addNotification(student.userId, 'Application Rejected', reason, 'warning', `/applications/${app.id}`);
    }

    this.saveState();
  }

  // Sanction Application
  sanctionApplication(applicationId: string, amount: number = 48000) {
    const appIndex = this.state.applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) return;

    const student = this.getActiveStudent();
    const app = this.state.applications[appIndex];
    const orderNo = `MOTA/ST-SCHOL/2026/MAH/${Math.floor(1000 + Math.random() * 9000)}`;

    this.state.applications[appIndex] = {
      ...app,
      currentStatus: 'SANCTIONED',
      statusReason: `Sanction Order ${orderNo} approved for ₹${amount.toLocaleString('en-IN')}. Forwarded to PFMS for DBT disbursement.`,
      sanctionAmount: amount,
      sanctionOrderNumber: orderNo,
      updatedAt: new Date().toISOString()
    };

    // Update payment record
    const paymentIndex = this.state.payments.findIndex(p => p.applicationId === applicationId);
    const paymentRecord: PaymentRecord = {
      id: `PAY-${app.id}`,
      applicationId: app.id,
      studentId: student.id,
      studentName: student.fullName,
      schemeName: app.schemeName,
      amount,
      state: 'SANCTIONED',
      pfmsTransactionId: `PFMS-MOTA-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      dbtPaymentMode: 'Aadhaar_Payment_Bridge_System',
      maskedAccount: student.bankAccountMasked,
      sanctionDate: new Date().toISOString().split('T')[0],
      remarks: 'Sanction order approved. Bank credit instruction queued on PFMS.'
    };

    if (paymentIndex !== -1) {
      this.state.payments[paymentIndex] = paymentRecord;
    } else {
      this.state.payments.push(paymentRecord);
    }

    this.addAudit('SANCTION_ORDER_ISSUED', 'PAYMENT', paymentRecord.id, `Sanctioned ₹${amount.toLocaleString('en-IN')} for ${app.id}`);
    this.addNotification(
      student.userId,
      'Scholarship Sanctioned! 🎉',
      `Sanction order for ₹${amount.toLocaleString('en-IN')} has been generated. Direct Beneficiary Transfer initiated.`,
      'success',
      `/applications/${app.id}`
    );

    this.saveState();
  }

  // Trigger DBT Disbursement
  async processDbtDisbursement(applicationId: string) {
    const appIndex = this.state.applications.findIndex(a => a.id === applicationId);
    const paymentIndex = this.state.payments.findIndex(p => p.applicationId === applicationId);
    if (appIndex === -1 || paymentIndex === -1) return;

    const student = this.getActiveStudent();
    const app = this.state.applications[appIndex];
    const pay = this.state.payments[paymentIndex];

    // Step 1: Processing
    this.state.payments[paymentIndex] = {
      ...pay,
      state: 'PROCESSING',
      processingDate: new Date().toISOString().split('T')[0],
      remarks: 'APBS packet in clearing transit at National Automated Clearing House (NACH).'
    };
    this.state.applications[appIndex] = {
      ...app,
      currentStatus: 'DBT_PROCESSING',
      statusReason: 'Direct Beneficiary Transfer (DBT) packet transmitted to Reserve Bank of India / NPCI APBS gateway.',
      updatedAt: new Date().toISOString()
    };
    this.saveState();

    // Step 2: Settled / Disbursed
    await new Promise(r => setTimeout(r, 600));

    const utr = `SBIN${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    this.state.payments[paymentIndex] = {
      ...this.state.payments[paymentIndex],
      state: 'PROCESSED',
      disbursedDate: new Date().toISOString().split('T')[0],
      remarks: `Amount credited to Aadhaar-linked Bank Account (${student.bankAccountMasked}). UTR Ref: ${utr}.`
    };
    this.state.applications[appIndex] = {
      ...this.state.applications[appIndex],
      currentStatus: 'DBT_DISBURSED',
      statusReason: `₹${pay.amount.toLocaleString('en-IN')} successfully credited to Aadhaar-seeded account (${student.bankAccountMasked}) via PFMS DBT.`,
      updatedAt: new Date().toISOString()
    };

    this.addAudit('DBT_CREDIT_CONFIRMED', 'PAYMENT', pay.id, `Disbursed ₹${pay.amount} via APBS. UTR: ${utr}`);
    this.addNotification(
      student.userId,
      'DBT Payment Credited! 💰',
      `₹${pay.amount.toLocaleString('en-IN')} has been successfully transferred to your Aadhaar-linked bank account (${student.bankAccountMasked}). UTR: ${utr}.`,
      'success',
      `/payments`
    );

    this.saveState();
  }

  // Fast-Forward Full Demo Journey
  async runFastForwardDemo() {
    // 1. Reset state to initial deficiency state
    this.resetDemoData();
    await new Promise(r => setTimeout(r, 400));
    
    // 2. Resolve deficiency with updated Bonafide
    this.resolveDeficiencyWithUpdatedBonafide('MOTA-2026-ST-1042');
    await new Promise(r => setTimeout(r, 500));

    // 3. Re-run verification (now it passes)
    await this.executeVerification('MOTA-2026-ST-1042');
    await new Promise(r => setTimeout(r, 500));

    // 4. Sanction
    this.sanctionApplication('MOTA-2026-ST-1042', 48000);
    await new Promise(r => setTimeout(r, 500));

    // 5. DBT Disburse
    await this.processDbtDisbursement('MOTA-2026-ST-1042');
  }

  // Reset Demo to Initial Baseline
  resetDemoData() {
    mockInstitution.setUpdatedAffiliationBonafide(false);
    this.state = getInitialState();
    this.saveState();
  }
}

export const store = new Store();
