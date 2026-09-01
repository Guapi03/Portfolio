# Brian Lim Portfolio — 修改说明

这份压缩包包含网站的完整可编辑源代码。

## 本地打开

1. 安装 Node.js 22 或更新版本。
2. 在这个文件夹打开 Terminal。
3. 运行 `npm install`。
4. 运行 `npm run dev`。
5. 浏览器打开 Terminal 显示的 Local 地址，通常是 `http://localhost:3000`；如果 3000 被占用，可能会显示 `http://localhost:3001`。

## 使用作品内容工作室

网站启动后在 Local 地址后加 `/studio`，例如 `http://localhost:3000/studio`，或从主页导航进入「作品后台 / Studio」。

工作室可以：

- 填写中英文项目资料
- 选择 VR、AR、XR、Prototype、Interactive 或 3D 类别（XR 适合同时结合多种扩展现实技术的作品）
- 首页目前优先显示：VR Property Viewing、VR Survival、After Hours: The Diner、AnatoAR（也兼容 Anatomy AR / Anator AR 的拼写）、Narrative System (AI)，其他作品随后显示
- 只需填写英文作品名称即可先保存，其他栏位可之后补上
- 上传 JPG、PNG 或 WebP 封面，系统会自动缩小并压缩
- 为一个作品加入最多 16 张相册照片
- 上传 MP4、WebM、MOV 视频，每个本机视频建议不超过 40 MB
- 加入 YouTube、Vimeo 或直接 MP4 链接，每行一个链接
- 编辑或删除自己新增的项目
- 导入、导出 `portfolio-custom-projects.json` 备份

工作室目前是本机版本，内容储存在当前浏览器的 IndexedDB 媒体资料库。新增项目会在同一浏览器的主页显示，但换电脑或清除浏览器资料后不会自动保留，所以完成编辑后请导出 JSON。导出的 JSON 会包含本机上传的图片和视频，文件可能较大。要让新作品出现在公开网站，请依照 `CLOUDFLARE-DEPLOY.md` 的「Publishing projects created in Studio」步骤导入 JSON 并重新部署。

## 最常修改的位置

- 个人简介、项目名称、项目说明、技能和联系方式：`app/page.tsx`
- 所有颜色、排版、动画与手机版样式：`app/globals.css`
- 网页标题、搜索描述和分享预览资料：`app/layout.tsx`
- 个人照片：`public/profile.jpg`
- 已发布的 Studio 项目资料：`app/published-projects.ts`
- 项目图片：`public/projects/`（Studio 导入图片会放在 `public/projects/published/`）
- 社交分享封面：`public/og.png`

首页主视觉图片目前保留为空白媒体位；相关位置是 `app/page.tsx` 中的 `heroBlank`。

## 新增或修改项目

原本的固定项目可以在 `app/page.tsx` 顶部的 `projects` 清单修改。每个项目包括标题、类别、年份、图片、简介、详细说明和工具标签。把新图片放进 `public/projects/`，再把 `image` 改成对应的 `/projects/文件名`。

从 Studio 导出的项目建议使用导入工具处理：

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

## 重新输出

修改完成后运行 `npm run build`。这个项目已经配置为 Cloudflare Workers 网站；首次发布及后续更新步骤请看 `CLOUDFLARE-DEPLOY.md`。
