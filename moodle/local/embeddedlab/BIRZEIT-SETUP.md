# Birzeit University Moodle setup — EmbeddedLab 0.8

## Identified deployment
- Moodle base URL: https://itc.birzeit.edu
- Course ID: 22405
- Section: 3
- User-provided Moodle editing page: https://itc.birzeit.edu/course/modedit.php?add=resource&type=&course=22405&section=3&return=0&sr=0
- Proposed plugin launch after installation: https://itc.birzeit.edu/local/embeddedlab/index.php?courseid=22405
- Instructor review after installation: https://itc.birzeit.edu/local/embeddedlab/review.php?courseid=22405
- EmbeddedLab frontend: https://waselghanem33.github.io/embeddedlab/course.html

## Actions for Moodle site administrator
1. Confirm the Moodle version and site policies permit third-party local plugins and external GitHub Pages iframe content.
2. Review the code under `moodle/local/embeddedlab/` and perform security, privacy and Moodle compatibility testing on staging.
3. Install the plugin into `<moodle-root>/local/embeddedlab/` and run Moodle's upgrade/Notifications workflow.
4. Test with separate enrolled student and teacher accounts in a staging copy of course 22405, including permission denial and CSRF tests.
5. If the browser blocks the iframe, review Moodle's content security policy and frame embedding policy; do not disable security protections indiscriminately.
6. Once installed and approved, add a Moodle **URL** activity to section 3 with the launch URL above. This is not the same as adding a **File** resource.
7. Students complete the lab and explicitly select **Submit to Moodle**. The bridge stores the JSON assignments against the authenticated Moodle user.
8. Teachers use the review URL. This pilot does not populate the native Moodle Assignment module or gradebook.

## Important operational notes
- The source has been committed to GitHub but has **not** been installed on itc.birzeit.edu or tested end-to-end.
- A teacher editing a course normally cannot install a server-side Moodle local plugin; this requires a site administrator.
- Do not share Moodle passwords, sesskeys, personal access tokens or admin credentials in GitHub or ChatGPT.
- Until the plugin is approved, students can use EmbeddedLab's JSON export and submit the file through an ordinary Moodle Assignment activity in section 3.
