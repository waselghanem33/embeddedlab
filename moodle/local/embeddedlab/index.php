<?php
require_once(__DIR__ . '/../../../config.php');
$courseid = required_param('courseid', PARAM_INT);
$course = get_course($courseid);
require_login($course);
$context = context_course::instance($courseid);
require_capability('moodle/course:view', $context);
$PAGE->set_url(new moodle_url('/local/embeddedlab/index.php', ['courseid' => $courseid]));
$PAGE->set_context($context);
$PAGE->set_title('EmbeddedLab');
$PAGE->set_heading(format_string($course->fullname));
echo $OUTPUT->header();
$origin = 'https://waselghanem33.github.io';
$src = $origin . '/embeddedlab/course.html?moodle_origin=' . rawurlencode((string)$CFG->wwwroot);
echo html_writer::tag('p', 'Complete your laboratory work below, then click Submit to Moodle. Your Moodle identity is supplied by the authenticated course page.');
echo html_writer::tag('iframe', '', [
    'id' => 'embeddedlab-frame',
    'src' => $src,
    'title' => 'EmbeddedLab engineering course',
    'style' => 'width:100%;height:1100px;border:1px solid #aaa',
    'allow' => 'clipboard-write'
]);
$endpoint = new moodle_url('/local/embeddedlab/submit.php');
$config = [
    'origin' => $origin,
    'endpoint' => $endpoint->out(false),
    'sesskey' => sesskey(),
    'courseid' => $courseid
];
echo html_writer::tag('p', '', ['id' => 'embeddedlab-status', 'role' => 'status']);\necho html_writer::link(new moodle_url('/local/embeddedlab/review.php', ['courseid' => $courseid]), 'Instructor submissions');
echo html_writer::script('const EMBEDDEDLAB_BRIDGE = ' . json_encode($config, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) . ';
window.addEventListener("message", async function(event) {
  if (event.origin !== EMBEDDEDLAB_BRIDGE.origin) return;
  if (event.source !== document.getElementById("embeddedlab-frame").contentWindow) return;
  const msg = event.data;
  if (!msg || msg.type !== "embeddedlab:submit" || msg.version !== "0.8" || !msg.submission) return;
  const status = document.getElementById("embeddedlab-status");
  status.textContent = "Submitting to Moodle...";
  try {
    const body = new URLSearchParams();
    body.set("sesskey", EMBEDDEDLAB_BRIDGE.sesskey);
    body.set("courseid", String(EMBEDDEDLAB_BRIDGE.courseid));
    body.set("payload", JSON.stringify(msg.submission));
    const response = await fetch(EMBEDDEDLAB_BRIDGE.endpoint, {
      method: "POST", credentials: "same-origin",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw Error(result.error || "Submission failed");
    status.textContent = "Submission saved to Moodle.";
    event.source.postMessage({type:"embeddedlab:result", ok:true}, EMBEDDEDLAB_BRIDGE.origin);
  } catch (err) {
    status.textContent = "Moodle submission failed: " + err.message;
    event.source.postMessage({type:"embeddedlab:result", ok:false}, EMBEDDEDLAB_BRIDGE.origin);
  }
});');
echo $OUTPUT->footer();
