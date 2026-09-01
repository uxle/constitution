# Governance of the World Constitution Project

This document describes how the repository itself is governed: who maintains it, how decisions are made, how versions are released, and how disagreements are resolved. It concerns the *project*, not the fictional Republic — the Republic's own governance is defined by the constitution text in Parts 00–30.

## Principles

1. **Public good.** The repository exists for education and civic study. Decisions optimize for clarity, neutrality, and pedagogical value, not for any political program.
2. **Open participation.** Anyone may open issues, comment on proposals, and submit pull requests under `CONTRIBUTING.md`.
3. **Neutrality.** The project takes no position on real-world constitutional controversies. Comparative material in `research/` describes; it does not advocate.
4. **Transparency.** All decisions, including rejected proposals, remain publicly visible in issues and in `annexes/amendment-history.md`.

## Roles

- **Maintainers** (target: three to seven individuals) merge pull requests, manage releases, and enforce the code of conduct. Maintainers are added by consensus of existing maintainers after sustained, high-quality contributions.
- **The Editorial Committee** (rotating subset of maintainers, minimum two) reviews substantive amendment proposals, checks cross-reference integrity, and guards consistency with the canonical design decisions in the specification.
- **Contributors** are everyone else — and the project's most important resource. Any contributor may become a maintainer.

## Decision-making

| Decision type | Process | Approval |
| --- | --- | --- |
| Editorial (typos, formatting, links) | Direct pull request | 1 maintainer |
| New comparative research or annex content | Pull request | 1 maintainer + Editorial Committee review |
| Ordinary amendment to normative text | Issue (≥14 days) → pull request | 2 maintainers |
| Entrenched provision change (Section 30.5 list) | Issue (≥30 days) → pull request | 3 maintainers, rationale recorded |
| Governance changes (this document) | Issue (≥14 days) → pull request | 2 maintainers |

If consensus fails, maintainers vote; ties are broken by the Editorial Committee's senior member. All votes are recorded in the issue.

## Versioning and releases

The project uses semantic versioning adapted for a text corpus:

- **Major** (v1 → v2): structural change — Parts added, removed, or renumbered; canonical design decisions altered.
- **Minor** (v1.0 → v1.1): new Sections or substantive normative changes within existing Parts.
- **Patch** (v1.0.0 → v1.0.1): editorial corrections, reference fixes, annex synchronization.

Every release: the `CHANGELOG.md` is updated, `annexes/amendment-history.md` gains rows for substantive changes, and a tagged snapshot is published. Releases occur at least annually if there are changes, and may be skipped in quiet years.

## Quality gates

No release ships with: broken cross-references; section files outside the word-count band; missing Design Notes; annex indexes out of sync with the text; or terms used normatively before definition. A verification script and manual spot-checks by the Editorial Committee are run before each tagged release.

## Succession and continuity

If the maintainer group becomes inactive for twelve consecutive months, any contributor may call for new maintainers through an open issue; the most active contributors from the preceding year form the candidate slate, and the community selects maintainers by ranked-choice vote among candidates. This mirrors, in miniature, the constitutional-continuity principles the project teaches.

## Relationship to the constitution text

The project's governance intentionally parallels the constitution it maintains: layered amendment rules (ordinary versus entrenched), recorded reasons, indexed history, and periodic review. Contributors who experience the process will understand Part 25 and Part 27 better than any lecture could convey.
