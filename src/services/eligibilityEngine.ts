/**
 * Rule-Based Eligibility Pre-Screening Engine
 * Evaluates student profiles against centralized MoTA scheme rules.
 * 
 * NOTE: Following official government standards, this produces "Potentially Applicable"
 * indications with transparent criteria breakdown, never claiming "officially eligible"
 * prior to statutory verification.
 */

import { StudentProfile, ScholarshipScheme } from '../types';
import { SCHOLARSHIP_SCHEMES, EDUCATION_LEVEL_ORDER } from '../data/scholarshipSchemes';

export interface EligibilityEvaluationResult {
  scheme: ScholarshipScheme;
  isPotentiallyApplicable: boolean;
  matchScorePercent: number;
  matchedCriteria: {
    title: string;
    isSatisfied: boolean;
    detail: string;
  }[];
  unmetCriteria: {
    title: string;
    detail: string;
  }[];
  verificationNeeded: string[];
  recommendationLevel: 'HIGH_MATCH' | 'MODERATE_MATCH' | 'NOT_APPLICABLE';
}

export function evaluateStudentEligibility(
  profile: StudentProfile,
  scheme: ScholarshipScheme
): EligibilityEvaluationResult {
  const matchedCriteria: { title: string; isSatisfied: boolean; detail: string }[] = [];
  const unmetCriteria: { title: string; detail: string }[] = [];
  const verificationNeeded: string[] = [];

  let scorePoints = 0;
  const totalPoints = 4; // Category, Education Level, Income Ceiling, Citizenship/Domicile

  // 1. Category Check
  if (scheme.rules.applicableCategories.includes(profile.category)) {
    scorePoints += 1;
    matchedCriteria.push({
      title: 'ST Category Alignment',
      isSatisfied: true,
      detail: `Student belongs to recognized Scheduled Tribe (${profile.subTribe || 'ST'}).`
    });
  } else {
    unmetCriteria.push({
      title: 'Category Mismatch',
      detail: `Scheme strictly reserved for Scheduled Tribe candidates. Profile category: ${profile.category}.`
    });
  }

  // 2. Education Level Check
  const studentLevelOrder = EDUCATION_LEVEL_ORDER[profile.currentEducationLevel] || 0;
  const minLevelOrder = EDUCATION_LEVEL_ORDER[scheme.rules.minEducationLevel] || 0;
  const maxLevelOrder = EDUCATION_LEVEL_ORDER[scheme.rules.maxEducationLevel] || 0;

  if (studentLevelOrder >= minLevelOrder && studentLevelOrder <= maxLevelOrder) {
    scorePoints += 1;
    matchedCriteria.push({
      title: 'Course & Education Stage Match',
      isSatisfied: true,
      detail: `Current level '${profile.currentEducationLevel}' falls within eligible range (${scheme.rules.minEducationLevel} to ${scheme.rules.maxEducationLevel}).`
    });
  } else {
    unmetCriteria.push({
      title: 'Education Level Ineligible',
      detail: `Scheme requires stage between ${scheme.rules.minEducationLevel} and ${scheme.rules.maxEducationLevel}. Student is currently at '${profile.currentEducationLevel}'.`
    });
  }

  // 3. Family Annual Income Check
  if (profile.familyAnnualIncome <= scheme.rules.maxIncomeCeiling) {
    scorePoints += 1;
    matchedCriteria.push({
      title: 'Family Income Criteria',
      isSatisfied: true,
      detail: `Annual income ₹${profile.familyAnnualIncome.toLocaleString('en-IN')} is within maximum ceiling of ₹${scheme.rules.maxIncomeCeiling.toLocaleString('en-IN')}.`
    });
  } else {
    unmetCriteria.push({
      title: 'Income Limit Exceeded',
      detail: `Annual family income ₹${profile.familyAnnualIncome.toLocaleString('en-IN')} exceeds the scheme ceiling of ₹${scheme.rules.maxIncomeCeiling.toLocaleString('en-IN')}.`
    });
  }

  // 4. Institutional & Domicile Alignment
  if (profile.stateOfDomicile) {
    scorePoints += 1;
    matchedCriteria.push({
      title: 'Domicile & Residency Validated',
      isSatisfied: true,
      detail: `Resident of ${profile.stateOfDomicile} (${profile.district} district).`
    });
  }

  // Verification requirements needed before official award
  if (scheme.rules.eligibleInstitutionsType === 'Top_Class_Institutes') {
    verificationNeeded.push('MoTA Notified Premier Institute Registry check (AISHE/NIRF top tier)');
  } else if (scheme.rules.eligibleInstitutionsType === 'Foreign_Accredited') {
    verificationNeeded.push('Foreign University unconditional admission offer and QS World Ranking tier');
  } else {
    verificationNeeded.push('State DTE / AISHE Institutional Affiliation verification');
  }

  verificationNeeded.push('Direct Beneficiary Transfer (DBT) Aadhaar-seeded bank account check');
  verificationNeeded.push('Mandatory digital certificate signatures in DigiLocker repository');

  const matchScorePercent = Math.round((scorePoints / totalPoints) * 100);
  const isPotentiallyApplicable = unmetCriteria.length === 0;

  let recommendationLevel: 'HIGH_MATCH' | 'MODERATE_MATCH' | 'NOT_APPLICABLE' = 'NOT_APPLICABLE';
  if (matchScorePercent === 100) {
    recommendationLevel = 'HIGH_MATCH';
  } else if (matchScorePercent >= 60) {
    recommendationLevel = 'MODERATE_MATCH';
  }

  return {
    scheme,
    isPotentiallyApplicable,
    matchScorePercent,
    matchedCriteria,
    unmetCriteria,
    verificationNeeded,
    recommendationLevel
  };
}

export function screenAllScholarshipsForStudent(profile: StudentProfile): EligibilityEvaluationResult[] {
  return SCHOLARSHIP_SCHEMES.map(scheme => evaluateStudentEligibility(profile, scheme))
    .sort((a, b) => b.matchScorePercent - a.matchScorePercent);
}
