# Proposal: Add Schedule Section to GopherCon Israel Site

## Overview

Two files need to be changed: `config.yml` (add schedule data and activate the section) and `layouts/partials/schedule.html` (replace the Sessionize embed with a data-driven template).

---

## File 1: `config.yml`

**Path:** `/Users/yonidavidson/dev/private/gopherconil.github.io/config.yml`

### Change 1: Activate the schedule section

Uncomment `schedule` in the `Sections` list. Current state:

```yaml
  Sections:
    - about
    - location
    # - speakers
    # - schedule
    # - sponsors
    - team
    - tweets
```

Change to:

```yaml
  Sections:
    - about
    - location
    # - speakers
    - schedule
    # - sponsors
    - team
    - tweets
```

### Change 2: Add schedule data

Add a new `Schedule` key under `params` (e.g., after the `Titles` block, or anywhere under `params`). The theme's schedule partial (in `themes/hugo-conference/layouts/partials/schedule.html`) iterates over `.schedule` and expects either items with a `.presentation` sub-object (for talks) or items with `.time` and `.name` (for non-talk slots like breaks). The data should be:

```yaml
  Schedule:
    - name: "Yoni Davidson"
      presentation:
        title: "Welcome & Opening"
        time: "09:00"
        description: "Welcome to GopherCon Israel 2026"
    - name: "Natalie Pistunovich"
      presentation:
        title: "Go Generics in Production"
        time: "09:30"
        description: "Lessons learned from using Go generics in production systems"
    - name: "Bill Kennedy"
      presentation:
        title: "Building CLI Tools with Cobra"
        time: "10:30"
        description: "A deep dive into building command-line tools with the Cobra library"
```

---

## File 2: `layouts/partials/schedule.html`

**Path:** `/Users/yonidavidson/dev/private/gopherconil.github.io/layouts/partials/schedule.html`

### Change: Replace Sessionize embed with data-driven template

The current file contains a Sessionize JavaScript embed:

```html
<div id="sessionize-container">
  <h1>GopherCon Israel Schedule</h1>
  <script type="text/javascript" src="https://sessionize.com/api/v2/v0z7qeyi/view/GridSmart"></script>
</div>
```

Replace the entire file with a template that reads from `config.yml` params, matching the theme's existing CSS classes (`schedule-tbl`, `schedule-time`, `schedule-slot`, `schedule-description`, etc.) which are already defined in `static/css/main.css`:

```html
<h2 class="section-title">{{ .titles.schedule }}</h2>

<div class="schedule-tbl">
  <table>
    <thead>
      <tr>
        <th class="schedule-time">Time</th>
        <th class="schedule-slot">Slot</th>
        <th class="schedule-description">Description</th>
      </tr>
    </thead>
    <tbody>
      {{ range $slot := .schedule }}
        {{ if ne .presentation nil }}
          <tr>
            <td class="schedule-time">{{ .presentation.time }}</td>
            <td class="schedule-slot">
            {{ with .photo }}
              <span class="speaker-photo">
                <img class="photo" src="{{ . }}" alt="{{ $slot.name }}">
              </span>
            {{ end }}
              {{ .presentation.title }}
              <span class="speakers-company">{{ .company }}</span>
            </td>
            <td class="schedule-description">{{ .presentation.description }}</td>
          </tr>
        {{ else }}
          <tr class="schedule-other">
            <td class="schedule-time">{{ .time }}</td>
            <td class="schedule-slot">{{ .name }}</td>
            <td class="schedule-description">-</td>
          </tr>
        {{ end }}
      {{ end }}
    </tbody>
  </table>
</div>
```

This is the same template from the theme's original `schedule.html` at `themes/hugo-conference/layouts/partials/schedule.html`. It uses the theme's existing CSS (already in `static/css/main.css`) which provides table styling, alternating row colors, hover effects, responsive breakpoints, and speaker photo support.

---

## How It Works

1. **`layouts/index.html`** iterates over `Sections` in config: `{{ range $section := .Site.Params.Sections }}` and calls `{{ partial $section $.Site.Params }}`. When `schedule` is in the list, it renders the `schedule.html` partial.

2. **The partial** receives `.Site.Params` as its context (the dot). It accesses `.titles.schedule` for the heading and `.schedule` for the list of talks. Hugo lowercases param keys, so `Schedule:` in config becomes `.schedule` in templates.

3. **CSS** is already present in `static/css/main.css` (lines 628-720 for base styles, 847-887 for mobile responsive, and 1670-1720 for color theme). No CSS changes are needed.

---

## Optional Enhancements

These are not required but could be added later:

- **Speaker photos**: Add a `photo` field to each schedule entry (e.g., `photo: "img/natalie-pistunovich.jpg"`) and the template will render it automatically.
- **Company names**: Add a `company` field to show the speaker's affiliation.
- **Non-talk slots**: Add entries without a `presentation` key for breaks, lunch, etc.:
  ```yaml
    - time: "10:15"
      name: "Coffee Break"
  ```
  These render with the `schedule-other` CSS class (styled differently).
