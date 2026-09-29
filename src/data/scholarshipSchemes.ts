/**
 * Centralized Scholarship Schemes & Policy Rules Layer
 * Ministry of Tribal Affairs (MoTA), Government of India
 * Derived from official guidelines for ST student welfare schemes.
 */

import { ScholarshipScheme } from '../types';

export const SCHOLARSHIP_SCHEMES: ScholarshipScheme[] = [
  {
    id: 'SCHEME-PRE-MATRIC',
    code: 'pre_matric',
    name: 'Pre-Matric Scholarship for ST Students (Classes IX & X)',
    hindiName: 'अनुसूचित जनजाति के छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति (कक्षा 9 और 10)',
    marathiName: 'अनुसूचित जमातीच्या विद्यार्थ्यांसाठी पूर्व-मॅट्रिक शिष्यवृत्ती (इयत्ता 9 वी व 10 वी)',
    ministry: 'Ministry of Tribal Affairs, Govt. of India',
    description: 'Financial assistance to reduce drop-out rates in secondary school stage (Class 9 & 10) among tribal students and encourage transition from elementary to secondary education.',
    annualBenefitMax: 7000,
    benefitsDescription: 'Day scholars: ₹3,500/year + Book grant; Hostellers: ₹7,000/year + special disability grant where applicable.',
    deadlineDate: '2026-11-30',
    targetBeneficiaries: 'Scheduled Tribe students studying full-time in Classes IX or X in recognized Government or Govt.-aided schools.',
    rules: {
      minEducationLevel: 'Pre-Matric',
      maxEducationLevel: 'Pre-Matric',
      maxIncomeCeiling: 250000, // ₹2.50 Lakh per annum
      applicableCategories: ['ST'],
      eligibleInstitutionsType: 'All_Recognized',
      mandatoryDocuments: ['ST_CERTIFICATE', 'INCOME_CERTIFICATE', 'ACADEMIC_MARKSHEET', 'BONAFIDE_CERTIFICATE']
    }
  },
  {
    id: 'SCHEME-POST-MATRIC',
    code: 'post_matric',
    name: 'Post-Matric Scholarship for ST Students',
    hindiName: 'अनुसूचित जनजाति के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति',
    marathiName: 'अनुसूचित जमातीच्या विद्यार्थ्यांसाठी मॅट्रिकोत्तर शिष्यवृत्ती',
    ministry: 'Ministry of Tribal Affairs, Govt. of India',
    description: 'Flagship centrally sponsored scheme providing comprehensive financial support for tribal students pursuing post-matriculation or post-secondary courses across recognized universities, polytechnics, and colleges.',
    annualBenefitMax: 48000,
    benefitsDescription: 'Covers non-refundable compulsory course fees (tuition, exam, lab fees) plus monthly maintenance allowance (up to ₹1,200/month for hostellers).',
    deadlineDate: '2026-12-15',
    targetBeneficiaries: 'Scheduled Tribe students who have passed Matriculation/Higher Secondary and are admitted to recognized post-matric professional, degree, or diploma programs.',
    rules: {
      minEducationLevel: 'Higher Secondary',
      maxEducationLevel: 'Postgraduate',
      maxIncomeCeiling: 250000, // ₹2.50 Lakh per annum
      applicableCategories: ['ST'],
      eligibleInstitutionsType: 'All_Recognized',
      mandatoryDocuments: ['ST_CERTIFICATE', 'INCOME_CERTIFICATE', 'ACADEMIC_MARKSHEET', 'BONAFIDE_CERTIFICATE', 'DOMICILE_CERTIFICATE']
    }
  },
  {
    id: 'SCHEME-TOP-CLASS',
    code: 'top_class',
    name: 'National Scholarship for Higher Education (Top Class Scheme)',
    hindiName: 'शीर्ष श्रेणी के संस्थानों में उच्च शिक्षा हेतु राष्ट्रीय छात्रवृत्ति',
    marathiName: 'उच्च शिक्षणासाठी राष्ट्रीय शिष्यवृत्ती (टॉप क्लास योजना)',
    ministry: 'Ministry of Tribal Affairs, Govt. of India',
    description: 'Encourages meritorious ST students to pursue quality education in 250+ notified premier institutes of excellence across India including IITs, NITs, IIMs, AIIMS, and National Law Universities.',
    annualBenefitMax: 200000,
    benefitsDescription: 'Full tuition fee reimbursement + living expenses allowance of ₹3,000/month + book grant of ₹5,000/year + one-time computer grant up to ₹45,000.',
    deadlineDate: '2026-11-15',
    targetBeneficiaries: 'ST students securing admission in notified premier institutes across engineering, medicine, management, and law.',
    rules: {
      minEducationLevel: 'Undergraduate',
      maxEducationLevel: 'Postgraduate',
      maxIncomeCeiling: 600000, // ₹6.00 Lakh per annum
      applicableCategories: ['ST'],
      eligibleInstitutionsType: 'Top_Class_Institutes',
      mandatoryDocuments: ['ST_CERTIFICATE', 'INCOME_CERTIFICATE', 'ACADEMIC_MARKSHEET', 'BONAFIDE_CERTIFICATE']
    }
  },
  {
    id: 'SCHEME-NFST',
    code: 'nfst',
    name: 'National Fellowship for ST Students (NFST)',
    hindiName: 'एसटी छात्रों के लिए राष्ट्रीय फैलोशिप (NFST - एम.फिल/पीएच.डी)',
    marathiName: 'एसटी विद्यार्थ्यांसाठी राष्ट्रीय फेलोशिप (NFST)',
    ministry: 'Ministry of Tribal Affairs, Govt. of India',
    description: 'Supports 750 fresh ST scholars annually pursuing regular and full-time M.Phil. and Ph.D. degrees in Sciences, Humanities, Social Sciences, and Engineering/Technology at recognized Indian Universities.',
    annualBenefitMax: 420000,
    benefitsDescription: 'JRF: ₹31,000/month + SRF: ₹35,000/month + Contingency grant (up to ₹25,000/year) + HRA as per central rules.',
    deadlineDate: '2026-12-31',
    targetBeneficiaries: 'ST post-graduates enrolled in full-time M.Phil/Ph.D. programs with UGC/CSIR or national university registration.',
    rules: {
      minEducationLevel: 'Doctoral',
      maxEducationLevel: 'Doctoral',
      maxIncomeCeiling: 800000, // Priority under ceiling, no strict bar for top ranks
      applicableCategories: ['ST'],
      minimumPreviousMarksPercent: 55,
      eligibleInstitutionsType: 'Centrally_Funded',
      mandatoryDocuments: ['ST_CERTIFICATE', 'ACADEMIC_MARKSHEET', 'BONAFIDE_CERTIFICATE']
    }
  },
  {
    id: 'SCHEME-NOS',
    code: 'nos',
    name: 'National Overseas Scholarship for ST Candidates (NOS)',
    hindiName: 'एसटी उम्मीदवारों के लिए राष्ट्रीय प्रवासी छात्रवृत्ति (विदेश अध्ययन)',
    marathiName: 'एसटी उमेदवारांसाठी राष्ट्रीय परदेशी शिष्यवृत्ती',
    ministry: 'Ministry of Tribal Affairs, Govt. of India',
    description: 'Provides financial assistance to 20 meritorious ST students annually to pursue Master’s and Ph.D. level studies in reputed universities outside India in engineering, science, agriculture, and humanities.',
    annualBenefitMax: 1800000,
    benefitsDescription: 'Actual tuition fees paid directly to foreign institution + annual maintenance allowance (US $15,400 or £9,900) + economy air passage + contingency allowance.',
    deadlineDate: '2026-10-31',
    targetBeneficiaries: 'ST students who have secured unconditional admission to top 500 QS world ranked universities abroad.',
    rules: {
      minEducationLevel: 'Postgraduate',
      maxEducationLevel: 'Doctoral',
      maxIncomeCeiling: 600000, // ₹6.00 Lakh per annum
      applicableCategories: ['ST'],
      minimumPreviousMarksPercent: 60,
      eligibleInstitutionsType: 'Foreign_Accredited',
      mandatoryDocuments: ['ST_CERTIFICATE', 'INCOME_CERTIFICATE', 'ACADEMIC_MARKSHEET', 'FOREIGN_OFFER_LETTER']
    }
  }
];

export const EDUCATION_LEVEL_ORDER: Record<string, number> = {
  'Pre-Matric': 1,
  'Higher Secondary': 2,
  'Undergraduate': 3,
  'Postgraduate': 4,
  'Doctoral': 5
};
