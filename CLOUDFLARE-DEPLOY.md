# Deploying this portfolio to Cloudflare Workers

This repository contains the complete bilingual portfolio and all published project media.

## Connect through GitHub

1. Add this folder as a repository in GitHub Desktop.
2. Commit all files and choose **Publish repository**.
3. In Cloudflare, open **Workers & Pages** and choose **Create application**.
4. Import the GitHub repository.
5. Use `npm run deploy:cloudflare` as the deployment command when Cloudflare asks for it.

The project already contains the Worker name, compatibility date and required build configuration.

## Deploy from the terminal

```bash
npm install
npx wrangler login
npm run deploy:cloudflare
```

After deployment, the terminal prints the public `workers.dev` address.

## Update the website

After editing files, commit and push through GitHub Desktop. If the Cloudflare repository connection is active, the new commit triggers a new deployment automatically.

To deploy manually instead:

```bash
npm run deploy:cloudflare
```

## Import a newer project JSON file

```bash
node scripts/import-published-projects.mjs "/full/path/to/portfolio-custom-projects.json"
```

Check the result with `npm run dev`, then commit and push the updated files.

## Notes

- Do not put passwords or private API keys in this repository.
- YouTube and Vimeo videos stay hosted by their original services.
- Project photos stored under `public/projects/` are included in the deployment.
- `npm run deploy:cloudflare:check` performs a full build and packaging check without publishing.
