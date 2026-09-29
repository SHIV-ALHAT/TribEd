class Student {
  final String id;
  final String fullName;
  final String category;
  final String subTribe;
  final String syntheticAadhaarRef;
  final String? apaarId;
  final String stateOfDomicile;
  final String district;
  final double familyAnnualIncome;
  final String currentEducationLevel;
  final String courseName;
  final int currentYear;
  final String institutionName;
  final String institutionCode;
  final String bankAccountMasked;

  Student({
    required this.id,
    required this.fullName,
    required this.category,
    required this.subTribe,
    required this.syntheticAadhaarRef,
    this.apaarId,
    required this.stateOfDomicile,
    required this.district,
    required this.familyAnnualIncome,
    required this.currentEducationLevel,
    required this.courseName,
    required this.currentYear,
    required this.institutionName,
    required this.institutionCode,
    required this.bankAccountMasked,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id'] ?? '',
      fullName: json['full_name'] ?? json['fullName'] ?? '',
      category: json['category'] ?? 'ST',
      subTribe: json['sub_tribe'] ?? json['subTribe'] ?? '',
      syntheticAadhaarRef: json['synthetic_aadhaar_ref'] ?? json['syntheticAadhaarRef'] ?? '',
      apaarId: json['apaar_id'] ?? json['apaarId'],
      stateOfDomicile: json['state_of_domicile'] ?? json['stateOfDomicile'] ?? '',
      district: json['district'] ?? '',
      familyAnnualIncome: (json['family_annual_income'] ?? json['familyAnnualIncome'] ?? 0).toDouble(),
      currentEducationLevel: json['current_education_level'] ?? json['currentEducationLevel'] ?? '',
      courseName: json['course_name'] ?? json['courseName'] ?? '',
      currentYear: json['current_year'] ?? json['currentYear'] ?? 1,
      institutionName: json['institution_name'] ?? json['institutionName'] ?? '',
      institutionCode: json['institution_code'] ?? json['institutionCode'] ?? '',
      bankAccountMasked: json['bank_account_masked'] ?? json['bankAccountMasked'] ?? '',
    );
  }
}

class Scheme {
  final String id;
  final String code;
  final String name;
  final String? hindiName;
  final double annualBenefitMax;
  final String description;
  final String benefitsDescription;
  final String deadlineDate;

  Scheme({
    required this.id,
    required this.code,
    required this.name,
    this.hindiName,
    required this.annualBenefitMax,
    required this.description,
    required this.benefitsDescription,
    required this.deadlineDate,
  });

  factory Scheme.fromJson(Map<String, dynamic> json) {
    return Scheme(
      id: json['id'] ?? '',
      code: json['code'] ?? '',
      name: json['name'] ?? '',
      hindiName: json['hindi_name'] ?? json['hindiName'],
      annualBenefitMax: (json['annual_benefit_max'] ?? json['annualBenefitMax'] ?? 0).toDouble(),
      description: json['description'] ?? '',
      benefitsDescription: json['benefits_description'] ?? json['benefitsDescription'] ?? '',
      deadlineDate: json['deadline_date'] ?? json['deadlineDate'] ?? '',
    );
  }
}

class AppCheck {
  final String id;
  final String checkType;
  final String name;
  final String status;
  final String adapterUsed;
  final String details;

  AppCheck({
    required this.id,
    required this.checkType,
    required this.name,
    required this.status,
    required this.adapterUsed,
    required this.details,
  });

  factory AppCheck.fromJson(Map<String, dynamic> json) {
    return AppCheck(
      id: json['id'] ?? '',
      checkType: json['check_type'] ?? json['checkType'] ?? '',
      name: json['name'] ?? '',
      status: json['status'] ?? 'PASS',
      adapterUsed: json['adapter_used'] ?? json['adapterUsed'] ?? '',
      details: json['details'] ?? '',
    );
  }
}

class SchemeApplication {
  final String id;
  final String studentId;
  final String schemeId;
  final String schemeName;
  final String appliedDate;
  String currentStatus;
  String statusReason;
  final List<AppCheck> checks;
  final double? sanctionAmount;

  SchemeApplication({
    required this.id,
    required this.studentId,
    required this.schemeId,
    required this.schemeName,
    required this.appliedDate,
    required this.currentStatus,
    required this.statusReason,
    this.checks = const [],
    this.sanctionAmount,
  });

  factory SchemeApplication.fromJson(Map<String, dynamic> json) {
    var rawChecks = json['verification_checks'] ?? json['verificationChecks'] ?? [];
    List<AppCheck> parsedChecks = (rawChecks as List).map((c) => AppCheck.fromJson(c)).toList();

    return SchemeApplication(
      id: json['id'] ?? '',
      studentId: json['student_id'] ?? json['studentId'] ?? '',
      schemeId: json['scheme_id'] ?? json['schemeId'] ?? '',
      schemeName: json['scheme_name'] ?? json['schemeName'] ?? '',
      appliedDate: json['applied_date'] ?? json['appliedDate'] ?? '',
      currentStatus: json['current_status'] ?? json['currentStatus'] ?? 'DRAFT',
      statusReason: json['status_reason'] ?? json['statusReason'] ?? '',
      checks: parsedChecks,
      sanctionAmount: json['sanction_amount'] != null ? (json['sanction_amount']).toDouble() : 48000.0,
    );
  }
}
