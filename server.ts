/**
 * TribEd REST Backend Server (Express + TypeScript)
 * Ministry of Tribal Affairs (MoTA) Orchestration API
 * 
 * In local dev, Vite middleware is mounted into Express on Port 3000.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { SCHOLARSHIP_SCHEMES } from './src/data/scholarshipSchemes.ts';
import { 
  SEED_USERS, 
  PRIMARY_STUDENT, 
  OTHER_STUDENTS, 
  INITIAL_DOCUMENTS, 
  INITIAL_APPLICATION, 
  INITIAL_PAYMENT, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from './src/data/seedData.ts';
import { evaluateStudentEligibility, screenAllScholarshipsForStudent } from './src/services/eligibilityEngine.ts';
import { runAutomatedVerification } from './src/services/verificationEngine.ts';
import { mockInstitution } from './src/services/mockAdapters.ts';
import { jagoService } from './src/services/jagoService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

// In-Memory Database for API orchestration
let users = [...SEED_USERS];
let currentUser = users[0];
let students = [PRIMARY_STUDENT, ...OTHER_STUDENTS];
let documents = [...INITIAL_DOCUMENTS];
let applications = [{ ...INITIAL_APPLICATION }];
let payments = [{ ...INITIAL_PAYMENT }];
let notifications = [...INITIAL_NOTIFICATIONS];
let auditLogs = [...INITIAL_AUDIT_LOGS];

function recordAudit(actorName: string, role: string, action: string, entityType: string, entityId: string, details: string) {
  auditLogs.unshift({
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actor: `${actorName} (${role})`,
    actorRole: role as any,
    action,
    entityType: entityType as any,
    entityId,
    details
  });
}

function recordNotification(userId: string, title: string, message: string, type: 'info' | 'warning' | 'success' | 'action_required', linkRoute?: string) {
  notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    userId,
    title,
    message,
    type,
    linkRoute,
    createdAt: new Date().toISOString(),
    isRead: false
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // -------------------------------------------------------------------------
  // REST API ROUTES (/api/*)
  // -------------------------------------------------------------------------

  // Health
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'UP',
      service: 'TribEd-Orchestrator-API',
      timestamp: new Date().toISOString(),
      adapters: {
        identity: 'MockIdentityAdapter (UIDAI Demo Sandbox)',
        digilocker: 'MockDigiLockerAdapter (e-District / DigiLocker)',
        academic: 'MockAcademicRecordAdapter (APAAR Registry)',
        institution: 'MockInstitutionAdapter (AISHE Master Registry)',
        payment: 'MockPaymentAdapter (PFMS / APBS)'
      }
    });
  });

  // Auth / Current User
  app.get('/api/auth/me', (req: Request, res: Response) => {
    res.json(currentUser);
  });

  app.post('/api/auth/switch-user', (req: Request, res: Response) => {
    const { role } = req.body;
    const target = users.find(u => u.role === role) || users[0];
    currentUser = target;
    res.json({ success: true, currentUser });
  });

  // Students
  app.get('/api/students/:id', (req: Request, res: Response) => {
    const student = students.find(s => s.id === req.params.id) || students[0];
    res.json(student);
  });

  // Schemes
  app.get('/api/scholarships', (req: Request, res: Response) => {
    res.json(SCHOLARSHIP_SCHEMES);
  });

  app.get('/api/scholarships/:id', (req: Request, res: Response) => {
    const scheme = SCHOLARSHIP_SCHEMES.find(s => s.id === req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  });

  // Pre-Screening Eligibility Check
  app.post('/api/eligibility/screen', (req: Request, res: Response) => {
    const student = students.find(s => s.id === (req.body.studentId || PRIMARY_STUDENT.id)) || PRIMARY_STUDENT;
    const results = screenAllScholarshipsForStudent(student);
    res.json({ studentId: student.id, results });
  });

  // Applications
  app.get('/api/applications', (req: Request, res: Response) => {
    const studentId = req.query.studentId as string;
    if (studentId) {
      return res.json(applications.filter(a => a.studentId === studentId));
    }
    res.json(applications);
  });

  app.get('/api/applications/:id', (req: Request, res: Response) => {
    const appItem = applications.find(a => a.id === req.params.id);
    if (!appItem) return res.status(404).json({ error: 'Application not found' });
    res.json(appItem);
  });

  app.post('/api/applications', (req: Request, res: Response) => {
    const { studentId, schemeId, schemeName } = req.body;
    const student = students.find(s => s.id === studentId) || PRIMARY_STUDENT;
    const studentDocs = documents.filter(d => d.studentId === student.id);

    const newApp = {
      id: `MOTA-2026-ST-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: student.id,
      schemeId,
      schemeName: schemeName || 'Post-Matric Scholarship for ST Students',
      appliedDate: new Date().toISOString().split('T')[0],
      currentStatus: 'SUBMITTED' as const,
      statusReason: 'Application submitted. Queued for automated rule verification.',
      attachedDocumentIds: studentDocs.map(d => d.id),
      verificationChecks: [],
      updatedAt: new Date().toISOString()
    };

    applications.unshift(newApp);
    recordAudit(currentUser.name, currentUser.role, 'APPLICATION_SUBMITTED', 'APPLICATION', newApp.id, `Created application for ${newApp.schemeName}`);
    recordNotification(student.userId, 'Application Submitted', `Application ${newApp.id} submitted for ${newApp.schemeName}.`, 'success', `/applications/${newApp.id}`);

    res.status(201).json(newApp);
  });

  // Verification Run
  app.post('/api/applications/:id/verify', async (req: Request, res: Response) => {
    const appIndex = applications.findIndex(a => a.id === req.params.id);
    if (appIndex === -1) return res.status(404).json({ error: 'Application not found' });

    const appItem = applications[appIndex];
    const student = students.find(s => s.id === appItem.studentId) || PRIMARY_STUDENT;
    const appDocs = documents.filter(d => appItem.attachedDocumentIds.includes(d.id));

    const result = await runAutomatedVerification(student, appItem, appDocs);

    if (result.hasDeficiency && result.deficiencyDetails) {
      const defRecord = {
        id: `DEF-${Date.now()}`,
        applicationId: appItem.id,
        checkType: result.deficiencyDetails.checkType,
        issueTitle: result.deficiencyDetails.issueTitle,
        issueDescription: result.deficiencyDetails.issueDescription,
        requiredAction: result.deficiencyDetails.requiredAction,
        status: 'OPEN' as const,
        createdAt: new Date().toISOString()
      };

      applications[appIndex] = {
        ...appItem,
        currentStatus: 'DEFICIENCY_NOTED',
        statusReason: result.summary,
        verificationChecks: result.checks,
        deficiency: defRecord,
        updatedAt: new Date().toISOString()
      };

      recordAudit('Automated Verification Engine', 'SYSTEM', 'DEFICIENCY_FLAGGED', 'DEFICIENCY', defRecord.id, result.deficiencyDetails.issueTitle);
      recordNotification(student.userId, `Action Required: ${defRecord.issueTitle}`, defRecord.requiredAction, 'action_required', `/applications/${appItem.id}`);
    } else if (result.overallStatus === 'PASS') {
      applications[appIndex] = {
        ...appItem,
        currentStatus: 'VERIFIED',
        statusReason: 'All 5 statutory multi-source automated checks verified successfully.',
        verificationChecks: result.checks,
        deficiency: undefined,
        updatedAt: new Date().toISOString()
      };

      recordAudit('Automated Verification Engine', 'SYSTEM', 'VERIFICATION_PASSED', 'APPLICATION', appItem.id, 'Statutory checks cleared.');
      recordNotification(student.userId, 'Verification Complete: Verified', `Application ${appItem.id} verified.`, 'success', `/applications/${appItem.id}`);
    }

    res.json(applications[appIndex]);
  });

  // Resolve Deficiency (Upload Updated Bonafide)
  app.post('/api/applications/:id/deficiency/resolve', (req: Request, res: Response) => {
    const appIndex = applications.findIndex(a => a.id === req.params.id);
    if (appIndex === -1) return res.status(404).json({ error: 'Application not found' });

    const appItem = applications[appIndex];
    const student = students.find(s => s.id === appItem.studentId) || PRIMARY_STUDENT;

    // Create updated bonafide
    const updatedBonafide = {
      id: `DOC-BONAFIDE-2026-${Date.now()}`,
      studentId: student.id,
      type: 'BONAFIDE_CERTIFICATE' as const,
      title: 'Current Academic Year 2026-27 Bonafide Certificate',
      documentNumber: 'DIT-REG-2026-BONA-4481',
      source: 'MANUAL_UPLOAD' as const,
      verifiedStatus: 'VERIFIED' as const,
      issuer: 'Demo Institute of Technology (Dean Academic Office)',
      issuedDate: new Date().toISOString().split('T')[0],
      syntheticHash: 'sha256-verified-bonafide-2026',
      fileSize: '480 KB'
    };

    documents = [updatedBonafide, ...documents.filter(d => d.type !== 'BONAFIDE_CERTIFICATE')];
    mockInstitution.setUpdatedAffiliationBonafide(true);

    const attachedDocIds = Array.from(new Set([...appItem.attachedDocumentIds, updatedBonafide.id]));
    const updatedDeficiency = appItem.deficiency ? {
      ...appItem.deficiency,
      status: 'RESOLVED' as const,
      resolvedAt: new Date().toISOString(),
      resolutionNotes: 'Updated Bonafide for AY 2026-27 submitted.',
      resolutionDocumentId: updatedBonafide.id
    } : undefined;

    applications[appIndex] = {
      ...appItem,
      attachedDocumentIds: attachedDocIds,
      currentStatus: 'CORRECTION_SUBMITTED',
      statusReason: 'Correction submitted by student with AY 2026-27 Bonafide Certificate. Ready for re-verification.',
      deficiency: updatedDeficiency,
      updatedAt: new Date().toISOString()
    };

    recordAudit(currentUser.name, currentUser.role, 'DEFICIENCY_RESOLVED_BY_STUDENT', 'DEFICIENCY', appItem.deficiency?.id || 'DEF', 'Uploaded AY 2026-27 Bonafide.');
    recordNotification(student.userId, 'Correction Submitted', `Bonafide Certificate submitted for ${appItem.id}.`, 'info', `/applications/${appItem.id}`);

    res.json(applications[appIndex]);
  });

  // Admin Reviewer Action
  app.post('/api/applications/:id/admin/action', (req: Request, res: Response) => {
    const { action, notes } = req.body;
    const appIndex = applications.findIndex(a => a.id === req.params.id);
    if (appIndex === -1) return res.status(404).json({ error: 'Application not found' });

    const appItem = applications[appIndex];
    const student = students.find(s => s.id === appItem.studentId) || PRIMARY_STUDENT;

    if (action === 'APPROVE') {
      const updatedChecks = appItem.verificationChecks.map(c => 
        c.checkType === 'INSTITUTION' ? { ...c, status: 'PASS' as const, details: 'Manually verified and confirmed by Ministry Verifier.' } : c
      );

      applications[appIndex] = {
        ...appItem,
        currentStatus: 'VERIFIED',
        statusReason: notes || 'Institutional affiliation and student documents manually inspected and approved by Verifier.',
        verificationChecks: updatedChecks,
        deficiency: appItem.deficiency ? { ...appItem.deficiency, status: 'RESOLVED', resolutionNotes: notes } : undefined,
        updatedAt: new Date().toISOString()
      };

      recordAudit(currentUser.name, 'verifier', 'VERIFIER_APPROVED', 'APPLICATION', appItem.id, notes || 'Approved exception manually.');
      recordNotification(student.userId, 'Application Verified', `Application ${appItem.id} verified by Reviewer.`, 'success', `/applications/${appItem.id}`);
    }

    res.json(applications[appIndex]);
  });

  // Sanction Application
  app.post('/api/applications/:id/sanction', (req: Request, res: Response) => {
    const appIndex = applications.findIndex(a => a.id === req.params.id);
    if (appIndex === -1) return res.status(404).json({ error: 'Application not found' });

    const appItem = applications[appIndex];
    const student = students.find(s => s.id === appItem.studentId) || PRIMARY_STUDENT;
    const amount = req.body.amount || 48000;
    const orderNo = `MOTA/ST-SCHOL/2026/MAH/${Math.floor(1000 + Math.random() * 9000)}`;

    applications[appIndex] = {
      ...appItem,
      currentStatus: 'SANCTIONED',
      statusReason: `Sanction Order ${orderNo} approved for ₹${amount.toLocaleString('en-IN')}. Forwarded to PFMS for DBT disbursement.`,
      sanctionAmount: amount,
      sanctionOrderNumber: orderNo,
      updatedAt: new Date().toISOString()
    };

    const paymentIndex = payments.findIndex(p => p.applicationId === appItem.id);
    const paymentRecord = {
      id: `PAY-${appItem.id}`,
      applicationId: appItem.id,
      studentId: student.id,
      studentName: student.fullName,
      schemeName: appItem.schemeName,
      amount,
      state: 'SANCTIONED' as const,
      pfmsTransactionId: `PFMS-MOTA-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      dbtPaymentMode: 'Aadhaar_Payment_Bridge_System' as const,
      maskedAccount: student.bankAccountMasked,
      sanctionDate: new Date().toISOString().split('T')[0],
      remarks: 'Sanction order approved. Bank credit instruction queued on PFMS.'
    };

    if (paymentIndex !== -1) {
      payments[paymentIndex] = paymentRecord;
    } else {
      payments.push(paymentRecord);
    }

    recordAudit(currentUser.name, currentUser.role, 'SANCTION_ORDER_ISSUED', 'PAYMENT', paymentRecord.id, `Sanctioned ₹${amount}`);
    recordNotification(student.userId, 'Scholarship Sanctioned! 🎉', `Sanction order for ₹${amount} approved.`, 'success', `/applications/${appItem.id}`);

    res.json({ application: applications[appIndex], payment: paymentRecord });
  });

  // DBT Disbursement
  app.post('/api/applications/:id/disburse', async (req: Request, res: Response) => {
    const appIndex = applications.findIndex(a => a.id === req.params.id);
    const payIndex = payments.findIndex(p => p.applicationId === req.params.id);
    if (appIndex === -1 || payIndex === -1) return res.status(404).json({ error: 'Application or Payment record not found' });

    const appItem = applications[appIndex];
    const payItem = payments[payIndex];
    const student = students.find(s => s.id === appItem.studentId) || PRIMARY_STUDENT;

    const utr = `SBIN${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    payments[payIndex] = {
      ...payItem,
      state: 'PROCESSED',
      disbursedDate: new Date().toISOString().split('T')[0],
      remarks: `Amount credited to Aadhaar-linked Bank Account (${student.bankAccountMasked}). UTR Ref: ${utr}.`
    };

    applications[appIndex] = {
      ...appItem,
      currentStatus: 'DBT_DISBURSED',
      statusReason: `₹${payItem.amount.toLocaleString('en-IN')} successfully credited via PFMS APBS.`,
      updatedAt: new Date().toISOString()
    };

    recordAudit('PFMS / APBS Payment Gateway', 'SYSTEM', 'DBT_CREDIT_CONFIRMED', 'PAYMENT', payItem.id, `Disbursed ₹${payItem.amount}. UTR: ${utr}`);
    recordNotification(student.userId, 'DBT Payment Credited! 💰', `₹${payItem.amount.toLocaleString('en-IN')} credited to ${student.bankAccountMasked}.`, 'success', `/payments`);

    res.json({ application: applications[appIndex], payment: payments[payIndex] });
  });

  // Documents
  app.get('/api/documents', (req: Request, res: Response) => {
    const studentId = req.query.studentId as string;
    if (studentId) {
      return res.json(documents.filter(d => d.studentId === studentId));
    }
    res.json(documents);
  });

  // Payments
  app.get('/api/payments', (req: Request, res: Response) => {
    res.json(payments);
  });

  // Notifications
  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json(notifications);
  });

  app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
    notifications = notifications.map(n => n.id === req.params.id ? { ...n, isRead: true } : n);
    res.json({ success: true });
  });

  // JAGO Chat
  app.post('/api/jago/chat', async (req: Request, res: Response) => {
    const { message, language } = req.body;
    const response = await jagoService.processUserQuery(message, language || 'en');
    res.json(response);
  });

  // Audit Logs
  app.get('/api/audit-logs', (req: Request, res: Response) => {
    res.json(auditLogs);
  });

  // Reset Demo
  app.post('/api/demo/reset', (req: Request, res: Response) => {
    mockInstitution.setUpdatedAffiliationBonafide(false);
    users = [...SEED_USERS];
    currentUser = users[0];
    students = [PRIMARY_STUDENT, ...OTHER_STUDENTS];
    documents = [...INITIAL_DOCUMENTS];
    applications = [{ ...INITIAL_APPLICATION }];
    payments = [{ ...INITIAL_PAYMENT }];
    notifications = [...INITIAL_NOTIFICATIONS];
    auditLogs = [...INITIAL_AUDIT_LOGS];
    res.json({ success: true, message: 'Deterministic demo data reset successfully' });
  });

  // -------------------------------------------------------------------------
  // Vite Dev Server / Static Hosting
  // -------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TribEd Orchestrator server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start TribEd server:', err);
  process.exit(1);
});
