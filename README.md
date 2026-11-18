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
