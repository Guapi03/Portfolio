# Brian Lim AR/VR Portfolio

A bilingual English and Chinese portfolio for 林绍鋆 (Brian Lim), focused on VR, AR and interactive media work.

## Live website

### [Visit Brian Lim’s AR/VR Portfolio →](https://portfolio.guapi03.workers.dev/)

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the Local address shown in the terminal. Stop the development server with `Control + C`.

## Project content

- Main page and bilingual interface copy: [`app/page.tsx`](./app/page.tsx)
- Published project data: [`app/published-projects.ts`](./app/published-projects.ts)
- Project types: [`app/project-types.ts`](./app/project-types.ts)
- Site styling and responsive layout: [`app/globals.css`](./app/globals.css)
- Project media: [`public/projects/`](./public/projects/)

To import a newer portfolio JSON file into the source:

```bash
node scripts/import-published-projects.mjs "/full/path/to/portfolio-custom-projects.json"
```

## Verification

```bash
npm test
npm run lint
npm run deploy:cloudflare:check
```

The last command checks the Cloudflare package without publishing it.

## Deployment

Live site: [https://portfolio.guapi03.workers.dev/](https://portfolio.guapi03.workers.dev/)

See [`CLOUDFLARE-DEPLOY.md`](./CLOUDFLARE-DEPLOY.md) for GitHub and Cloudflare Workers setup.
