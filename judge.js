/*
 * judge.js — The World Constitution: Sentencing Explorer
 * ---------------------------------------------------------------------
 * An educational tool for the World Constitution project. Pick an
 * offender's age and a reason (offense) and this shows how THIS
 * fictional constitution's own rules would actually apply — which
 * procedure governs, what the presumption is, and which real Articles
 * control the outcome.
 *
 * IMPORTANT — READ BEFORE WIRING THIS UP:
 * 1. This is model law for a FICTIONAL state, built for the World
 *    Constitution educational project. It is not legal advice and
 *    must never be presented as reflecting any real jurisdiction.
 * 2. The Constitution's own Penal Code (Part 38) uses a Class
 *    M / III / II / I severity scale in its offense articles but never
 *    itself fixes numeric sentence ranges — Article 14.1.4 deliberately
 *    delegates exact penalties to statute. The ranges shown below are
 *    this TOOL's own worked illustration of that scale, clearly labeled
 *    as such, not text quoted from the Constitution itself.
 * 3. Every entry cites a real Article/Section from the current source
 *    corpus. If you add a crime, add its citation too — the whole
 *    point of this project is that nothing is asserted without one.
 *
 * USAGE
 *   <div id="judge-tool"></div>
 *   <script src="judge.js"></script>
 * If no #judge-tool element exists, the tool appends itself to <body>.
 */
(function () {
  'use strict';

  // -----------------------------------------------------------------
  // 1. DATA — age brackets (grounded in Articles 121.1–121.4, 14.10, 14.3.1.2, 15.8, 14.10.2)
  // -----------------------------------------------------------------
  var AGE_BRACKETS = [
    {
      key: 'child',
      label: 'Child',
      min: 0,
      max: 13,
      summary: 'Below the age of criminal responsibility. No prosecution — ever.',
      rule: 'Criminal responsibility begins at fourteen. Below it, there is no prosecution of any kind, only child-welfare measures.',
      citation: 'Article 121.1.1 (Age and Scope), Part 38 — Juvenile Justice',
      statusNote: 'Truancy, curfew, running away, and underage alcohol possession are not crimes at all for anyone under juvenile jurisdiction — they are treated as welfare matters (Article 121.4.1).',
      procedure: 'Referral to child-protection services under Part 22 (Social Policy) and Article 1.15 (Rights of the Child). No court of criminal jurisdiction is involved.',
      custody: 'Never available.',
    },
    {
      key: 'juvenile',
      label: 'Juvenile (14–17)',
      min: 14,
      max: 17,
      summary: 'Juvenile jurisdiction, always — diversion is the presumption.',
      rule: 'Ages fourteen to eighteen fall within juvenile jurisdiction in every matter, whatever the offense\'s gravity. No juvenile is ever tried in an adult court; grave offenses add resources to the juvenile system, never a change of forum.',
      citation: 'Articles 121.1.2, 121.2.3 (Procedure), Part 38 — Juvenile Justice',
      statusNote: 'Diversion — restorative conferencing, education, treatment — is presumed for everything except the gravest violence (Article 121.2.2).',
      procedure: 'Specialized judges, prosecutors, and defenders trained in child development; parents present; closed, child-friendly hearings (Article 121.2.1).',
      custody: 'Only as a last resort for proven grave violence: small educational facilities near family, shortest possible period, reviewed every six months, capped at eight years total, with reentry support to age twenty-one (Articles 121.3.1–121.3.2). No juvenile record ever enters general police databases; records seal automatically at majority plus two years (Article 121.3.3).',
    },
    {
      key: 'adult',
      label: 'Adult (18–64)',
      min: 18,
      max: 64,
      summary: 'Ordinary criminal law and procedure (Parts 14 and 15) applies in full.',
      rule: 'Sentencing is individualized to the gravity of the offense, the offender\'s culpability, and relevant personal circumstances; reasons must be stated for the sentence and its position within the statutory range.',
      citation: 'Articles 14.10.1–14.10.2 (Purposes and Individualization), Part 14',
      statusNote: 'A non-custodial penalty is presumed for offenses of lesser gravity — fines scaled to income, community service, restorative measures — with custody reserved for serious offenses or where non-custodial measures have failed (Article 14.10.3).',
      procedure: 'Full adversarial trial under Part 15 (Criminal Procedure): warrant-based arrest, judicial review within 48 hours, the right to counsel and a public hearing, appeal as of right.',
      custody: 'The death penalty does not exist in this Constitution, under any circumstance (Article 14.3.1.2; see also Article 119, Part 38 — Abolition of the Death Penalty). Life imprisonment is reserved for the gravest offenses only, and every life or long sentence is subject to periodic judicial review (Article 14.10.4).',
    },
    {
      key: 'elder',
      label: 'Older adult (65+)',
      min: 65,
      max: 120,
      summary: 'The same adult framework applies — age is a factor courts must weigh, not a separate law.',
      rule: 'The Constitution does not create a reduced-responsibility category for old age. It does require every sentencing court to individualize to "personal circumstances relevant to the case" — which includes an offender\'s age and health — alongside the gravity of the offense and the offender\'s culpability.',
      citation: 'Article 14.10.2 (Individualization); Article 15.8.1 (Humane Treatment, for anyone in custody)',
      statusNote: 'Being honest about the gap: nothing in the text guarantees a lighter sentence, adapted custody conditions, or early release purely on account of age. Those outcomes depend on how a court applies Article 14.10.2\'s individualization duty and Article 15.8.1\'s humane-treatment guarantee in a given case — not on a fixed rule.',
      procedure: 'Identical to the ordinary adult procedure of Part 15.',
      custody: 'Same limits as the ordinary adult bracket. Conditions of any custody remain subject to Article 15.8.1\'s guarantee that detention "shall not aggravate the deprivation of liberty beyond what its lawful purpose requires."',
    }
  ];

  // -----------------------------------------------------------------
  // 2. DATA — the working penalty-class scale this TOOL uses to
  //    illustrate Part 38's Class M/III/II/I labels (see file header).
  // -----------------------------------------------------------------
  var PENALTY_CLASSES = {
    'none': { label: 'Status matter — not a crime', illustrative: 'No penalty. Handled outside the criminal system entirely.' },
    'M':    { label: 'Class M — Misdemeanor', illustrative: 'Fine, community service, or a warning. Non-custodial by presumption (Article 14.10.3.1).' },
    'III':  { label: 'Class III — Serious offense', illustrative: 'Custody becomes available but is not automatic; non-custodial alternatives remain open where adequate.' },
    'II':   { label: 'Class II — Grievous offense', illustrative: 'Custody is the ordinary outcome; duration scales with harm and culpability.' },
    'I':    { label: 'Class I — Gravest offense', illustrative: 'The most severe custodial range available, up to a reviewable life sentence. Never the death penalty.' },
    'special': { label: 'Specific penalty fixed in its own Article', illustrative: 'This offense has its own numeric penalty written directly into the source text — see the citation.' }
  };

  var CRIMES = [{"cat": "Offenses Against Life", "title": "Murder (intentional killing)", "cls": "I", "article": "Article 122.1 / Article 14.3.1", "part": "38 · Homicide", "desc": "Intentional killing, or intentional infliction of grievous harm foreseeably causing death."}, {"cat": "Offenses Against Life", "title": "Murder with aggravating circumstances", "cls": "I", "article": "Article 122.1.2", "part": "38 · Homicide", "desc": "Premeditation, cruelty, killing to conceal another offense, killing an on-duty official, or a domestic-context killing."}, {"cat": "Offenses Against Life", "title": "Mass killing / killing with terror purpose", "cls": "I", "article": "Article 122.1.3", "part": "38 · Homicide", "desc": "Carries the terrorism aggravation on top of the base murder classification."}, {"cat": "Offenses Against Life", "title": "Manslaughter (unintentional killing)", "cls": "II/III", "article": "Article 122.2.1", "part": "38 · Homicide", "desc": "Unintentional killing by an unlawful or grossly negligent act; class depends on circumstances."}, {"cat": "Offenses Against Life", "title": "Reckless killing in traffic, construction, or industry", "cls": "II/III", "article": "Article 122.2.2", "part": "38 · Homicide", "desc": "Follows the corporate-crime rules where a systemic organizational failure is present."}, {"cat": "Offenses Against Life", "title": "Infanticide (by a mother, in the disturbance of childbirth)", "cls": "special", "article": "Article 122.3.1", "part": "38 · Homicide", "desc": "A distinct, reduced offense with treatment priority rather than ordinary homicide grading."}, {"cat": "Offenses Against Life", "title": "Unlawful killing outside assisted-dying safeguards", "cls": "I", "article": "Article 122.3.2", "part": "38 · Homicide", "desc": "Assisted dying is regulated, not criminalized, under safeguards; killing outside them is homicide."}, {"cat": "Offenses Against Life", "title": "Failure to help a person in evident peril", "cls": "M", "article": "Article 122.4.1", "part": "38 · Homicide", "desc": "A misdemeanor where assistance was possible without serious risk to the bystander."}, {"cat": "Offenses Against Life", "title": "Failure of a heightened professional duty to rescue", "cls": "M", "article": "Article 122.4.2", "part": "38 · Homicide", "desc": "Professionals on duty carry a heightened duty to rescue; breach is aggravated within the misdemeanor class."}, {"cat": "Violence and Bodily Integrity", "title": "Battery causing transient injury", "cls": "M", "article": "Article 123.1.2", "part": "38 · Violence Offenses", "desc": "Unlawful physical force or harmful contact causing only transient injury."}, {"cat": "Violence and Bodily Integrity", "title": "Assault causing serious injury", "cls": "III", "article": "Article 123.1.2", "part": "38 · Violence Offenses", "desc": "Aggravated by weapon use, group action, ambush, victim vulnerability, or an on-duty target."}, {"cat": "Violence and Bodily Integrity", "title": "Assault causing grievous or permanent injury", "cls": "II", "article": "Article 123.1.2", "part": "38 · Violence Offenses", "desc": "Grading rises with the severity and permanence of the harm caused."}, {"cat": "Violence and Bodily Integrity", "title": "Assault resulting in death", "cls": "I", "article": "Article 123.1.2", "part": "38 · Violence Offenses", "desc": "Graded with the homicide rules where death results from the assault."}, {"cat": "Violence and Bodily Integrity", "title": "Threats, coercion, stalking, and intimidation", "cls": "M", "article": "Article 123.2.1", "part": "38 · Violence Offenses", "desc": "Protection orders are available to victims; grading rises with severity and repetition."}, {"cat": "Violence and Bodily Integrity", "title": "Threats against officials, journalists, or witnesses", "cls": "III", "article": "Article 123.2.2", "part": "38 · Violence Offenses", "desc": "Aggravated and prosecuted by the Integrity Commission given the target's public role."}, {"cat": "Violence and Bodily Integrity", "title": "Swatting, doxxing, or organized harassment campaigns", "cls": "III", "article": "Article 123.2.3", "part": "38 · Violence Offenses", "desc": "Treated as an aggravated form of coercion and threats."}, {"cat": "Violence and Bodily Integrity", "title": "Endangering life by reckless conduct (dangerous driving, fire-setting)", "cls": "II/III", "article": "Article 123.3.1", "part": "38 · Violence Offenses", "desc": "Covers dangerous driving, fire-setting, and leaving hazards that endanger life."}, {"cat": "Violence and Bodily Integrity", "title": "Failure of custodial duty toward a child or dependent", "cls": "II/III", "article": "Article 123.3.2", "part": "38 · Violence Offenses", "desc": "Treated as aggravated endangerment given the position of trust."}, {"cat": "Violence and Bodily Integrity", "title": "Arson endangering occupants", "cls": "II", "article": "Article 123.3.3", "part": "38 · Violence Offenses", "desc": "Stacks with environmental-crime penalties where land or habitat is also harmed."}, {"cat": "Violence and Bodily Integrity", "title": "Hate-crime enhancement", "cls": "special", "article": "Article 123.4.1", "part": "38 · Violence Offenses", "desc": "Where any offense is selected by prejudice against a protected characteristic, its penalty class rises by one step."}, {"cat": "Violence and Bodily Integrity", "title": "Organized hate violence", "cls": "I", "article": "Article 123.4.3", "part": "38 · Violence Offenses", "desc": "Treated as organized crime given its coordinated character."}, {"cat": "Violence and Bodily Integrity", "title": "Kidnapping", "cls": "II", "article": "Article 14.3.3", "part": "14.3 · Liberty and Dignity", "desc": "Unlawful confinement or abduction of a person."}, {"cat": "Violence and Bodily Integrity", "title": "Unlawful coercion", "cls": "III", "article": "Article 14.3.3", "part": "14.3 · Liberty and Dignity", "desc": "Compelling a person's conduct by unlawful force or threat."}, {"cat": "Violence and Bodily Integrity", "title": "Female genital mutilation", "cls": "II", "article": "Article 14.3.2", "part": "14.3 · Bodily Integrity", "desc": "An explicit form of gender-based violence under the bodily-integrity offenses."}, {"cat": "Sexual Offenses", "title": "Rape (non-consensual penetration)", "cls": "I", "article": "Article 124.1", "part": "38 · Sexual Offenses", "desc": "Non-consensual penetration by any body part or object; consent must be free, specific, revocable, and present throughout the act."}, {"cat": "Sexual Offenses", "title": "Sexual assault (non-penetrative)", "cls": "II/III", "article": "Article 124.2.1", "part": "38 · Sexual Offenses", "desc": "Non-penetrative non-consensual sexual contact."}, {"cat": "Sexual Offenses", "title": "Sexual coercion / exploitation of a dependent by a caregiver or official", "cls": "II", "article": "Article 124.2.1", "part": "38 · Sexual Offenses", "desc": "Covers exploitation of patients, prisoners, and other persons dependent on the offender's position."}, {"cat": "Sexual Offenses", "title": "Sexual offense against a child (below the age of protection)", "cls": "I", "article": "Article 124.2.2 / Article 14.3.5", "part": "38 · Sexual Offenses", "desc": "Sexual acts with a person below sixteen are offenses per se; carries Class I grading with mandatory treatment orders."}, {"cat": "Sexual Offenses", "title": "Grooming or exploitation of a child, including child sexual-abuse material", "cls": "I", "article": "Article 14.3.5", "part": "14.3 · Offenses Against Children", "desc": "Special protection provisions for children carry the highest grading and treat vulnerability as an aggravating factor."}, {"cat": "Sexual Offenses", "title": "Knowingly false sexual-offense allegation", "cls": "M", "article": "Article 124.4.1", "part": "38 · Sexual Offenses", "desc": "Prosecuted at the misdemeanor level, to the same strict standard of proof as any other offense."}, {"cat": "Domestic Violence", "title": "Physical, sexual, psychological, or economic domestic violence", "cls": "II/III", "article": "Article 125.1.1", "part": "38 · Domestic Violence", "desc": "Covers partners, family members, cohabitants, and former partners; also an aggravating context for other offenses."}, {"cat": "Domestic Violence", "title": "Coercive control (pattern of isolation, surveillance, threats)", "cls": "III", "article": "Article 125.1.2", "part": "38 · Domestic Violence", "desc": "An offense in itself even without a single identifiable assault."}, {"cat": "Domestic Violence", "title": "Strangulation in a domestic context", "cls": "II", "article": "Article 125.1.3", "part": "38 · Domestic Violence", "desc": "Treated as grave injury regardless of visible external harm."}, {"cat": "Domestic Violence", "title": "Breach of a protective order", "cls": "M", "article": "Article 125.2.3", "part": "38 · Domestic Violence", "desc": "An independent offense, enforceable with GPS monitoring as a condition."}, {"cat": "Trafficking and Exploitation", "title": "Human trafficking", "cls": "I", "article": "Article 133.1.1", "part": "38 · Trafficking and Slavery", "desc": "Recruitment, transport, harboring, or receipt of a person by force, fraud, coercion, deception, or abuse of vulnerability, for exploitation."}, {"cat": "Trafficking and Exploitation", "title": "Slavery, servitude, or debt bondage", "cls": "I", "article": "Article 133.1.2", "part": "38 · Trafficking and Slavery", "desc": "The victim's consent is no defense to any of these offenses."}, {"cat": "Trafficking and Exploitation", "title": "Forced labor", "cls": "I", "article": "Article 10.1.2 / Article 133.1.2", "part": "14/38", "desc": "Prohibited in every form; the State must prevent, detect, and punish it, including within supply chains."}, {"cat": "Trafficking and Exploitation", "title": "Forced marriage", "cls": "I", "article": "Article 133.1.2", "part": "38 · Trafficking and Slavery", "desc": "A specific Class I offense within the trafficking and slavery framework."}, {"cat": "Trafficking and Exploitation", "title": "Organ trafficking", "cls": "I", "article": "Article 133.1.2", "part": "38 · Trafficking and Slavery", "desc": "A specific Class I offense within the trafficking and slavery framework."}, {"cat": "Property Offenses", "title": "Theft", "cls": "M/III", "article": "Article 14.4.1", "part": "14.4 · Offenses of Taking", "desc": "Dishonest appropriation of property belonging to another; grading depends on value and circumstances."}, {"cat": "Property Offenses", "title": "Robbery (theft with violence or threats)", "cls": "III", "article": "Article 14.4.1", "part": "14.4 · Offenses of Taking", "desc": "Punished as an offense against both property and personal liberty."}, {"cat": "Property Offenses", "title": "Extortion", "cls": "III", "article": "Article 14.4.1", "part": "14.4 · Offenses of Taking", "desc": "Obtaining property or advantage through violence or threats."}, {"cat": "Property Offenses", "title": "Fraud and deception", "cls": "M/III", "article": "Article 14.4.2", "part": "14.4 · Fraud and Deception", "desc": "Obtaining property, services, or financial advantage by deception, false identity, or forged instruments."}, {"cat": "Property Offenses", "title": "Fraud against a vulnerable person or by organized means", "cls": "III", "article": "Article 14.4.2", "part": "14.4 · Fraud and Deception", "desc": "An aggravated form of ordinary fraud."}, {"cat": "Property Offenses", "title": "Criminal damage / vandalism", "cls": "M", "article": "Article 14.4.3", "part": "14.4 · Criminal Damage", "desc": "Destruction of or damage to another's property; minimal damage may be reserved to civil remedies."}, {"cat": "Property Offenses", "title": "Arson (criminal damage endangering life)", "cls": "II", "article": "Article 14.4.3", "part": "14.4 · Criminal Damage", "desc": "An aggravated form of criminal damage where life or safety is endangered."}, {"cat": "Property Offenses", "title": "Unlawful interference with data, a digital wallet, or virtual assets", "cls": "M/III", "article": "Article 14.4.4", "part": "14.4 · Digital Property", "desc": "Intangible and digital property receive protection equal to that of tangible property."}, {"cat": "Financial and Corruption Crimes", "title": "Fraud against public funds or subsidies", "cls": "III", "article": "Article 14.5.1", "part": "14.5 · Financial Crimes", "desc": "Obtaining public funds by deception; scale and abuse of an official position are aggravating factors."}, {"cat": "Financial and Corruption Crimes", "title": "Insider dealing / market manipulation", "cls": "III", "article": "Article 14.5.2", "part": "14.5 · Financial Crimes", "desc": "Protects the integrity of financial markets."}, {"cat": "Financial and Corruption Crimes", "title": "Money laundering", "cls": "II/III", "article": "Article 14.5.3", "part": "14.5 · Financial Crimes", "desc": "Punishable irrespective of the predicate offense that generated the proceeds."}, {"cat": "Financial and Corruption Crimes", "title": "Bribery of a public official", "cls": "III", "article": "Article 14.6.1", "part": "14.6 · Corruption", "desc": "Giving or receiving an undue advantage to induce or reward the improper performance of a public function; the official's position is always an aggravating factor, never mitigating."}, {"cat": "Financial and Corruption Crimes", "title": "Trading in influence", "cls": "III", "article": "Article 14.6.2", "part": "14.6 · Corruption", "desc": "Claiming an improper ability to influence a public decision in exchange for an undue advantage, whether or not the influence is actually exercised."}, {"cat": "Financial and Corruption Crimes", "title": "Embezzlement of public funds or property", "cls": "III", "article": "Article 14.6.3", "part": "14.6 · Corruption", "desc": "Misappropriation of funds or property entrusted to a public official or held by a public body."}, {"cat": "Financial and Corruption Crimes", "title": "Illicit enrichment (unexplained wealth of an official)", "cls": "III", "article": "Article 14.6.3", "part": "14.6 · Corruption", "desc": "Subject to the procedural verification safeguards of Article 27.3.2."}, {"cat": "Financial and Corruption Crimes", "title": "Bribery of journalists or editors", "cls": "special", "article": "Article 36.4.1", "part": "36 · Media Integrity", "desc": "Licence revocation for the outlet plus personal criminal liability for the individuals involved."}, {"cat": "Financial and Corruption Crimes", "title": "Government bribery of a media outlet for favorable coverage", "cls": "special", "article": "Article 36.4.2 / 36.4.4", "part": "36 · Media Integrity", "desc": "An aggravated corruption offense: mandatory referral to the Integrity Courts, minimum 2-year custodial sentence, and permanent disqualification from office under Article 31.7."}, {"cat": "Cybercrime", "title": "Illegal access to an information system", "cls": "M/III", "article": "Article 14.7.1", "part": "14.7 · Cybercrime", "desc": "Intentional access without right; aggravated where it affects critical infrastructure."}, {"cat": "Cybercrime", "title": "Data or system interference", "cls": "III", "article": "Article 14.7.2", "part": "14.7 · Cybercrime", "desc": "Intentional damaging, deletion, or alteration of data, or serious hindering of a system's function."}, {"cat": "Cybercrime", "title": "Computer-related fraud, forgery, or extortion", "cls": "M/III", "article": "Article 14.7.3", "part": "14.7 · Cybercrime", "desc": "Prosecuted under the general offense with equal protection extended to digital property."}, {"cat": "Organized Crime", "title": "Participation in a criminal association", "cls": "III", "article": "Article 14.8.1", "part": "14.8 · Organized Crime", "desc": "Requires an intentional act of participation; mere membership by belief or family tie is not punishable."}, {"cat": "Organized Crime", "title": "Organized cruelty for entertainment or profit (fighting rings, poaching syndicates)", "cls": "I", "article": "Article 32.2.1(IV)", "part": "32.2 · Animal Cruelty", "desc": "Treated as organized crime under Part 38, minimum three years, with full asset confiscation."}, {"cat": "National Security", "title": "Treason", "cls": "I", "article": "Article 14.9.1", "part": "14.9 · National Security Offenses", "desc": "Requires a concrete act with specific intent to prejudice the Republic's existence, security, or constitutional order; advocacy or criticism alone never qualifies."}, {"cat": "National Security", "title": "Espionage", "cls": "I", "article": "Article 14.9.1", "part": "14.9 · National Security Offenses", "desc": "Narrowly defined; publication of truthful information in the public interest is not espionage merely because it embarrasses authorities."}, {"cat": "National Security", "title": "Sabotage", "cls": "I", "article": "Article 14.9.1", "part": "14.9 · National Security Offenses", "desc": "Requires a concrete act going beyond preparation of an ordinary offense."}, {"cat": "National Security", "title": "Terrorism offense (grave act intended to intimidate the public or coerce authority)", "cls": "I", "article": "Article 18.7.1", "part": "18.7 · Terrorism Law", "desc": "Political purpose alone never establishes the offense; protest, dissent, and journalism are expressly excluded."}, {"cat": "Media Integrity", "title": "Deliberate large-scale disinformation to manipulate an election, market, or public-health decision", "cls": "special", "article": "Article 36.3.1", "part": "36 · Media Integrity", "desc": "Requires proof to the criminal standard of both factual falsity and deliberate intent to manipulate; never mere error, satire, or opinion."}, {"cat": "Media Integrity", "title": "Undisclosed state propaganda presented as independent journalism", "cls": "special", "article": "Article 36.4.3", "part": "36 · Media Integrity", "desc": "Treated as a disinformation offense under Article 36.3."}, {"cat": "Animal Cruelty", "title": "Neglect through ignorance (Class I animal-cruelty tier)", "cls": "special", "article": "Article 32.2.1(I)", "part": "32.2 · Animal Cruelty", "desc": "Mandatory education order and civil fine — not a criminal conviction."}, {"cat": "Animal Cruelty", "title": "Reckless neglect causing suffering (Class II animal-cruelty tier)", "cls": "special", "article": "Article 32.2.1(II) / 32.2.4", "part": "32.2 · Animal Cruelty", "desc": "Fine up to six months' median income and licence revocation of up to five years."}, {"cat": "Animal Cruelty", "title": "Intentional cruelty or torture of an animal (Class III animal-cruelty tier)", "cls": "special", "article": "Article 32.2.1(III) / 32.2.4", "part": "32.2 · Animal Cruelty", "desc": "Criminal conviction, custodial sentence of six months to five years, and a lifetime ban on animal ownership."}, {"cat": "Animal Cruelty", "title": "Organized cruelty for entertainment or profit (Class IV animal-cruelty tier)", "cls": "I", "article": "Article 32.2.1(IV) / 32.2.4", "part": "32.2 · Animal Cruelty", "desc": "Treated as organized crime under Part 38: minimum three years custodial, full asset confiscation under Part 37."}, {"cat": "Environmental Crime", "title": "Unlawful pollution causing serious harm", "cls": "II", "article": "Article 134.1.1", "part": "38 · Environmental Crime", "desc": "Pollution of air, water, soil, or sea causing serious harm."}, {"cat": "Environmental Crime", "title": "Unlawful pollution causing death or widespread damage", "cls": "I", "article": "Article 134.1.1", "part": "38 · Environmental Crime", "desc": "The gravest tier of environmental pollution offenses."}, {"cat": "Environmental Crime", "title": "Unlawful waste trafficking or dangerous-substance dumping", "cls": "II/III", "article": "Article 134.1.2", "part": "38 · Environmental Crime", "desc": "A specific offense alongside general pollution and habitat-destruction crimes."}, {"cat": "Environmental Crime", "title": "Ecocide", "cls": "I", "article": "Article 134.1.3", "part": "38 · Environmental Crime", "desc": "Unlawful or wanton acts committed with knowledge of a substantial likelihood of severe, widespread, or long-term environmental damage — a Class I international crime."}, {"cat": "Environmental Crime", "title": "Illegal deforestation or land clearing", "cls": "II/III", "article": "Article 32.6", "part": "32.6 · Deforestation and Land Clearing Law", "desc": "Governed by the deforestation-specific provisions of the animal-and-plant-rights Part."}, {"cat": "Weapons and Public Safety", "title": "Unlicensed ownership of a weapon capable of lethal force", "cls": "M/III", "article": "Article 34.2.1", "part": "34.2 · Weapons Control", "desc": "Licensing requires the psychological-fitness principles of Article 31.3, adapted for civilian applicants, plus safe storage."}, {"cat": "Weapons and Public Safety", "title": "Possession of a prohibited mass-casualty weapon", "cls": "I", "article": "Article 34.2.2", "part": "34.2 · Weapons Control", "desc": "Such weapons have no lawful civilian use anywhere in the territory; no regional variation is permitted for this category."}, {"cat": "Corporate Crime", "title": "Corporate liability for an offense committed in the entity's interest", "cls": "special", "article": "Article 135.1.1", "part": "38 · Corporate Crime", "desc": "The entity is liable alongside — not instead of — the individual decision-makers responsible."}, {"cat": "Corporate Crime", "title": "Professional enabling of a crime (lawyer, accountant, auditor)", "cls": "III", "article": "Article 135.4.1", "part": "38 · Corporate Crime", "desc": "Professional privilege does not cover crime-fraud participation."}, {"cat": "Status and Minor Matters", "title": "Truancy", "cls": "none", "article": "Article 121.4.1", "part": "38 · Juvenile Justice", "desc": "A status offense, not a crime, for any person under juvenile jurisdiction."}, {"cat": "Status and Minor Matters", "title": "Curfew violation (minor)", "cls": "none", "article": "Article 121.4.1", "part": "38 · Juvenile Justice", "desc": "A status offense, not a crime, for any person under juvenile jurisdiction."}, {"cat": "Status and Minor Matters", "title": "Running away from home (minor)", "cls": "none", "article": "Article 121.4.1", "part": "38 · Juvenile Justice", "desc": "A status offense, not a crime, for any person under juvenile jurisdiction; treated as a welfare matter."}, {"cat": "Status and Minor Matters", "title": "Underage alcohol possession (minor)", "cls": "none", "article": "Article 121.4.1", "part": "38 · Juvenile Justice", "desc": "A status offense, not a crime, for any person under juvenile jurisdiction."}, {"cat": "Status and Minor Matters", "title": "Public littering", "cls": "M", "article": "Article 35.1", "part": "35 · Clean Cities and Sanitation", "desc": "An administrative/misdemeanor-tier public-cleanliness offense, sequenced behind the government's own infrastructure duties."}];

  // -----------------------------------------------------------------
  // 3. LOGIC
  // -----------------------------------------------------------------
  function bracketForAge(age) {
    for (var i = 0; i < AGE_BRACKETS.length; i++) {
      if (age >= AGE_BRACKETS[i].min && age <= AGE_BRACKETS[i].max) return AGE_BRACKETS[i];
    }
    return AGE_BRACKETS[AGE_BRACKETS.length - 1];
  }

  function outcomeFor(bracket, crime) {
    // Child: never prosecuted, full stop, regardless of the reason picked.
    if (bracket.key === 'child') {
      return {
        headline: 'No prosecution of any kind.',
        body: 'This person is below the age of criminal responsibility. Whatever the reason selected, the outcome under this Constitution is identical: referral to child-protection services, never a criminal charge.',
        citations: [bracket.citation]
      };
    }
    if (crime.cls === 'none') {
      return {
        headline: 'Not a crime at any age within juvenile jurisdiction.',
        body: 'This is a status offense. It carries no penalty of any kind for a juvenile; for an adult it would not exist as an offense at all in this Constitution\'s text.',
        citations: [crime.article]
      };
    }
    if (bracket.key === 'juvenile') {
      var isGravest = crime.cls === 'I';
      return {
        headline: isGravest
          ? 'Juvenile court, custody only as a last resort.'
          : 'Juvenile court, diversion presumed.',
        body: isGravest
          ? 'Even at the gravest classification, this stays inside the juvenile system: no adult court, ever. Custody is available only after proof of grave violence, in a small educational facility, for the shortest adequate period, capped at eight years, reviewed every six months.'
          : 'Diversion — restorative conferencing, education, or treatment — is the presumed outcome. Custody is not on the table for an offense at this classification.',
        citations: [bracket.citation, crime.article]
      };
    }
    // adult or elder
    var pc = PENALTY_CLASSES[crime.cls] || PENALTY_CLASSES['special'];
    return {
      headline: pc.label,
      body: pc.illustrative + (bracket.key === 'elder'
        ? ' A court must additionally weigh this offender\'s age and health under Article 14.10.2 — but nothing in the text converts that into an automatic reduction.'
        : ''),
      citations: [crime.article, 'Articles 14.10.1–14.10.4 (Sentencing)']
    };
  }

  // -----------------------------------------------------------------
  // 4. STYLES — namespaced, matches the site's existing design tokens
  //    with safe fallbacks if those variables aren't present.
  // -----------------------------------------------------------------
  var CSS = ''
    + '.jdg-root{--jdg-ink:var(--ink,#171717);--jdg-body:var(--body,#4d4d4d);--jdg-mute:var(--mute,#8f8f8f);'
    + '--jdg-canvas:var(--canvas-elevated,#fff);--jdg-hair:var(--hairline,#ebebeb);--jdg-accent:var(--link,#0070f3);'
    + '--jdg-warn:var(--warning,#f5a623);--jdg-warn-soft:var(--warning-soft,#ffefcf);'
    + 'font-family:var(--font-sans,-apple-system,BlinkMacSystemFont,sans-serif);color:var(--jdg-ink);'
    + 'max-width:960px;margin:2rem auto;padding:1.5rem;border:1px solid var(--jdg-hair);border-radius:12px;background:var(--jdg-canvas);}'
    + '.jdg-root *{box-sizing:border-box;}'
    + '.jdg-title{font-size:1.15rem;font-weight:600;margin:0 0 .25rem;}'
    + '.jdg-sub{font-size:.85rem;color:var(--jdg-mute);margin:0 0 1.25rem;line-height:1.5;}'
    + '.jdg-disclaimer{font-size:.75rem;color:var(--jdg-mute);background:var(--jdg-warn-soft);border:1px solid var(--jdg-warn);'
    + 'border-radius:8px;padding:.6rem .8rem;margin-bottom:1.25rem;line-height:1.5;}'
    + '.jdg-age-block{margin-bottom:1.5rem;}'
    + '.jdg-age-row{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:.4rem;}'
    + '.jdg-age-label{font-size:.8rem;color:var(--jdg-mute);text-transform:none;}'
    + '.jdg-age-value{font-size:1.4rem;font-weight:600;}'
    + '.jdg-age-bracket{font-size:.85rem;color:var(--jdg-accent);font-weight:500;}'
    + '.jdg-slider{width:100%;accent-color:var(--jdg-accent);height:6px;}'
    + '.jdg-ticks{display:flex;justify-content:space-between;font-size:.7rem;color:var(--jdg-mute);margin-top:.3rem;}'
    + '.jdg-columns{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}'
    + '@media(max-width:720px){.jdg-columns{grid-template-columns:1fr;}}'
    + '.jdg-col-head{font-size:.7rem;font-weight:600;letter-spacing:.02em;color:var(--jdg-mute);margin-bottom:.6rem;}'
    + '.jdg-select,.jdg-search{width:100%;padding:.55rem .7rem;border:1px solid var(--jdg-hair);border-radius:8px;'
    + 'font-size:.9rem;margin-bottom:.6rem;background:var(--jdg-canvas);color:var(--jdg-ink);font-family:inherit;}'
    + '.jdg-list{max-height:260px;overflow-y:auto;border:1px solid var(--jdg-hair);border-radius:8px;}'
    + '.jdg-item{padding:.55rem .7rem;font-size:.85rem;cursor:pointer;border-bottom:1px solid var(--jdg-hair);}'
    + '.jdg-item:last-child{border-bottom:none;}'
    + '.jdg-item:hover{background:rgba(0,0,0,.03);}'
    + '.jdg-item.jdg-active{background:var(--jdg-accent);color:#fff;}'
    + '.jdg-item .jdg-item-cat{display:block;font-size:.7rem;opacity:.65;margin-bottom:1px;}'
    + '.jdg-result{border:1px solid var(--jdg-hair);border-radius:8px;padding:1rem;min-height:260px;}'
    + '.jdg-result-empty{color:var(--jdg-mute);font-size:.85rem;}'
    + '.jdg-result-headline{font-size:1.05rem;font-weight:600;margin:0 0 .5rem;}'
    + '.jdg-result-body{font-size:.85rem;line-height:1.6;color:var(--jdg-body);margin:0 0 .8rem;}'
    + '.jdg-result-section{font-size:.75rem;color:var(--jdg-mute);margin:.7rem 0 .2rem;font-weight:600;}'
    + '.jdg-cite{font-size:.8rem;font-family:var(--font-mono,monospace);background:rgba(0,0,0,.04);'
    + 'border-radius:6px;padding:.15rem .4rem;display:inline-block;margin:.15rem .3rem .15rem 0;}'
    + '.jdg-desc{font-size:.8rem;color:var(--jdg-body);font-style:italic;margin-top:.4rem;}';

  // -----------------------------------------------------------------
  // 5. BUILD
  // -----------------------------------------------------------------
  function init() {
    var mount = document.getElementById('judge-tool') || (function () {
      var d = document.createElement('div');
      document.body.appendChild(d);
      return d;
    })();

    var styleTag = document.createElement('style');
    styleTag.textContent = CSS;
    document.head.appendChild(styleTag);

    var categories = [];
    CRIMES.forEach(function (c) { if (categories.indexOf(c.cat) === -1) categories.push(c.cat); });

    mount.innerHTML =
      '<div class="jdg-root">'
      + '<p class="jdg-title">Sentencing Explorer</p>'
      + '<p class="jdg-sub">Pick an age and an offense to see how this Constitution\'s own rules actually apply — which procedure governs, what the presumption is, and the exact Articles behind the answer.</p>'
      + '<div class="jdg-disclaimer">This is model law written for the World Constitution educational project — a fictional state. It is not legal advice and does not describe any real jurisdiction. Where the source text leaves an exact penalty to statute (Article 14.1.4), this tool says so rather than inventing a number.</div>'
      + '<div class="jdg-age-block">'
      +   '<div class="jdg-age-row">'
      +     '<span class="jdg-age-label">Offender\'s age</span>'
      +     '<span><span class="jdg-age-value" id="jdg-age-value">30</span> <span class="jdg-age-bracket" id="jdg-age-bracket"></span></span>'
      +   '</div>'
      +   '<input type="range" min="0" max="100" value="30" class="jdg-slider" id="jdg-age-slider" aria-label="Offender age">'
      +   '<div class="jdg-ticks"><span>0 · Child</span><span>14 · Juvenile</span><span>18 · Adult</span><span>65 · Older adult</span><span>100</span></div>'
      + '</div>'
      + '<div class="jdg-columns">'
      +   '<div>'
      +     '<div class="jdg-col-head">BUILD THE CASE</div>'
      +     '<select class="jdg-select" id="jdg-cat-select"><option value="">All categories</option>'
      +       categories.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('')
      +     '</select>'
      +     '<input class="jdg-search" id="jdg-search" type="text" placeholder="Search a reason, e.g. \'theft\', \'bribery\', \'assault\'...">'
      +     '<div class="jdg-list" id="jdg-list"></div>'
      +   '</div>'
      +   '<div>'
      +     '<div class="jdg-col-head">RESULT</div>'
      +     '<div class="jdg-result" id="jdg-result"><p class="jdg-result-empty">Select a reason on the left to see the outcome for the selected age.</p></div>'
      +   '</div>'
      + '</div>'
      + '</div>';

    var slider = mount.querySelector('#jdg-age-slider');
    var ageValueEl = mount.querySelector('#jdg-age-value');
    var ageBracketEl = mount.querySelector('#jdg-age-bracket');
    var catSelect = mount.querySelector('#jdg-cat-select');
    var search = mount.querySelector('#jdg-search');
    var list = mount.querySelector('#jdg-list');
    var resultEl = mount.querySelector('#jdg-result');

    var selectedCrime = null;

    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    }

    function renderList() {
      var cat = catSelect.value;
      var q = search.value.trim().toLowerCase();
      var filtered = CRIMES.filter(function (c) {
        if (cat && c.cat !== cat) return false;
        if (q && (c.title + ' ' + c.cat + ' ' + c.desc).toLowerCase().indexOf(q) === -1) return false;
        return true;
      });
      if (filtered.length === 0) {
        list.innerHTML = '<div class="jdg-item">No matching reason.</div>';
        return;
      }
      list.innerHTML = filtered.map(function (c, i) {
        var active = selectedCrime === c ? ' jdg-active' : '';
        return '<div class="jdg-item' + active + '" data-idx="' + CRIMES.indexOf(c) + '">'
          + '<span class="jdg-item-cat">' + esc(c.cat) + '</span>' + esc(c.title)
          + '</div>';
      }).join('');
      Array.prototype.forEach.call(list.querySelectorAll('.jdg-item[data-idx]'), function (el) {
        el.addEventListener('click', function () {
          selectedCrime = CRIMES[parseInt(el.getAttribute('data-idx'), 10)];
          renderList();
          renderResult();
        });
      });
    }

    function renderResult() {
      var age = parseInt(slider.value, 10);
      var bracket = bracketForAge(age);
      ageValueEl.textContent = age;
      ageBracketEl.textContent = '· ' + bracket.label;

      if (!selectedCrime) {
        resultEl.innerHTML = '<p class="jdg-result-empty">Select a reason on the left to see the outcome for the selected age.</p>';
        return;
      }
      var outcome = outcomeFor(bracket, selectedCrime);
      resultEl.innerHTML =
        '<p class="jdg-result-headline">' + esc(outcome.headline) + '</p>'
        + '<p class="jdg-result-body">' + esc(outcome.body) + '</p>'
        + '<p class="jdg-desc">' + esc(selectedCrime.desc) + '</p>'
        + '<p class="jdg-result-section">GOVERNING TEXT</p>'
        + outcome.citations.map(function (c) { return '<span class="jdg-cite">' + esc(c) + '</span>'; }).join('')
        + '<p class="jdg-result-section">AGE FRAMEWORK</p>'
        + '<p class="jdg-result-body">' + esc(bracket.rule) + '</p>'
        + '<span class="jdg-cite">' + esc(bracket.citation) + '</span>';
    }

    slider.addEventListener('input', renderResult);
    catSelect.addEventListener('change', renderList);
    search.addEventListener('input', renderList);

    renderList();
    renderResult();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
