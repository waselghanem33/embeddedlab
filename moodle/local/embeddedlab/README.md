# EmbeddedLab 0.8 — Moodle bridge (pilot)

This directory contains the source of a **Moodle local plugin**, `local_embeddedlab`. It is not installed by pushing code to GitHub. A Moodle site administrator must deploy and test it on a staging Moodle site first.

## Installation

1. Copy the contents of this directory to `<moodle-root>/local/embeddedlab/` on the Moodle server.
2. As a Moodle administrator, visit **Site administration → Notifications** to install the database table.
3. In the target Moodle course, add a **URL resource** linking to `https://YOUR-MOODLE-SITE/local/embeddedlab/index.php?courseid=COURSE_ID`. Alternatively use the link directly from the course.
4. Students must already be logged into Moodle and have course-view access.
5. The plugin displays EmbeddedLab Course Studio in an iframe. The student completes an assignment, marks it ready and clicks **Submit to Moodle**.
6. Moodle validates the logged-in session and CSRF sesskey, then stores/upserts the five assignment records against the authenticated Moodle user and course.
7. Instructors with `moodle/course:update` can open `/local/embeddedlab/review.php?courseid=COURSE_ID` to review submissions.

## Security and deployment

- **No API token is exposed in GitHub Pages.** The Moodle page receives iframe messages only from the fixed origin `https://waselghanem33.github.io` and the expected iframe window. It posts the submission using the Moodle user's same-origin authenticated session and CSRF token.
- Moodle must use HTTPS. Depending on your Moodle Content Security Policy, allow embedding the EmbeddedLab GitHub Pages origin. The browser or Moodle security settings may block cross-origin framing; test on staging.
- Student JSON is validated and size-limited server-side. The plugin stores written work in Moodle's database, so institutional privacy and retention policies apply.
- The server trusts **Moodle's authenticated userid**, not the optional student identifier inside the JSON.
- This pilot does not implement Moodle Assignment submissions, gradebook entries, automatic rubric grading, LTI 1.3, course roster synchronization, notifications or a production-grade audit trail.
- A Moodle administrator should review the PHP plugin, permissions, backup/restore implications, database schema and institutional privacy requirements before enabling it in production.
- If the iframe is blocked, use the Version 0.7 JSON export workflow until an approved Moodle-hosted deployment is available.

## Source map

- `index.php` — Moodle-authenticated launch page and origin-checked iframe bridge
- `submit.php` — same-origin POST endpoint, session/CSRF checks and DB upsert
- `review.php` — instructor-only submission list
- `db/install.xml` — Moodle XMLDB table definition
- `version.php`, `lang/en/local_embeddedlab.php` — plugin metadata and strings

## Test checklist (staging)

- Student enrolled in course can launch and submit.
- Student not enrolled in course cannot submit.
- Instructor can review only a course where they have the relevant capability.
- Cross-site forged requests without a valid sesskey fail.
- Tampered and oversized payloads are rejected.
- Re-submitting updates existing records rather than duplicating them.
- Browser frame and CSP settings permit the configured site.
- Database and backups comply with university policy.
