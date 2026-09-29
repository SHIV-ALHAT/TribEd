/**
 * TribEd API Client
 * Connects frontend views to backend REST endpoints.
 */

import { Application, DocumentItem, PaymentRecord, StudentProfile, User } from '../types';
import { store } from './store';

export const apiClient = {
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch {
      return { status: 'UP', service: 'TribEd-LocalStore' };
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return store.getState().currentUser;
  },

  async switchUser(role: 'student' | 'verifier' | 'admin'): Promise<User> {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        const data = await res.json();
        store.setCurrentUser(data.currentUser);
        return data.currentUser;
      }
    } catch {
      // fallback
    }
    const state = store.getState();
    const target = state.currentUser.role === role ? state.currentUser : {
      ...state.currentUser,
      role
    };
    store.setCurrentUser(target);
    return target;
  },

  async getStudent(id: string): Promise<StudentProfile> {
    try {
      const res = await fetch(`/api/students/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return store.getActiveStudent();
  },

  async screenEligibility(studentId: string) {
    try {
      const res = await fetch('/api/eligibility/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return { results: [] };
  },

  async getApplications(): Promise<Application[]> {
    try {
      const res = await fetch('/api/applications');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return store.getState().applications;
  },

  async submitCorrection(applicationId: string) {
    try {
      const res = await fetch(`/api/applications/${applicationId}/deficiency/resolve`, {
        method: 'POST'
      });
      if (res.ok) {
        const updated = await res.json();
        store.resolveDeficiencyWithUpdatedBonafide(applicationId);
        return updated;
      }
    } catch {
      // fallback
    }
    store.resolveDeficiencyWithUpdatedBonafide(applicationId);
    return store.getApplicationById(applicationId);
  },

  async triggerVerification(applicationId: string) {
    try {
      const res = await fetch(`/api/applications/${applicationId}/verify`, {
        method: 'POST'
      });
      if (res.ok) {
        const updated = await res.json();
        await store.executeVerification(applicationId);
        return updated;
      }
    } catch {
      // fallback
    }
    await store.executeVerification(applicationId);
    return store.getApplicationById(applicationId);
  },

  async adminAction(applicationId: string, action: 'APPROVE' | 'REQUEST_CORRECTION' | 'REJECT', notes: string) {
    try {
      const res = await fetch(`/api/applications/${applicationId}/admin/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes })
      });
      if (res.ok) {
        const updated = await res.json();
        store.adminReviewAction(applicationId, action, notes);
        return updated;
      }
    } catch {
      // fallback
    }
    store.adminReviewAction(applicationId, action, notes);
    return store.getApplicationById(applicationId);
  },

  async sanctionApplication(applicationId: string, amount: number = 48000) {
    try {
      const res = await fetch(`/api/applications/${applicationId}/sanction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      if (res.ok) {
        const data = await res.json();
        store.sanctionApplication(applicationId, amount);
        return data;
      }
    } catch {
      // fallback
    }
    store.sanctionApplication(applicationId, amount);
    return { application: store.getApplicationById(applicationId) };
  },

  async disburseDbt(applicationId: string) {
    try {
      const res = await fetch(`/api/applications/${applicationId}/disburse`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        await store.processDbtDisbursement(applicationId);
        return data;
      }
    } catch {
      // fallback
    }
    await store.processDbtDisbursement(applicationId);
    return { application: store.getApplicationById(applicationId) };
  },

  async askJago(message: string, language: string = 'en') {
    try {
      const res = await fetch('/api/jago/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language })
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return await store.getState(); // or jagoService directly
  },

  async resetDemo() {
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
    } catch {
      // fallback
    }
    store.resetDemoData();
  }
};
