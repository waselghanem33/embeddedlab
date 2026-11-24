#!/usr/bin/env bash
set -eu
# Requires Arduino CLI installed locally. Pass a sketch directory.
arduino-cli compile --fqbn arduino:avr:uno --output-dir "${2:-build}" "$1"
