# Proposal: Add Wix as a Gold Sponsor

## Summary

Add "Wix" as a new gold sponsor to the GopherCon Israel 2026 website. This requires one change to a single file, plus ensuring the sponsors section is visible on the site.

## File to Edit

**`/Users/yonidavidson/dev/private/gopherconil.github.io/config.yml`**

### Change 1: Add Wix to the gold sponsors list

After the existing Tenable gold sponsor entry (lines 91-95), add a new entry:

```yaml
      - name: "Wix"
        logo: "/img/wix.png"
        url: "https://www.wix.com"
        body:
          - text: ""
```

This follows the exact same structure as the other gold sponsors (AppsFlyer, Google, Descope, Tenable). The `body` field with an empty `text` matches the pattern used by the Google sponsor entry.

### Change 2: Uncomment the sponsors section

On line 31, change:
```yaml
    # - sponsors
```
to:
```yaml
    - sponsors
```

This is necessary because the `sponsors` section is currently commented out in the `Sections` list (line 31), which means sponsors are not displayed on the site at all. Without uncommenting this line, neither the existing sponsors nor the new Wix sponsor would be visible.

## No Template Changes Required

The sponsors partial template (`/Users/yonidavidson/dev/private/gopherconil.github.io/layouts/partials/sponsors.html`) already iterates over `.sponsors.gold` using `range`, so adding a new entry to the `gold` list in `config.yml` is sufficient -- it will be rendered automatically.

## No Other Files Affected

- The logo file `/img/wix.png` is assumed to already exist in `/Users/yonidavidson/dev/private/gopherconil.github.io/static/img/wix.png` (the task states the logo is at `/img/wix.png`).
- No CSS changes are needed; the existing `speakers-list` / `speakers-item` styles handle sponsor display.

## Note on Build

After making the config change, running `make build` (or `hugo`) would regenerate the `docs/` directory with the updated sponsor content.
