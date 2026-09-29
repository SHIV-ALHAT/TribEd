import 'package:flutter/material.dart';
import 'models/models.dart';

void main() {
  runApp(const TribEdMobileApp());
}

class TribEdMobileApp extends StatelessWidget {
  const TribEdMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TribEd - Ministry of Tribal Affairs',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFB45309), // Amber 700
          primary: const Color(0xFF92400E),
          surface: const Color(0xFFFAFAF9),
          background: const Color(0xFFF5F5F4),
        ),
        scaffoldBackgroundColor: const Color(0xFFF5F5F4),
        fontFamily: 'Roboto',
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  // Primary synthetic demo student: Asha Patil
  final Student student = Student(
    id: 'STUDENT-ASHA-001',
    fullName: 'Asha Patil',
    category: 'ST',
    subTribe: 'Bhil',
    syntheticAadhaarRef: 'XXXXXXXX4892',
    apaarId: 'APAAR-2024-MH-9941',
    stateOfDomicile: 'Maharashtra',
    district: 'Nandurbar',
    familyAnnualIncome: 240000.0,
    currentEducationLevel: 'Undergraduate',
    courseName: 'B.Tech in Computer Engineering',
    currentYear: 3,
    institutionName: 'Demo Institute of Technology',
    institutionCode: 'AISHE-C-49210',
    bankAccountMasked: 'A/C Ending 6721',
  );

  // Active application with intentional deficiency
  late SchemeApplication application;

  @override
  void initState() {
    super.initState();
    application = SchemeApplication(
      id: 'MOTA-2026-ST-1042',
      studentId: student.id,
      schemeId: 'SCHEME-POST-MATRIC',
      schemeName: 'Post-Matric Scholarship for ST Students',
      appliedDate: '2026-08-12',
      currentStatus: 'DEFICIENCY_NOTED',
      statusReason: 'Automated verification completed with 1 deficiency: Institution Affiliation requires renewal bonafide.',
      checks: [
        AppCheck(id: '1', checkType: 'IDENTITY', name: 'UIDAI Aadhaar Demographic Check', status: 'PASS', adapterUsed: 'UIDAI Sandbox', details: 'Aadhaar demographic identity match confirmed.'),
        AppCheck(id: '2', checkType: 'ST_CATEGORY', name: 'State e-District ST Certificate', status: 'PASS', adapterUsed: 'DigiLocker Sandbox', details: 'ST category verified under Bhil community.'),
        AppCheck(id: '3', checkType: 'INCOME', name: 'State Revenue Department Income', status: 'PASS', adapterUsed: 'Revenue Sandbox', details: 'Income ₹2,40,000 compliant with ceiling.'),
        AppCheck(id: '4', checkType: 'ACADEMIC', name: 'APAAR Academic Credit Check', status: 'PASS', adapterUsed: 'APAAR Registry', details: 'Active registration in B.Tech Sem 5.'),
        AppCheck(id: '5', checkType: 'INSTITUTION', name: 'AISHE Institution Affiliation', status: 'REVIEW_REQUIRED', adapterUsed: 'AISHE Sandbox', details: 'AISHE flags Demo Institute of Technology affiliation sync pending. Current AY 2026-27 Bonafide required.')
      ],
      sanctionAmount: 48000.0,
    );
  }

  void _resolveDeficiency() {
    setState(() {
      application.currentStatus = 'CORRECTION_SUBMITTED';
      application.statusReason = 'Updated Bonafide for AY 2026-27 submitted. Ready for re-verification.';
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('AY 2026-27 Bonafide Certificate uploaded successfully!'),
        backgroundColor: Colors.blueGrey,
      ),
    );
  }

  void _rerunVerification() {
    setState(() {
      application.currentStatus = 'VERIFIED';
      application.statusReason = 'All 5 statutory checks verified successfully. Forwarded for sanction order.';
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Verification cleared! Application marked VERIFIED.'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      _buildHomeScreen(),
      _buildSchemesScreen(),
      _buildJagoScreen(),
      _buildProfileScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF1C1917), // Stone 900
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFFD97706),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text('TE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
            ),
            const SizedBox(width: 8),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('TribEd', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                Text('Ministry of Tribal Affairs · Govt. of India', style: TextStyle(color: Color(0xFFFBBF24), fontSize: 9)),
              ],
            ),
          ],
        ),
      ),
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.school_outlined), selectedIcon: Icon(Icons.school), label: 'Schemes'),
          NavigationDestination(icon: Icon(Icons.auto_awesome_outlined), selectedIcon: Icon(Icons.auto_awesome), label: 'JAGO'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }

  // 1. HOME SCREEN
  Widget _buildHomeScreen() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Student Greeting Card
        Card(
          color: Colors.white,
          elevation: 1,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: const Color(0xFF92400E),
                  child: const Text('AP', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(student.fullName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 2),
                      Text('${student.category} (${student.subTribe}) · ${student.courseName}', style: const TextStyle(fontSize: 11, color: Colors.black54)),
                      Text(student.institutionName, style: const TextStyle(fontSize: 11, color: Colors.black82)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),

        // INTENTIONAL DEFICIENCY ALERT BANNER
        if (application.currentStatus == 'DEFICIENCY_NOTED')
          Card(
            color: const Color(0xFFFFFBEB), // Amber 50
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: const BorderSide(color: Color(0xFFF59E0B), width: 1.5),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.warning_amber_rounded, color: Color(0xFFD97706)),
                      SizedBox(width: 8),
                      Text('Action Required: Bonafide Renewal', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF78350F))),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Your submitted college bonafide corresponds to previous academic year (2024-25). Please upload certified Bonafide for current AY 2026-27.',
                    style: TextStyle(fontSize: 12, color: Color(0xFF78350F), height: 1.4),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _resolveDeficiency,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFB45309),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      icon: const Icon(Icons.upload_file, size: 16),
                      label: const Text('Upload AY 2026-27 Bonafide', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          ),

        if (application.currentStatus == 'CORRECTION_SUBMITTED')
          Card(
            color: const Color(0xFFEFF6FF), // Blue 50
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: const BorderSide(color: Colors.blueAccent),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Updated Bonafide Uploaded', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blueAccent)),
                  const SizedBox(height: 6),
                  const Text('Rerun automated verification to test affiliation with new certificate.', style: TextStyle(fontSize: 12)),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: _rerunVerification,
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.blueAccent, foregroundColor: Colors.white),
                    child: const Text('Rerun Automated Verification'),
                  ),
                ],
              ),
            ),
          ),

        const SizedBox(height: 16),

        // Active Application Card
        Card(
          color: Colors.white,
          elevation: 1,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(application.id, style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Colors.black54)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: application.currentStatus == 'VERIFIED' ? const Color(0xFFD1FAE5) : const Color(0xFFFEF3C7),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        application.currentStatus,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: application.currentStatus == 'VERIFIED' ? const Color(0xFF065F46) : const Color(0xFF92400E),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(application.schemeName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Text(application.statusReason, style: const TextStyle(fontSize: 11, color: Colors.black82)),
                const Divider(height: 24),
                const Text('Automated Checks Summary:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                ...application.checks.map((c) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 3),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(c.name, style: const TextStyle(fontSize: 11)),
                      Text(
                        c.status,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: c.status == 'PASS' ? Colors.green : Colors.amber.shade900,
                        ),
                      ),
                    ],
                  ),
                )),
              ],
            ),
          ),
        ),

        const SizedBox(height: 16),

        // DBT Direct Grant Card
        Card(
          color: const Color(0xFFECFDF5), // Emerald 50
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFF10B981)),
          ),
          child: const Padding(
            padding: EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Direct Beneficiary Transfer (DBT)', style: TextStyle(fontSize: 11, color: Color(0xFF065F46), fontWeight: FontWeight.bold)),
                    SizedBox(height: 4),
                    Text('₹48,000 / year', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF064E3B))),
                    SizedBox(height: 2),
                    Text('Target: SBI A/C Ending 6721 (Aadhaar Seeded)', style: TextStyle(fontSize: 10, color: Color(0xFF047857))),
                  ],
                ),
                Icon(Icons.account_balance, color: Color(0xFF059669), size: 32),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // 2. SCHEMES SCREEN
  Widget _buildSchemesScreen() {
    final schemes = [
      {'name': 'Pre-Matric Scholarship for ST Students', 'benefit': '₹7,000/yr', 'target': 'Classes IX & X'},
      {'name': 'Post-Matric Scholarship for ST Students', 'benefit': '₹48,000/yr', 'target': 'UG / PG & Professional Degree'},
      {'name': 'Top Class Education Scheme', 'benefit': '₹2,00,000/yr', 'target': 'IITs, NITs, IIMs, AIIMS, NLUs'},
      {'name': 'National Fellowship for ST Students (NFST)', 'benefit': '₹4,20,000/yr', 'target': 'Full-time M.Phil / Ph.D. scholars'},
      {'name': 'National Overseas Scholarship (NOS)', 'benefit': '₹18,00,000/yr', 'target': 'Master’s / Ph.D. abroad (Top 500 QS)'},
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Ministry of Tribal Affairs Schemes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        const Text('Pre-screened against your profile criteria', style: TextStyle(fontSize: 12, color: Colors.black54)),
        const SizedBox(height: 16),
        ...schemes.map((s) => Card(
          color: Colors.white,
          margin: const EdgeInsets.only(bottom: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(child: Text(s['name']!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold))),
                    Text(s['benefit']!, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFB45309))),
                  ],
                ),
                const SizedBox(height: 6),
                Text('Eligible Stage: ${s['target']}', style: const TextStyle(fontSize: 11, color: Colors.black54)),
              ],
            ),
          ),
        )),
      ],
    );
  }

  // 3. JAGO ASSISTANT SCREEN
  Widget _buildJagoScreen() {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          color: const Color(0xFF1C1917),
          child: const Row(
            children: [
              Icon(Icons.auto_awesome, color: Color(0xFFFBBF24), size: 18),
              SizedBox(width: 8),
              Text('JAGO Factual Knowledge Assistant', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _chatBubble(
                'Hello Asha Patil! I am JAGO. I can help explain your application status, bonafide deficiency, and PFMS DBT payment schedule.',
                false,
              ),
              if (application.currentStatus == 'DEFICIENCY_NOTED')
                _chatBubble(
                  'Your application MOTA-2026-ST-1042 was flagged: "Current Year Bonafide Required". Uploading your AY 2026-27 Bonafide will automatically clear the institutional review requirement.',
                  false,
                ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.all(8),
          color: Colors.white,
          child: Row(
            children: [
              const Expanded(
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Ask JAGO about status or documents...',
                    hintStyle: TextStyle(fontSize: 12),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(horizontal: 12),
                  ),
                ),
              ),
              IconButton(
                onPressed: () {},
                icon: const Icon(Icons.send, color: Color(0xFFB45309)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _chatBubble(String text, bool isUser) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isUser ? const Color(0xFFB45309) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: isUser ? null : Border.all(color: Colors.black12),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 12,
            color: isUser ? Colors.white : Colors.black87,
            height: 1.4,
          ),
        ),
      ),
    );
  }

  // 4. PROFILE SCREEN
  Widget _buildProfileScreen() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 36,
                  backgroundColor: const Color(0xFFB45309),
                  child: const Text('AP', style: TextStyle(fontSize: 24, color: Colors.white, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 12),
                Text(student.fullName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Text('${student.category} · ${student.subTribe} Tribe', style: const TextStyle(color: Colors.black54, fontSize: 12)),
                const Divider(height: 32),
                _profileRow('Aadhaar Vault', student.syntheticAadhaarRef),
                _profileRow('APAAR ID', student.apaarId ?? 'N/A'),
                _profileRow('Domicile', '${student.district}, ${student.stateOfDomicile}'),
                _profileRow('Income', '₹${student.familyAnnualIncome.toInt()} / year'),
                _profileRow('College', student.institutionName),
                _profileRow('AISHE Code', student.institutionCode),
                _profileRow('Bank Account', student.bankAccountMasked),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _profileRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.black54)),
          Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
