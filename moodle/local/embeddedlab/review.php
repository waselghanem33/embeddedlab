<?php
require_once(__DIR__ . '/../../../config.php');
$courseid = required_param('courseid', PARAM_INT);
$course = get_course($courseid);
require_login($course);
$context = context_course::instance($courseid);
require_capability('moodle/course:update', $context);
$PAGE->set_url(new moodle_url('/local/embeddedlab/review.php', ['courseid' => $courseid]));
$PAGE->set_context($context);
$PAGE->set_title('EmbeddedLab submissions');
$PAGE->set_heading(format_string($course->fullname));
echo $OUTPUT->header();
echo $OUTPUT->heading('EmbeddedLab submissions');
$records = $DB->get_records('local_embeddedlab_sub', ['courseid' => $courseid], 'timemodified DESC');
$table = new html_table();
$table->head = ['Moodle user ID', 'Assignment', 'Updated', 'Student work'];
foreach ($records as $r) {
    $item = json_decode($r->payload, true);
    $details = [];
    foreach (['prediction', 'observations', 'reasoning', 'reflection'] as $field) {
        $details[] = html_writer::tag('strong', ucfirst($field) . ': ') .
            s((string)($item[$field] ?? ''));
    }
    $table->data[] = [$r->userid, s($r->assignmentid), userdate($r->timemodified),
        implode(html_writer::empty_tag('br'), $details)];
}
echo html_writer::table($table);
echo $OUTPUT->footer();
