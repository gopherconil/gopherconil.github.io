# Proposal: Add Schedule Section to GopherCon Israel Site

## Summary

Two files need to be changed:

1. **`config.yml`** -- Uncomment `schedule` in `Sections` and add a `Schedule` data block.
2. **`layouts/partials/schedule.html`** -- Replace the current Sessionize embed with a template that renders schedule data from the config.

The theme's built-in schedule partial (in `themes/hugo-conference/layouts/partials/schedule.html`) already knows how to render schedule data from config, but the project overrides it with a Sessionize script embed. We need to update the project-level override to use config-driven data instead.

---

## File 1: `config.yml`

**Path:** `/Users/yonidavidson/dev/private/gopherconil.github.io/.claude/worktrees/agent-a3df467d/config.yml`

### Change 1: Uncomment `schedule` in the `Sections` list

Replace:

```yaml
  Sections:
    - about
    - location
    # - speakers
    # - schedule
    # - sponsors
    - team
    - tweets
    # - partners
    # - contact
```

With:

```yaml
  Sections:
    - about
    - location
    # - speakers
    - schedule
    # - sponsors
    - team
    - tweets
    # - partners
    # - contact
```

### Change 2: Add a `Schedule` data block under `params`

Add the following block to `config.yml` under `params` (e.g., after the `Team` block at the end of the file, or anywhere within `params`):

```yaml
  Schedule:
    - name: "Welcome & Opening"
      time: "09:00"
      presentation:
        title: "Welcome & Opening"
        description: "Opening remarks and welcome to GopherCon Israel 2026."
        time: "09:00"
      bio: ""
      company: ""

    - name: "Natalie Pistunovich"
      photo: ""
      bio: ""
      company: ""
      presentation:
        title: "Go Generics in Production"
        description: ""
        time: "09:30"

    - name: "Bill Kennedy"
      photo: ""
      bio: ""
      company: ""
      presentation:
        title: "Building CLI Tools with Cobra"
        description: ""
        time: "10:30"
```

**Why this structure:** The theme's schedule template (`themes/hugo-conference/layouts/partials/schedule.html`) iterates over `.schedule` (Hugo lowercases param keys). Each entry is checked for a `presentation` sub-key:
- If `presentation` is present: renders as a talk row with `presentation.time`, `presentation.title`, `presentation.description`, speaker `.name`, `.photo`, and `.company`.
- If `presentation` is absent: renders as a simple event row (e.g., "Lunch", "Coffee break") using top-level `.time` and `.name`.

For the "Welcome & Opening" talk by Yoni Davidson, you could also model it as a non-presentation entry (without `presentation`) if you prefer it to render as a simple event row:

```yaml
    - name: "Welcome & Opening by Yoni Davidson"
      time: "09:00"
```

---

## File 2: `layouts/partials/schedule.html`

**Path:** `/Users/yonidavidson/dev/private/gopherconil.github.io/.claude/worktrees/agent-a3df467d/layouts/partials/schedule.html`

The current content is a Sessionize embed:

```html
<div id="sessionize-container">
  <h1>GopherCon Israel Schedule</h1>
  <script type="text/javascript" src="https://sessionize.com/api/v2/v0z7qeyi/view/GridSmart"></script>
</div>
```

### Option A: Use the theme's built-in template (recommended)

Replace the file contents with what the theme already provides at `themes/hugo-conference/layouts/partials/schedule.html`:

```html
<h2 class="section-title">{{ .titles.schedule }}</h2>

<p>GopherCon Israel 2026 Schedule</p>
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

### Option B: Delete the project-level override entirely

Simply delete `layouts/partials/schedule.html` so Hugo falls through to the theme's version at `themes/hugo-conference/layouts/partials/schedule.html`. This is the simplest approach -- the theme template already handles everything correctly.

---

## How it works end-to-end

1. Hugo reads `config.yml` and makes all `params` available under `.Site.Params`.
2. `layouts/index.html` (the main layout) iterates over `Sections` and for each section name calls `{{ partial $section $.Site.Params }}`.
3. When `$section` is `"schedule"`, Hugo resolves `layouts/partials/schedule.html` (project-level override takes precedence over theme).
4. The partial receives `.Site.Params` as its context, so `.schedule` maps to the `Schedule` key in config (Hugo lowercases).
5. The template iterates over the schedule entries, rendering talks (with `presentation`) and simple events differently.

## Notes

- The `Titles.schedule` entry already exists in the config (line 42: `schedule: "Schedule"`), so the section heading will render correctly.
- If you also want to show a speakers section, you would uncomment `- speakers` in `Sections` too. The speakers partial (`layouts/partials/speakers.html`) currently uses a Sessionize embed; you would need to update it similarly, or revert to the theme version which also reads from the `Schedule` data (it filters for entries with `presentation`).
- Speaker photos can be added later by setting the `photo` field to a path like `"/img/speaker-name.jpg"` and placing the image in the `static/img/` directory.
