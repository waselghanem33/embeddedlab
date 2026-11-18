<?php
require_once(__DIR__ . '/../../../config.php');
header('Content-Type: application/json; charset=utf-8');
try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new moodle_exception('invalidrequest');
    }
    $courseid = required_param('courseid', PARAM_INT);
    $course = get_course($courseid);
    require_login($course);
    require_sesskey();
    $context = context_course::instance($courseid);
    require_capability('moodle/course:view', $context);
    $raw = required_param('payload', PARAM_RAW);
    if (strlen($raw) > 150000) {
        throw new moodle_exception('invalidsubmission', 'local_embeddedlab');
    }
    $data = json_decode($raw, true);
    $allowed = ['gpio', 'button', 'uart', 'i2c', 'spi'];
    if (!is_array($data) || ($data['schema'] ?? '') !== 'embeddedlab-course-v07' ||
        !isset($data['assignments']) || !is_array($data['assignments']) ||
        count($data['assignments']) !== 5) {
        throw new moodle_exception('invalidsubmission', 'local_embeddedlab');
    }
    $seen = [];
    foreach ($data['assignments'] as $item) {
        if (!is_array($item) || !in_array($item['id'] ?? '', $allowed, true) ||
            isset($seen[$item['id']]) || !isset($item['prediction'], $item['observations'],
            $item['reasoning'], $item['reflection']) ||
            !is_string($item['prediction']) || !is_string($item['observations']) ||
            !is_string($item['reasoning']) || !is_string($item['reflection'])) {
            throw new moodle_exception('invalidsubmission', 'local_embeddedlab');
        }
        $seen[$item['id']] = true;
        foreach (['prediction', 'observations', 'reasoning', 'reflection'] as $field) {
            if (strlen($item[$field]) > 10000) {
                throw new moodle_exception('invalidsubmission', 'local_embeddedlab');
            }
        }
    }
    $transaction = $DB->start_delegated_transaction();
    foreach ($data['assignments'] as $item) {
        $conditions = ['courseid' => $courseid, 'userid' => $USER->id, 'assignmentid' => $item['id']];
        $record = $DB->get_record('local_embeddedlab_sub', $conditions);
        $entry = (object)array_merge($conditions, [
            'payload' => json_encode($item, JSON_UNESCAPED_UNICODE),
            'timemodified' => time()
        ]);
        if ($record) {
            $entry->id = $record->id;
            $DB->update_record('local_embeddedlab_sub', $entry);
        } else {
            $entry->timecreated = time();
            $DB->insert_record('local_embeddedlab_sub', $entry);
        }
    }
    $transaction->allow_commit();
    echo json_encode(['ok' => true, 'saved' => count($data['assignments'])]);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Unable to save submission. Check Moodle access and data format.']);
}
