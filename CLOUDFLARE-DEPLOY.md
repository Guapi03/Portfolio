# Deploying this portfolio to Cloudflare Workers

This project is configured for Cloudflare Workers. The portfolio source, project images, bilingual copy, and Studio are all included in the deployment.

## First deployment

Open this project folder in VS Code, then open **Terminal → New Terminal** and run:

```bash
npm install
npx wrangler login
npm run deploy:cloudflare
```

`wrangler login` opens a Cloudflare authorization page in your browser. After the final command finishes, the terminal prints the public `workers.dev` address.

## Updating the live website

After changing normal source files, run:

```bash
npm run deploy:cloudflare
```

The same Worker is updated at the same address.

## Publishing projects created in Studio

The `/studio` page saves drafts inside the current browser. Public visitors cannot see a new Studio draft until it is added to the source and redeployed.

1. In Studio, choose **Export JSON**.
2. Import that file into the source:

   ```bash
   node scripts/import-published-projects.mjs "/full/path/to/portfolio-custom-projects.json"
   ```

3. Check the site locally with `npm run dev`.
4. Publish the update with `npm run deploy:cloudflare`.

## Local preview

```bash
npm run dev
```

Open the local address shown in the terminal. Stop the preview with `Control + C`.

## Notes

- Do not place account passwords or API keys in this repository.
- YouTube and Vimeo links are embedded from their original services; local uploaded photos are deployed as static assets.
- `npm run deploy:cloudflare:check` performs a build and Cloudflare packaging check without publishing.
