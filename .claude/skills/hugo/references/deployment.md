# Hugo Deployment Reference

## GitHub Pages (This Project)

This project uses GitHub Pages with the `docs/` directory approach:

1. Config: `publishDir: "docs"` in `config.yml`
2. Build: `make build` (runs `hugo`)
3. Commit the `docs/` directory and push
4. GitHub repo settings: Pages > Source > Deploy from branch > `master` > `/docs`

### GitHub Actions Alternative

```yaml
# .github/workflows/hugo.yml
name: Deploy Hugo
on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
          fetch-depth: 0
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
          extended: true
      - name: Build
        run: hugo --minify
      - name: Upload
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

## Netlify

`netlify.toml`:
```toml
[build]
  publish = "public"
  command = "hugo --gc --minify"

[build.environment]
  HUGO_VERSION = "0.140.0"

[context.production.environment]
  HUGO_ENV = "production"

[context.deploy-preview]
  command = "hugo --gc --minify --buildFuture -b $DEPLOY_PRIME_URL"

[[redirects]]
  from = "/old/*"
  to = "/new/:splat"
  status = 301
```

## Vercel

`vercel.json`:
```json
{
  "build": {
    "env": {
      "HUGO_VERSION": "0.140.0"
    }
  }
}
```

Or use the Hugo framework preset in the Vercel dashboard.

## Cloudflare Pages

- Build command: `hugo --minify`
- Build output directory: `public`
- Set environment variable: `HUGO_VERSION = 0.140.0`

## Firebase

```bash
firebase init
# Select Hosting, set public dir to "public"
hugo --minify
firebase deploy
```

`firebase.json`:
```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
      }
    ]
  }
}
```

## AWS Amplify

`amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - hugo --minify
  artifacts:
    baseDirectory: public
    files:
      - '**/*'
  cache:
    paths: []
```

## Hugo Deploy (Built-in)

Hugo has native deploy support for S3, GCS, and Azure Blob Storage:

```yaml
# config.yml
deployment:
  targets:
    - name: "production"
      URL: "s3://my-bucket?region=us-east-1"
      # Or: "gs://my-bucket"
      # Or: "azblob://my-container"
      cloudFrontDistributionID: "XXXXXXXXXX"
  matchers:
    - pattern: "^.+\\.(js|css|svg|ttf)$"
      cacheControl: "max-age=31536000, no-transform, public"
      gzip: true
    - pattern: "^.+\\.(png|jpg)$"
      cacheControl: "max-age=31536000, no-transform, public"
      gzip: false
    - pattern: "^.+\\.(html|xml|json)$"
      gzip: true
```

```bash
hugo deploy
hugo deploy --target production
hugo deploy --dryRun  # preview changes
```

## rsync

```bash
hugo --minify
rsync -avz --delete public/ user@server:/var/www/site/
```

## Docker

```dockerfile
FROM klakegg/hugo:ext-alpine AS builder
WORKDIR /src
COPY . .
RUN hugo --minify

FROM nginx:alpine
COPY --from=builder /src/public /usr/share/nginx/html
```
