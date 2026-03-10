# Proposal: Fix Mobile Hamburger Menu Not Closing on Nav Link Click

## Root Cause

The mobile menu JavaScript never loads. In `/Users/yonidavidson/dev/private/gopherconil.github.io/layouts/index.html` (lines 48-53), `main.js` is included **inside** a conditional block that requires both `address` and `GoogleMapsKey` site params:

```html
{{ if isset .Site.Params "address" }}
{{ with .Site.Params.GoogleMapsKey }}
<script src="https://maps.google.com/maps/api/js?key={{ . }}"></script>
<script src="/js/main.js"></script>
{{ end }}
{{ end }}
```

In `/Users/yonidavidson/dev/private/gopherconil.github.io/config.yml`, both params are commented out (lines 17 and 22):

```yaml
# Address: "Expo - Bitan 10"
# GoogleMapsKey: "my-secret-maps-key"
```

Because of this, `main.js` is never loaded. The mobile menu toggle button renders in the HTML (from `nav.html`) and the CSS shows/hides it correctly on mobile, but the JavaScript that adds/removes the `active` class on click (including the close-on-nav-link-click handler at lines 155-160 of `main.js`) never executes. The hamburger button does nothing at all -- it cannot open or close the menu.

## Proposed Changes

### Change 1: Move `main.js` outside the Google Maps conditional

**File:** `/Users/yonidavidson/dev/private/gopherconil.github.io/layouts/index.html`

**Current code (lines 46-53):**
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="https://code.jquery.com/jquery-3.7.1.min.js"><\/script>')</script>
{{ if isset .Site.Params "address" }}
{{ with .Site.Params.GoogleMapsKey }}
<script src="https://maps.google.com/maps/api/js?key={{ . }}"></script>
<script src="/js/main.js"></script>
{{ end }}
{{ end }}
```

**Proposed code:**
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="https://code.jquery.com/jquery-3.7.1.min.js"><\/script>')</script>
{{ if isset .Site.Params "address" }}
{{ with .Site.Params.GoogleMapsKey }}
<script src="https://maps.google.com/maps/api/js?key={{ . }}"></script>
{{ end }}
{{ end }}
<script src="/js/main.js"></script>
```

### Change 2: Guard `conf.map.init` against missing Google Maps API

Since `main.js` will now load even when Google Maps is not available, `conf.map.init` will crash on `new google.maps.Geocoder()` because `google` is undefined. We need to add a guard.

**File:** `/Users/yonidavidson/dev/private/gopherconil.github.io/themes/hugo-conference/static/js/main.js`

**Current code (lines 7-12):**
```js
conf.init = function () {
    conf.map.init($('#map-canvas'));
    conf.menu.init();
    conf.mobileMenu.init();
    conf.scrollSpy.init();
};
```

**Proposed code:**
```js
conf.init = function () {
    if (typeof google !== 'undefined' && google.maps && $('#map-canvas').length) {
        conf.map.init($('#map-canvas'));
    }
    conf.menu.init();
    conf.mobileMenu.init();
    conf.scrollSpy.init();
};
```

### Change 3: Rebuild the site output

After making the above changes, run `make build` (or `hugo`) so that `docs/js/main.js` is updated from the theme source and `docs/index.html` reflects the new script tag placement.

## Why the Existing "Close on Nav Link Click" Code Doesn't Work

The code to close the menu on nav link click already exists in `main.js` at lines 155-160:

```js
$navLinks.on('click', function () {
    $toggle.removeClass('active');
    $menu.removeClass('active');
    $('body').removeClass('menu-open');
});
```

This code is correct. The problem is purely that the script file is never loaded due to the conditional inclusion described above. No changes to the mobile menu logic itself are needed.

## Summary

- **Primary fix:** Move `<script src="/js/main.js"></script>` outside the Google Maps conditional in `layouts/index.html`
- **Secondary fix:** Add a guard in `main.js` so `conf.map.init` only runs when Google Maps API is available
- **Files to edit:** `layouts/index.html`, `themes/hugo-conference/static/js/main.js`
- **Files to rebuild:** `docs/` (via `make build`)
