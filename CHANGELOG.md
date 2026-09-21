# Changelog

All notable changes to the World Constitution repository are documented here. The format follows the project's governance rules: Major.Minor.Patch, with substantive changes cross-referenced to `annexes/amendment-history.md`.

## [1.0.2] — Anti-capture amendment pass

*See `ANTI-CAPTURE-AMENDMENTS.md` for the full index, real-world rationale, and an explicit list of residual risks not addressed by this pass. No existing file was deleted or renumbered; all changes below are additive.*

### Added (substantive — flagged for the entrenched-provision review track under `CONTRIBUTING.md`, per the same process applied to the [1.0.1] entrenchment addition below)

- **Article 5.5.6 (`05-judiciary/judicial-appointments.md`).** Replaces cross-party political agreement with sortition, and moves Commission composition and eligibility criteria out of reach of ordinary law, closing the two routes flagged against Article 5.5.1 and Article 5.5.4(3).
- **Articles 31.7.7–31.7.9 (`31-government-eligibility/31.7-disqualification-and-removal.md`).** Interim suspension on the framing (not filing) of charges, with a misuse safeguard and a fast-track trial requirement, addressing the multi-year gap between Article 31.7.1's conviction-based disqualification and an actual conviction.
- **Articles 3.10.6–3.10.7 (`03-legislature/anti-corruption.md`).** Voids case closures triggered by a member's change of party affiliation and requires a public, quarterly case-status register.
- **Articles 15.4.6–15.4.7 (`15-criminal-procedure/evidence.md`).** Independent forensic collection and personal criminal liability for tampering, addressing evidence compromise upstream of the chain-of-custody log already required by Article 15.4.4.
- **Articles 34.4.5–34.4.6 (`34-low-violence-and-public-safety/34.4-community-policing-standards.md`).** Fixed tenure for police commanders and mandatory review of transfers timed around contested public-order events.
- **Section 21.6 / Articles 21.6.1–21.6.3 (`21-media-and-information/citizen-documentation-rights.md`, new file).** Extends documentation protection beyond registered journalists (Article 21.5) to any lawfully-present person documenting a publicly funded institution, with a specificity bar on reputational-harm-only complaints.
- **Article 26.5.7 (`26-emergency-and-crisis/emergency-safeguards.md`).** Declares all amendments in this pass non-derogable under Article 26.5.1.
- **Article 5 / Articles 5.1–5.2 (`37-integrity-branch/085-commission-appointment-and-tenure.md`).** Breaks the circularity where the Commission's appointing panel is drawn solely from the judiciary the Commission exists to check; requires a non-retaliation finding before a two-thirds parliamentary removal vote proceeds.
- **Section 8.9 / Articles 8.9.1–8.9.6 (`08-public-finance/public-official-compensation.md`, new file).** Fixes elected-officeholder compensation as a Statistics-Authority-certified multiple of national per-day income rather than a self-set figure, bars self-adjustment, and closes the self-certified-utilization gap in discretionary constituency funds.

### Fixed (editorial — cross-reference error)

- **`37-integrity-branch/085-commission-appointment-and-tenure.md`.** The WC-071 cross-reference pointed to `../03-governance/071-judicial-appointments.md`, a path that does not exist in this edition's folder structure (there is no `03-governance/`; Part 03 is the Legislature). Corrected to `../05-judiciary/judicial-appointments.md`, the file that actually covers judicial appointments.

### Not addressed in this pass (see `ANTI-CAPTURE-AMENDMENTS.md` for the full list)

- Campaign-finance transparency for political parties (`03-legislature/campaign-finance.md` was not amended).
- Compensation transparency for non-elected senior civil servants and board appointees.
- Extension of Article 21.6 to privately operated, publicly funded contractors (e.g., PPP infrastructure).

## [1.0.1] — Corrections from editorial audit

### Fixed (editorial — cross-reference and citation errors)

- **Article 3.2.3 (Lower House Eligibility).** Added the missing cross-reference to Part 31 (Government Eligibility): the unqualified "every citizen entitled to vote is eligible for election" text directly contradicted Part 31's education/psychological/physical fitness gates, which require certification *before* a candidate's name may appear on a ballot. The two provisions are now reconciled.
- **Articles 31.3, 31.4, 31.6 (Government Eligibility).** Corrected three broken or mislabeled cross-references to Part 00: "0.4 (Separation of Powers)" is actually Section 0.4 (Rule of Law) — separation of powers is Section 0.5; "0.3 (Founding: The Crown)" is actually Section 0.3 (Sovereignty); the 31.3 Design Note's "entrenchment rule in 0.5" pointed at Separation of Powers instead of the intended Section 30.5 (Protected Provisions).
- **Articles 31.3, 31.4.** Corrected "41-disability rights" citations, which pointed at Part 41 (Economic Order Extended — no disability content), to the correct location at `28-special-populations/persons-with-disabilities.md`.
- **Articles 36.1, 36.3, 42.12.** Corrected three citations of "1.2 (Freedom of Expression / Association)" — Section 1.2 is Equality — to the correct Section 1.3 (Freedom of Speech, Assembly, and Association).

### Added (substantive — flagged for the entrenched-provision review track under `CONTRIBUTING.md`)

- **Article 30.5.2(i).** Added the non-discrimination safeguards on government-eligibility testing (Articles 31.3.5, 31.4.4) and the independence of the Governance Eligibility Board (Article 31.1.4) to the entrenched-provisions list. Part 31's own Design Notes already asserted these safeguards were constitutionally entrenched against weakening amendments; they were not actually listed in Article 30.5.2, so the single most abuse-prone power in the text — a fitness test capable of disqualifying political rivals — carried no more protection than an ordinary statute. **This addition changes protected constitutional content and, per `CONTRIBUTING.md`, requires the 30-day comment period and three-maintainer approval before it may stand as adopted text; it is included here as a drafted proposal, not a ratified amendment.**

### Not yet fixed (flagged, not corrected, in this pass)

- **Word-count non-compliance.** `CONTRIBUTING.md` requires 350–500 words per section. All 14 sections in Part 42 run 89–160 words (under-length); most of Part 37's 26 sections run 500–711 words (over-length). Left unedited pending a decision on whether to expand Part 42 or split/trim Part 37, since both require drafting new substantive text rather than a mechanical fix.

## [1.0.0] — 2026-08-31 — Initial release

### Added

- **Root documents (7).** `README.md` with the master index; `LICENSE.md` dedicating the work to the public domain under CC0 1.0; `CONTRIBUTING.md` with drafting standards and the two-track amendment process; `GOVERNANCE.md` describing maintainership, decision rules, and versioning; this `CHANGELOG.md`; `GLOSSARY.md` with plain-language definitions of constitutional vocabulary; `DEFINITIONS.md` with the operative defined terms used normatively throughout the text.
- **Part 00 — Foundation (8 sections).** The Preamble; constitutional principles; sovereignty; rule of law; separation of powers; democracy; human dignity; constitutional supremacy.
- **Part 01 — Rights and Freedoms (15 sections).** The Bill of Rights with the master limitation clause at Article 1.1.4, plus equality, expression, religion, privacy, due process, fair trial, property, labor, education, healthcare, environmental, digital, consumer, and children's rights.
- **Part 02 — Citizenship and Migration (7 sections).** Citizenship, nationality, immigration, asylum, refugees, naturalization, loss of citizenship.
- **Part 03 — The Legislature (10 sections).** The bicameral Parliament, its houses, elections, the Electoral Commission's parliamentary role, parties, campaign finance, the legislative process, privileges, and member integrity.
- **Part 04 — The Executive (8 sections).** The President, the Prime Minister and Cabinet, ministries, the Public Service, executive powers and accountability, and the executive's role in emergencies.
- **Part 05 — The Judiciary (9 sections).** Judicial independence, the Supreme Court, the Constitutional Court, lower courts, appointments through the Judicial Service Commission, judicial review, access to justice, prosecutors, legal aid.
- **Part 06 — Elections and Referendums (7 sections).** Proportional representation with open lists, registration, voting, election security, observers, disputes, referendums.
- **Part 07 — Local Government (6 sections).** Provinces, regions, municipalities, local elections, local finance, decentralization.
- **Part 08 — Public Finance (8 sections).** Taxation, budget, debt, the Central Bank, procurement, spending, fiscal responsibility, audit.
- **Part 09 — The Economy (10 sections).** Economic freedom, competition, monopolies, corporations, small business, banking, financial markets, bankruptcy, intellectual property, trade.
- **Part 10 — Labor (8 sections).** Employment, minimum standards, wages, working hours, safety, unions, collective bargaining, unemployment.
- **Part 11 — Education (7 sections).** The education system, compulsory education, higher education, universities, vocational training, academic freedom, finance.
- **Part 12 — Health (7 sections).** The healthcare system, public health, hospitals, the medical profession, medicines, health data, mental health.
- **Part 13 — Environment and Natural Resources (8 sections).** Environmental rights implementation, climate policy, air, water, forests, biodiversity, pollution, natural resources.
- **Part 14 — Criminal Law (10 sections).** The Criminal Code, principles, offenses against persons, property offenses, financial crimes, corruption, cybercrime, organized crime, national-security offenses, sentencing.
- **Part 15 — Criminal Procedure (8 sections).** Arrest, search and seizure, interrogation, evidence, bail, trial, appeals, prisoner rights.
- **Part 16 — Civil Law (9 sections).** Contracts, torts, property, inheritance, family law, marriage, divorce, guardianship, civil procedure.
- **Part 17 — Digital Law (8 sections).** Digital rights implementation, data protection, cybersecurity, artificial intelligence, algorithmic transparency, digital identity, internet governance, electronic evidence.
- **Part 18 — National Security and Defense (7 sections).** Defense, armed forces, civilian control, intelligence services, oversight, border security, terrorism law.
- **Part 19 — International Relations (6 sections).** Foreign policy, treaties, international law, diplomatic relations, international trade, extradition.
- **Part 20 — Independent Institutions (7 sections).** The Ombudsman, Human Rights Commission, Anti-Corruption Commission, Electoral Commission, Auditor-General, Statistics Authority, Information Commission.
- **Part 21 — Media and Information (5 sections).** Press freedom, public broadcasting, access to information, media regulation, journalist protection.
- **Part 22 — Social Policy (7 sections).** Social security, pensions, disability, housing, poverty reduction, elder care, child protection.
- **Part 23 — Infrastructure (6 sections).** Transport, energy, telecommunications, public infrastructure, urban development, critical infrastructure.
- **Part 24 — Agriculture and Land (6 sections).** Agriculture, land use, food security, farmers' rights, animal welfare, fisheries.
- **Part 25 — Constitutional Process (5 sections).** Amendments, constitutional convention, interpretation, periodic review, continuity.
- **Part 26 — Emergency and Crisis (5 sections).** The state of emergency, natural disasters, pandemics, war powers, emergency safeguards.
- **Part 27 — Transparency and Accountability (6 sections).** Transparency, freedom of information, asset disclosures, conflicts of interest, whistleblower protection, government ethics.
- **Part 28 — Special Populations (6 sections).** Children, the elderly, persons with disabilities, minorities, indigenous peoples, vulnerable groups.
- **Part 29 — Public Institutions (5 sections).** Constitutional bodies, public authorities, regulators, state-owned enterprises, independent agencies.
- **Part 30 — Schedules (5 sections).** Oaths of office, electoral-district principles, constitutional offices, transition rules, protected provisions.
- **Annexes (6).** Consolidated legal definitions; the index of rights; the index of institutions; the cross-reference guide; the amendment history with its recording template; the implementation roadmap.
- **Research (6).** Comparative notes on constitutions, rights design, courts, electoral systems, economic systems, and the project's own design principles.

### Notes

- Total: 248 Markdown files. Every section file conforms to the binding specification: numbered Articles, a master limitation clause at Article 1.1.4, unique Design Notes, and verified cross-references.
- The text describes a fictional polity ("the Republic") for educational purposes and prescribes nothing for any real jurisdiction.
