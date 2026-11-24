# EmbeddedLab — Arduino & ESP32 Interactive Learning

Browser-based educational prototype for introductory embedded systems.

## Features
- Arduino Uno and ESP32 learning tracks
- Six guided lessons with browser-local completion tracking
- Interactive conceptual GPIO/LED experiment
- Board pin explorer
- Example firmware snippets and formative quiz
- Responsive single-page website; no installation required

## Run locally
Open `index.html` in a modern browser.

## Publish with GitHub Pages
Open **Settings → Pages** in this repository, select **Deploy from a branch**, choose **main** and **/(root)**, and click **Save**. The site URL will be https://waselghanem33.github.io/embeddedlab/ once deployment completes.

## Important limitations
The GPIO/LED demonstration is a JavaScript conceptual model, not a hardware-accurate circuit simulator or firmware compiler. Verify pinouts and electrical constraints for the exact board. There is no backend, authentication, or Moodle integration yet.

## Next steps
- UART/I²C/SPI signal visualization
- Real firmware simulator integration
- Instructor assessments and analytics
- Moodle integration

Version 0.1.

## Engineering Workbench (v0.2)
Open [the interactive laboratory](./lab.html) for idealized UART framing, I²C transactions, SPI mode and full-duplex timing, GPIO fault injection, and diagnostic challenges. This is a pedagogical signal model, not a firmware or electrical simulator.

## Version 0.3 — Virtual Engineering Workbench

Open [Virtual Workbench](./workbench.html) for Arduino Uno / generic ESP32 logical pin mapping, UART/I²C/SPI signal visualization, fault injection, sample cursor, CSV export, diagnostic assessment, and local JSON lab reports.

**Simulation limits:** Simplified digital signal model only. The pin checker uses suggested board mappings (not a complete hardware pin-multiplexer model), SPI uses mode 0, UART uses 8N1, and I²C uses a fixed 0x48 address. No physical voltage/current simulation, compiler, live microcontroller, instructor server or real waveform capture. Check exact board datasheets before connecting hardware.

## Version 0.4 — Visual Circuit Builder

Open [Circuit Builder](./circuit.html). It includes an SVG workspace, pointer-based drag or click-to-connect wiring, Arduino Uno and generic ESP32 logical pin templates, LED/button/UART/I²C/SPI exercises, missing/incorrect/duplicate-terminal wire checks, diagnostics, example solutions, and browser-local/JSON save and restore.

**Scope:** This is a logical connection checker using one suggested mapping per board and experiment. It does **not** simulate physical breadboard continuity, analog current, resistors, pull-up behavior, electrical shorts, signal timing, firmware, or real hardware. A duplicate-terminal wire is flagged as a simplified conflict, not a physically proven short. ESP32 pin assignments depend on board and firmware configuration.

## Version 0.5 — Breadboard Studio

Open [Breadboard Studio](./breadboard.html). Features: connected breadboard rails and five-hole strips, click-to-place jumpers/resistors/LEDs, ideal conductive-net detection, constrained single-series LED DC analysis using Ohm's law, fault warnings, Arduino/ESP32 reference sketches, external links to Wokwi's editors, and local/JSON design save and restore.

**Important boundaries:** The analysis is valid only for an unambiguous series path containing exactly one resistor and one LED between the modeled positive rail and ground. Other networks are flagged as unsupported rather than numerically solved. GPIO is modeled as an ideal 5 V (Uno) or 3.3 V (ESP32) source; no real microcontroller drive constraints, SPICE engine, firmware execution, physical breadboard contact physics, or Wokwi data transfer are provided. Always check hardware documentation and current limits before physical implementation.

## Version 0.6 — Firmware Studio

Open [Firmware Studio](./firmware.html) for Arduino Uno and ESP32 starter sketches (LED blink, button, UART, I²C scan, SPI transfer), an editable sketch, static educational checks, generated Wokwi-style diagram.json, external editor links, downloadable sketch/diagram/report files, and local session saving.

**Integration boundaries:** The platform does not compile, execute, upload or validate firmware. Wokwi project files must be manually added to a matching external Wokwi project. Generated diagrams are starter templates and may need pin or component corrections in Wokwi, especially for SPI peripherals and board-specific variants. Static checks are substring checks, not compilation or functional tests. External Wokwi functionality and licensing are governed by Wokwi.

## Version 0.7 — Engineering Course & Assessment

Open [Course Studio](./course.html) for five scaffolded assignments (GPIO/LED, button, UART, I²C, SPI), formative conceptual quizzes, evidence and reflection fields, local progress saving, JSON student submission export, an instructor rubric (20 points per assignment), instructor-side JSON import, manual rubric scores and CSV overview export.

**Privacy and assessment boundaries:** This is a static, browser-local workflow. Student files must be shared with instructors outside the platform. There are no accounts, authentication, server, Moodle/LTI integration, secure grading, plagiarism checks or automated evaluation of written work. Instructor imports and manual scores are session-only. The formative quiz answers and scores are stored in editable JSON and must not be used as tamper-proof assessment evidence. Instructor should review submitted work and simulator evidence independently.

## Version 0.8 — Moodle Integration Pilot

Course Studio now supports an explicit **Submit to Moodle** action when launched inside the authenticated Moodle bridge. The source of the Moodle local plugin is in [moodle/local/embeddedlab](./moodle/local/embeddedlab/README.md). The plugin uses a same-origin Moodle session and CSRF token to save student submissions in a Moodle database table, and provides a course-restricted instructor review page. No Moodle API token is stored on GitHub Pages.

**Deployment required:** The plugin is source code only. A Moodle administrator must install and test it on the institutional Moodle server, add a course URL resource, and approve the iframe/CSP/privacy settings. The integration has not been deployed or end-to-end tested on a Moodle instance. It does not yet create Moodle Assignment submissions or gradebook scores.

## 1.0 — Unified ENCE4380 Studio

Open [studio.html](./studio.html). The shared deterministic model connects a six-column breadboard netlist, fixed resistor/LED/button terminals, D9 PWM, D2 external interrupt, timer event counts, derived register inspector, ideal waveforms and event log. Editable model instructions are not Arduino C++. Existing labs remain available. Save/restore configuration locally, export evidence JSON, and access the existing 16-assignment Course Studio. Moodle file upload remains manual. No general electrical solver, AVR execution, physical component placement, historical waveform capture, or automatic assessment synchronization. Run regression tests with `node -e "require('./engine-v1.js');require('./tests-v1.js')"`. Browser acceptance testing remains required.

## 1.1 — AVR8js laboratory (experimental)
[avr-studio.html](./avr-studio.html) loads pinned AVR8js 0.21.1 via jsDelivr, accepts externally compiled Uno Intel HEX, and includes hand-encoded AVR demo firmware. CPU, GPIO and three timer peripherals are instantiated. D9 LED and D2 button use the bounded breadboard model; D13 is captured. Registers and instruction-boundary GPIO traces derive from the emulator. No compiler, general circuit solver, serial peripherals, or automatic Moodle grading. Released input is idealized HIGH, not a floating-input solver. The CDN dependency and actual CPU execution could not be tested in the development environment; use the preserved 1.0 studio if unavailable. HEX roundtrip and checksum rejection were tested. Browser acceptance and firmware behavior remain pending.

## 1.2 graphical workspace
The AVR studio now has an interactive SVG Uno and breadboard, colored netlist jumpers, navigation sidebar and editable downloadable Arduino C++ reference draft. The existing native HEX execution is unchanged; C++ compilation is external. Components remain fixed and only D9/D2/GND wiring is modeled. No drag-and-drop placement or general circuit solver. Existing modules are retained. JavaScript syntax checked; CI and Pages deployment must be verified separately.

## 1.2.1
Graphical Uno header sockets, continuous ideal power rails, movable component leads via selectors, and ideal potentiometer divider indication. D9 LED and D2 button remain the supported AVR-connected circuit; A0 voltage is not injected into ADC. Other headers are wiring-only, no general electrical solver or drag-and-drop. Browser regression adds lead relocation and rail-short tests.

## 1.2.2
AVRADC instantiated with six Uno analog channels connected to ideal rail or potentiometer nets. All twenty GPIO pins have ideal external input mapping and live pin state inspection. Floating inputs default low except D2 (legacy high); no general electrical solver, output contention model, or arbitrary output-driven net propagation. LED remains D9-specific. ADC register conversion regression added; check Actions for execution results.

## 1.2.3
Ideal DC nodal solver synchronizes GPIO output states, inputs and ADC channels at instruction boundaries when drive states change. Up to 12 additional resistors, LEDs and switches use terminal selectors. Internal pull-ups are 30kΩ; floating nodes use a tiny numerical leakage to ground. LEDs use 2V + 10Ω piecewise linear approximation. Conflicting ideal sources are flagged, not physically simulated; results on faulted nets are not reliable. No transient capacitance, thermal model, drag placement, or real-time guarantee. Original D9 summary remains a separate reference estimate. See network-test.mjs and Actions for validation.

## 1.3 Arduino programming
Pages and validation workflows compile serial, pwm and interrupt examples with Arduino CLI 1.2.2 and arduino:avr 1.8.6. Select a compiled exercise in AVR Studio to load its source and executable HEX. Edited source is not automatically compiled. For custom sketches install Arduino CLI, run `arduino-cli core update-index`, `arduino-cli core install arduino:avr@1.8.6`, then `bash compile-uno.sh /path/to/sketch` and import the resulting non-bootloader HEX. CLI prints compiler diagnostics; GitHub Actions logs show example compilation diagnostics. USART0 TX monitor is byte-level, not a physical UART wire model; RX not implemented. Instruction stepping and PC word breakpoint are available, not source-level debugging. Check Actions for actual test and deployment outcomes.
