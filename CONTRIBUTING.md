# Contributing to the World Constitution

Thank you for your interest in improving this model constitution. This repository is a public-domain educational resource, and every contribution — from a typo fix to a new institutional design — makes it more useful to educators, students, and drafters worldwide.

## Ways to contribute

1. **Editorial fixes.** Spelling, grammar, cross-reference accuracy, and formatting corrections are always welcome and are reviewed quickly. These changes do not alter meaning and require only one maintainer's approval.
2. **Substantive drafting.** Proposals that change, add, or remove norms (Articles, clauses, Design Notes) are reviewed under the amendment process below. Open an issue first so the community can discuss the design before a pull request is written.
3. **Comparative research.** The `research/` directory grows through contributions that add real-world comparative material. Cite primary sources (constitutions, treaties, standards) and summarize neutrally.
4. **Annexes and indexes.** The `annexes/` directory must stay synchronized with the text. If your change moves or renames an Article, update `rights-index.md`, `institutional-index.md`, and `cross-references.md` in the same pull request.
5. **Translations.** Translations of the Preamble and Part 00 are especially valuable. Place them in a `translations/` folder and note that they are non-normative.

## Drafting standards

All section files follow the binding specification in `constitution-spec.md` (development copy) and the conventions below:

- **Numbering.** Parts map to top-level directories; Sections to files; Articles to `{Part}.{Section}.{n}`. Never renumber existing Articles — supersede them through the amendment process instead.
- **Language.** Plain, precise legal English. "shall" imposes a duty; "may" confers discretion; "shall not" prohibits. Define a term once, capitalize it thereafter, and add it to `GLOSSARY.md` and `DEFINITIONS.md` if it is new.
- **Length.** Section bodies run 350–500 words. Concision is a feature: a constitution that cannot be read cannot be understood.
- **Design Notes.** Every section ends with a 2–4 sentence Design Note explaining the rationale and trade-offs. Real constitutions may be cited there, but never in normative text — the Republic is deliberately fictional.
- **Cross-references.** Always cite the full article number plus its short title. Broken references are treated as editorial bugs.
- **Neutrality.** No real country may be endorsed or criticized in normative text, and no provision may depend on a particular legal system, religion, or language community.

## The amendment process for the text

Because the repository models a constitution, changes to normative content follow a two-track process that mirrors Part 25:

1. **Ordinary amendment (most provisions).** An issue gathers feedback for at least 14 days; a pull request then requires approval from two maintainers, one of whom must review the cross-reference and annex impact.
2. **Entrenched provisions (Section 30.5).** Provisions listed there — the republican and democratic form, human dignity, equality, judicial independence, non-derogable rights, and the amendment rules themselves — additionally require a documented community comment period of at least 30 days and approval by three maintainers, with the rationale recorded in `annexes/amendment-history.md`.

Every merged substantive change increments the version in `CHANGELOG.md` and appends a row to the amendment history.

## Pull request checklist

Before opening a pull request, please confirm that:

- [ ] Every changed section file passes the word-count and template checks (350–500 words; H1, blockquote, italic scope line, 4–8 Articles, Design Note, Cross-references).
- [ ] New terms are added to `GLOSSARY.md` and, where operative, `DEFINITIONS.md`.
- [ ] Cross-references in both directions have been checked.
- [ ] The relevant annex tables have been updated.
- [ ] A `CHANGELOG.md` entry is included for substantive changes.
- [ ] The Design Note is unique and actually explains the design choice.

## Code of conduct

Contributors agree to keep discussion focused on designs and texts, to critique positions rather than persons, and to assume good faith across cultures and legal traditions. Maintainers may moderate off-topic or abusive threads.

## Licensing

By contributing, you dedicate your contribution to the public domain under CC0 1.0, consistent with `LICENSE.md`. You confirm that you have the right to do so and that your contribution does not copy proprietary text.
