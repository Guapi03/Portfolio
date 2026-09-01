# Brian Lim Portfolio — 修改说明

这个文件夹包含网站的完整可编辑源代码。

## 本地打开

1. 安装 Node.js 22.13 或更新版本。
2. 在这个文件夹打开 Terminal。
3. 运行 `npm install`。
4. 运行 `npm run dev`。
5. 浏览器打开 Terminal 显示的 Local 地址，通常是 `http://localhost:3000`；如果 3000 被占用，可能会显示 `http://localhost:3001`。

## 最常修改的位置

- 个人简介、固定项目、技能和联系方式：`app/page.tsx`
- 已发布的项目资料：`app/published-projects.ts`
- 所有颜色、排版、动画与手机版样式：`app/globals.css`
- 网页标题、搜索描述和分享预览资料：`app/layout.tsx`
- 个人照片：`public/profile.jpg`
- 项目图片：`public/projects/`
- 社交分享封面：`public/og.png`

首页右侧主视觉使用 VR Property Viewing 封面：`public/projects/published/vr-property-viewing/cover.webp`。

## 新增或修改项目

固定项目可以在 `app/page.tsx` 顶部的 `projects` 清单修改。每个项目包括标题、类别、年份、图片、简介、详细说明和工具标签。把新图片放进 `public/projects/`，再把 `image` 改成对应的 `/projects/文件名`。

如果收到更新后的 `portfolio-custom-projects.json`，可以运行：

```bash
node scripts/import-published-projects.mjs "/完整路径/portfolio-custom-projects.json"
```

网站会自动显示实际存在的 `VR`、`AR`、`XR`、`Prototype`、`Interactive` 和 `3D` 筛选类别。

## 更换主色

在 `app/globals.css` 顶部修改这些颜色：

- `--acid`：主要荧光绿色
- `--aqua`：青色
- `--violet`：紫色
- `--ink`：主要文字颜色
- `--muted`：次要文字颜色

## 检查与部署

修改完成后运行：

```bash
npm test
npm run lint
npm run deploy:cloudflare:check
```

首次发布及后续更新步骤请看 `CLOUDFLARE-DEPLOY.md`。
