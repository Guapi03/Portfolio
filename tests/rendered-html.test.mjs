import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio with the published project order", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /林绍鋆 Brian Lim — AR\/VR Creative Developer/);
  assert.match(html, /All<sup>11<\/sup>/);
  assert.match(html, /VR Property Viewing project cover/);
  assert.match(html, /After Hours: The Diner project cover/);
  assert.match(html, /AnatoAR project cover/);

  const orderedTitles = [
    "VR Property Viewing",
    "VR Survival",
    "After Hours: The Diner",
    "AnatoAR",
    "Narrative System (AI)",
  ];
  const titlePositions = orderedTitles.map((title) => html.indexOf(`<h3>${title}</h3>`));
  assert.ok(titlePositions.every((position) => position >= 0));
  assert.deepEqual([...titlePositions].sort((a, b) => a - b), titlePositions);
});

test("keeps bilingual published content and project media in the source", async () => {
  const publishedSource = await readFile(new URL("../app/published-projects.ts", import.meta.url), "utf8");
  assert.match(publishedSource, /VR 房产展示系统/);
  assert.match(publishedSource, /下班后：午夜餐厅/);
  assert.match(publishedSource, /AnatoAR 增强现实人体解剖学习/);
  assert.match(publishedSource, /https:\/\/youtu\.be\/d0i4JFGi0eA/);
  assert.match(publishedSource, /https:\/\/youtube\.com\/shorts\/1MdkWUGiNzo/);

  await Promise.all([
    access(new URL("../public/projects/published/vr-property-viewing/cover.webp", import.meta.url)),
    access(new URL("../public/projects/published/after-hours-the-diner/gallery-11.webp", import.meta.url)),
    access(new URL("../public/projects/published/anatoar/gallery-04.webp", import.meta.url)),
  ]);
});

test("server-renders the local project Studio", async () => {
  const response = await render("/studio");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /LOCAL CONTENT STUDIO/);
  assert.match(html, /导出 JSON \/ Export/);
  assert.match(html, /导入 JSON \/ Import/);
  assert.match(html, /VR<\/option>/);
  assert.match(html, /AR<\/option>/);
});
