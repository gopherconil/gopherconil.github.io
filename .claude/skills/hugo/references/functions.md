# Hugo Functions Reference

## Table of Contents
1. [String Functions](#string-functions)
2. [Collection Functions](#collection-functions)
3. [Math Functions](#math-functions)
4. [Time Functions](#time-functions)
5. [URL Functions](#url-functions)
6. [Path Functions](#path-functions)
7. [Transform Functions](#transform-functions)
8. [Resource Functions](#resource-functions)
9. [Encoding Functions](#encoding-functions)
10. [Crypto/Hash Functions](#cryptohash-functions)
11. [OS Functions](#os-functions)
12. [Cast Functions](#cast-functions)
13. [Debug Functions](#debug-functions)
14. [fmt Functions](#fmt-functions)
15. [Safe Functions](#safe-functions)
16. [Hugo Pipes](#hugo-pipes)
17. [CSS Functions](#css-functions)
18. [JS Functions](#js-functions)
19. [Image Functions](#image-functions)

## String Functions

```go-html-template
{{ strings.ToLower "HELLO" }}                    → "hello"
{{ strings.ToUpper "hello" }}                    → "HELLO"
{{ strings.Title "hello world" }}                → "Hello World"
{{ strings.TrimPrefix "pre-" "pre-hello" }}      → "hello"
{{ strings.TrimSuffix ".html" "page.html" }}     → "page"
{{ strings.Trim "  hello  " " " }}               → "hello"
{{ strings.TrimLeft "aab" "a" }}                 → "b"
{{ strings.TrimRight "baa" "a" }}                → "b"
{{ strings.HasPrefix "hello" "he" }}             → true
{{ strings.HasSuffix "hello" "lo" }}             → true
{{ strings.Contains "hello" "ell" }}             → true
{{ strings.ContainsAny "hello" "aeiou" }}        → true
{{ strings.ContainsNonSpace "  a  " }}           → true
{{ strings.Count "hello" "l" }}                  → 2
{{ strings.Replace "hello" "l" "r" }}            → "herro"
{{ strings.ReplaceRE `(\w+)` "[$1]" "hello world" }} → "[hello] [world]"
{{ strings.FindRE `\d+` "abc123def456" }}        → ["123", "456"]
{{ strings.FindRE `\d+` "abc123def456" 1 }}      → ["123"]
{{ strings.Repeat 3 "ha" }}                      → "hahaha"
{{ strings.Truncate 10 "..." "Hello World" }}    → "Hello W..."
{{ strings.Substr "hello" 1 3 }}                 → "ell"
{{ strings.Split "a,b,c" "," }}                  → ["a", "b", "c"]

{{ chomp "hello\n" }}                            → "hello" (remove trailing newline)
{{ htmlEscape "<b>bold</b>" }}                   → "&lt;b&gt;bold&lt;/b&gt;"
{{ htmlUnescape "&lt;b&gt;" }}                   → "<b>"
{{ urlize "Hello World" }}                       → "hello-world"
{{ anchorize "Hello World" }}                    → "hello-world"
{{ emojify ":rocket:" }}                         → 🚀 (if enableEmoji)
{{ markdownify "**bold**" }}                     → "<strong>bold</strong>"
{{ plainify "<b>bold</b>" }}                     → "bold"
{{ humanize "camelCase" }}                       → "Camel case"
{{ pluralize "post" }}                           → "posts"
{{ singularize "posts" }}                        → "post"
{{ lower "HELLO" }}                              → "hello" (alias)
{{ upper "hello" }}                              → "HELLO" (alias)
{{ title "hello world" }}                        → "Hello World" (alias)
{{ trim "  hello  " " " }}                       → "hello" (alias)
```

## Collection Functions

```go-html-template
{{/* Slices */}}
{{ $s := slice "a" "b" "c" }}
{{ $s = append "d" $s }}                         → ["a","b","c","d"]
{{ first 2 $s }}                                 → ["a","b"]
{{ last 2 $s }}                                  → ["c","d"]
{{ after 1 $s }}                                 → ["b","c","d"]
{{ in $s "b" }}                                  → true
{{ len $s }}                                     → 4
{{ sort $s }}                                    → sorted slice
{{ uniq $s }}                                    → deduplicated
{{ shuffle $s }}                                 → random order
{{ delimit $s ", " " and " }}                    → "a, b, c and d"
{{ index $s 0 }}                                 → "a"

{{/* Dicts (maps) */}}
{{ $d := dict "name" "Hugo" "version" "0.120" }}
{{ $d = merge $d (dict "os" "any") }}            → merged map
{{ $d.name }}                                    → "Hugo"
{{ index $d "name" }}                            → "Hugo"
{{ isset $d "name" }}                            → true
{{ $keys := collections.Keys $d }}
{{ $values := collections.Values $d }}

{{/* Where (filtering) */}}
{{ where .Pages "Section" "posts" }}
{{ where .Pages "Params.featured" true }}
{{ where .Pages "Params.rating" ">=" 4 }}
{{ where .Pages "Title" "!=" "" }}
{{ where .Pages "Params.tags" "intersect" (slice "go") }}
{{ where .Pages "Date" ">" (now.AddDate -1 0 0) }}

{{/* Operators for where: =, !=, >, >=, <, <=, in, not in, intersect, like */}}

{{/* Group */}}
{{ .Pages.GroupBy "Section" }}
{{ .Pages.GroupByDate "2006-01" }}
{{ .Pages.GroupByParam "author" }}
{{ .Pages.GroupByParamDate "event_date" "2006" }}

{{/* Apply function to each element */}}
{{ apply (slice "a" "b") "strings.ToUpper" "." }}  → ["A","B"]

{{/* Range complement (set difference) */}}
{{ $all := .Site.RegularPages }}
{{ $featured := where $all "Params.featured" true }}
{{ $rest := complement $featured $all }}

{{/* Symmetric difference */}}
{{ symdiff (slice 1 2 3) (slice 2 3 4) }}        → [1,4]

{{/* Union */}}
{{ union (slice 1 2) (slice 2 3) }}              → [1,2,3]

{{/* Intersect */}}
{{ intersect (slice 1 2 3) (slice 2 3 4) }}      → [2,3]
```

## Math Functions

```go-html-template
{{ add 1 2 }}           → 3
{{ sub 5 3 }}           → 2
{{ mul 3 4 }}           → 12
{{ div 10 3 }}          → 3  (integer division)
{{ mod 10 3 }}          → 1
{{ math.Abs -5 }}       → 5
{{ math.Ceil 1.5 }}     → 2
{{ math.Floor 1.5 }}    → 1
{{ math.Round 1.5 }}    → 2
{{ math.Log 10 }}       → 2.302...
{{ math.Max 5 10 }}     → 10
{{ math.Min 5 10 }}     → 5
{{ math.Pow 2 8 }}      → 256
{{ math.Sqrt 16 }}      → 4
{{ math.Counter }}      → auto-incrementing counter
```

## Time Functions

```go-html-template
{{ now }}                                        → current time
{{ now.Format "2006-01-02" }}                    → "2026-03-10"
{{ now.Format "January 2, 2006" }}               → "March 10, 2026"
{{ now.Format "Mon, 02 Jan 2006 15:04:05 MST" }}
{{ now.Unix }}                                   → Unix timestamp
{{ now.Year }}                                   → 2026
{{ now.Month }}                                  → 3
{{ now.Day }}                                    → 10

{{ time.AsTime "2026-01-15" }}                   → Time object
{{ time.Format "2006-01-02" .Date }}             → formatted date
{{ time.ParseDuration "10h" }}                   → Duration object

{{/* Date arithmetic */}}
{{ now.AddDate 0 -1 0 }}                         → one month ago
{{ now.AddDate 1 0 0 }}                          → one year from now

{{/* Go reference time: Mon Jan 2 15:04:05 MST 2006 */}}
{{/* Common formats: */}}
{{/* "2006-01-02"           → 2026-03-10 */}}
{{/* "January 2, 2006"      → March 10, 2026 */}}
{{/* "Jan 02, 2006"         → Mar 10, 2026 */}}
{{/* "02/01/2006"           → 10/03/2026 */}}
{{/* "3:04 PM"              → 2:30 PM */}}
{{/* "15:04"                → 14:30 */}}
{{/* "Monday"               → Tuesday */}}
{{/* ":date_full"           → March 10, 2026 */}}
{{/* ":date_long"           → March 10, 2026 */}}
{{/* ":date_medium"         → Mar 10, 2026 */}}
{{/* ":date_short"          → 3/10/26 */}}
```

## URL Functions

```go-html-template
{{ absURL "about/" }}                            → "https://example.org/about/"
{{ relURL "about/" }}                            → "/about/"
{{ urls.Parse "https://example.org/path?q=1" }}  → URL object
  {{ $u := urls.Parse "..." }}
  {{ $u.Scheme }}   → "https"
  {{ $u.Host }}     → "example.org"
  {{ $u.Path }}     → "/path"
  {{ $u.Query }}    → "q=1"
{{ ref . "other-page.md" }}                      → absolute URL to page
{{ relref . "other-page.md" }}                   → relative URL to page
```

## Path Functions

```go-html-template
{{ path.Base "a/b/c.txt" }}      → "c.txt"
{{ path.Dir "a/b/c.txt" }}       → "a/b"
{{ path.Ext "file.html" }}       → ".html"
{{ path.Join "a" "b" "c" }}      → "a/b/c"
{{ path.Clean "a//b/../c" }}     → "a/c"
{{ path.Split "a/b/c.txt" }}     → ["a/b/", "c.txt"]
```

## Transform Functions

```go-html-template
{{ markdownify "**bold** text" }}                → <strong>bold</strong> text
{{ plainify "<h1>Title</h1>" }}                  → "Title"
{{ htmlEscape "<script>" }}                      → "&lt;script&gt;"
{{ htmlUnescape "&amp;" }}                       → "&"
{{ highlight "code" "go" }}                      → syntax highlighted HTML
{{ transform.Unmarshal $jsonString }}             → Go data structure
{{ transform.Remarshal "yaml" $tomlString }}      → format conversion
{{ urlize "My Page Title" }}                     → "my-page-title"
{{ emojify ":smile:" }}                          → 😄
{{ jsonify . }}                                  → JSON string
{{ jsonify (dict "indent" "  ") . }}             → pretty JSON
```

## Resource Functions

```go-html-template
{{ resources.Get "css/main.css" }}               → Resource object
{{ resources.GetMatch "img/hero.*" }}            → first match
{{ resources.Match "img/gallery/*" }}            → all matches
{{ resources.GetRemote "https://example.org/data.json" }}
{{ resources.Copy "new/path" $resource }}
{{ resources.FromString "custom.css" "body { color: red; }" }}

{{/* Resource methods */}}
{{ $r.RelPermalink }}
{{ $r.Permalink }}
{{ $r.MediaType }}
{{ $r.Content }}
{{ $r.Data }}
```

## Encoding Functions

```go-html-template
{{ "hello" | base64Encode }}                     → "aGVsbG8="
{{ "aGVsbG8=" | base64Decode }}                  → "hello"
{{ jsonify . }}                                  → JSON string
{{ jsonify (dict "indent" "  ") . }}             → pretty-printed JSON
```

## Crypto/Hash Functions

```go-html-template
{{ crypto.FNV32a "hello" }}
{{ md5 "hello" }}                                → MD5 hash
{{ sha1 "hello" }}                               → SHA1 hash
{{ sha256 "hello" }}                             → SHA256 hash
{{ hmac "sha256" "key" "message" }}              → HMAC
```

## OS Functions

```go-html-template
{{ os.Getenv "HOME" }}                           → environment variable
{{ os.Stat "path/to/file" }}                     → FileInfo or nil
{{ os.ReadFile "path/to/file" }}                 → file contents
{{ os.FileExists "path/to/file" }}               → bool
```

## Cast Functions

```go-html-template
{{ int "42" }}           → 42
{{ float "3.14" }}       → 3.14
{{ string 42 }}          → "42"
{{ cast.ToStringSlice .Params.tags }}
```

## Debug Functions

```go-html-template
{{ debug.Dump . }}                               → detailed dump
{{ printf "%#v" . }}                             → Go syntax representation
{{ printf "%T" . }}                              → type name
{{ warnf "Problem: %s" .Title }}                 → warning to console
{{ errorf "Fatal: %s" .Title }}                  → error (fails build)
{{ erroridf "id" "Error: %s" .Title }}           → error with ID (can suppress)
```

## fmt Functions

```go-html-template
{{ printf "Hello %s, you are %d" .Name .Age }}
{{ println "debug output" }}                     → prints to stdout
```

## Safe Functions

Mark strings as safe (bypass HTML escaping):

```go-html-template
{{ $html := "<b>bold</b>" | safeHTML }}
{{ $css := "color: red" | safeCSS }}
{{ $js := "alert('hi')" | safeJS }}
{{ $url := "javascript:void(0)" | safeURL }}
{{ $attr := `class="active"` | safeHTMLAttr }}
```

## Hugo Pipes

### Minify
```go-html-template
{{ $css := resources.Get "css/main.css" | minify }}
```

### Fingerprint (Cache Busting & SRI)
```go-html-template
{{ $css := resources.Get "css/main.css" | fingerprint }}
{{ $css := resources.Get "css/main.css" | fingerprint "sha384" }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">
```

### Concatenation
```go-html-template
{{ $css := slice (resources.Get "css/a.css") (resources.Get "css/b.css") | resources.Concat "css/bundle.css" }}
```

### From String
```go-html-template
{{ $css := resources.FromString "css/dynamic.css" (printf ":root { --primary: %s; }" .Site.Params.primaryColor) }}
```

## CSS Functions

### Sass/SCSS
```go-html-template
{{ $opts := dict "transpiler" "libsass" "targetPath" "css/style.css" }}
{{ $css := resources.Get "scss/main.scss" | css.Sass $opts }}

{{ $opts := dict "transpiler" "dartsass" "targetPath" "css/style.css" "vars" (dict "$primary" .Site.Params.color) }}
{{ $css := resources.Get "scss/main.scss" | css.Sass $opts }}
```

### PostCSS
```go-html-template
{{ $css := resources.Get "css/main.css" | css.PostCSS }}
```
Requires `postcss-cli` and a `postcss.config.js`.

### TailwindCSS
```go-html-template
{{ $css := resources.Get "css/main.css" | css.TailwindCSS }}
```

## JS Functions

### js.Build (ESBuild)
```go-html-template
{{ $opts := dict
  "targetPath" "js/bundle.js"
  "minify" true
  "target" "es2020"
  "externals" (slice "react" "react-dom")
  "defines" (dict "process.env.NODE_ENV" `"production"`)
  "format" "esm"
  "sourceMap" "inline"
}}
{{ $js := resources.Get "js/main.js" | js.Build $opts }}
```

Options: `targetPath`, `minify`, `target` (es2015-es2022), `externals`, `defines`, `format` (iife/cjs/esm), `sourceMap`, `inject`, `shims`, `params` (accessible via `import { params } from '@params'`).

## Image Functions

```go-html-template
{{ $img := resources.Get "img/photo.jpg" }}

{{ $img.Width }}
{{ $img.Height }}

{{/* Operations */}}
{{ $resized := $img.Resize "800x600" }}
{{ $fit := $img.Fit "800x600" }}
{{ $fill := $img.Fill "400x400 Center" }}
{{ $cropped := $img.Crop "400x400 TopLeft" }}

{{/* Filters */}}
{{ $gray := $img | images.Filter images.Grayscale }}
{{ $blurred := $img | images.Filter (images.GaussianBlur 6) }}
{{ $bright := $img | images.Filter (images.Brightness 20) }}
{{ $contrast := $img | images.Filter (images.Contrast 20) }}
{{ $overlaid := $img | images.Filter (images.Overlay $logo 50 50) }}
{{ $text := $img | images.Filter (images.Text "Hello" (dict "size" 48 "color" "#fff")) }}
```
