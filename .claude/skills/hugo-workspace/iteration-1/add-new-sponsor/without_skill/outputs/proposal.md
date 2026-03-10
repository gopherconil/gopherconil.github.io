# Proposal: Add Wix as a Gold Sponsor

## File to Edit

`/Users/yonidavidson/dev/private/gopherconil.github.io/config.yml`

## What to Change

Add a new entry to the `params.Sponsors.gold` list (under the existing gold sponsors, after the Tenable entry on line 95 and before the `silver:` key on line 96).

### Exact Addition

Insert the following YAML block between line 95 (the last line of the Tenable body text) and line 96 (`silver:`):

```yaml
      - name: "Wix"
        logo: "/img/wix.png"
        url: "https://www.wix.com"
        body:
          - text: ""
```

### Resulting Context (lines 91-98 after the edit)

```yaml
      - name: "Tenable"
        logo: "/img/tenable-logo.png"
        url: "https://www.tenable.com/careers/search?country=Israel"
        body:
          - text: "Tenable is the exposure management company..."
      - name: "Wix"
        logo: "/img/wix.png"
        url: "https://www.wix.com"
        body:
          - text: ""
    silver:
```

## Why This Is Sufficient

- The sponsors partial template (`layouts/partials/sponsors.html`) iterates over `params.Sponsors.gold` with `{{ range $sponsor := .sponsors.gold }}` and renders each entry's `name`, `logo`, `url`, and optional `body` fields.
- All existing gold sponsors follow the same structure: `name`, `logo`, `url`, and `body` (with a list containing one `text` entry). The new Wix entry mirrors this pattern exactly, with an empty body text (same as Google's entry).
- No changes to templates or CSS are needed. The new sponsor will appear automatically alongside the existing gold sponsors.
- The logo file `/img/wix.png` is assumed to already exist in the `static/img/` directory (i.e., at `static/img/wix.png`). If it does not yet exist, it must be placed there before the site is built.

## Files Involved

| File | Action |
|------|--------|
| `config.yml` (line ~95) | Edit: add new gold sponsor entry |
| `static/img/wix.png` | Prerequisite: logo file must exist here |
| `layouts/partials/sponsors.html` | No change needed (read-only reference) |
