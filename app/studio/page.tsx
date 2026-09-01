"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { fileToDataUrl, getStudioProjects, notifyPortfolioUpdated, optimizeImage, saveStudioProjects } from "../project-store";

type ProjectText = {
  title: string;
  type: string;
  period: string;
  alt: string;
  intro: string;
  detail: string;
};

type StudioProject = ProjectText & {
  id: string;
  index: string;
  category: "VR" | "AR" | "XR" | "Prototype" | "Interactive" | "3D";
  image: string;
  tools: string[];
  accent: string;
  zh: ProjectText;
  gallery?: string[];
  videos?: { name?: string; src: string }[];
  order?: number;
};

type ProjectForm = {
  title: string;
  zhTitle: string;
  category: StudioProject["category"];
  type: string;
  zhType: string;
  period: string;
  zhPeriod: string;
  intro: string;
  zhIntro: string;
  detail: string;
  zhDetail: string;
  tools: string;
  image: string;
  videoLinks: string;
};

const emptyForm: ProjectForm = {
  title: "",
  zhTitle: "",
  category: "VR",
  type: "",
  zhType: "",
  period: "",
  zhPeriod: "",
  intro: "",
  zhIntro: "",
  detail: "",
  zhDetail: "",
  tools: "",
  image: "",
  videoLinks: "",
};

const preferredCustomProjectOrder = ["VR Property Viewing", "After Hours: The Diner"];

function normalizeStudioProjects(projects: StudioProject[]) {
  return projects
    .map((project) =>
      project.title === "VR Property Viewing" ? { ...project, category: "VR" as const } : project,
    )
    .sort((first, second) => {
      const firstPosition = preferredCustomProjectOrder.indexOf(first.title);
      const secondPosition = preferredCustomProjectOrder.indexOf(second.title);
      const firstRank = firstPosition === -1 ? Number.MAX_SAFE_INTEGER : firstPosition;
      const secondRank = secondPosition === -1 ? Number.MAX_SAFE_INTEGER : secondPosition;
      return firstRank - secondRank;
    });
}

export default function StudioPage() {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [gallery, setGallery] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<{ name?: string; src: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("现在只需填写作品名称就能保存。照片会自动压缩，视频储存在本机媒体资料库。 / Only the title is required.");

  useEffect(() => {
    void getStudioProjects<StudioProject>()
      .then(async (savedProjects) => {
        const normalizedProjects = normalizeStudioProjects(savedProjects);
        setProjects(normalizedProjects);
        await saveStudioProjects(normalizedProjects);
      })
      .catch(() => setMessage("无法打开本机媒体资料库，请确认浏览器允许网站储存资料。 / Local media storage is unavailable."));
    document.title = "作品内容工作室 — 林绍鋆 Brian Lim";
  }, []);

  const persist = async (next: StudioProject[], status: string) => {
    try {
      await saveStudioProjects(next);
      setProjects(next);
      notifyPortfolioUpdated();
      setMessage(status);
      return true;
    } catch {
      setMessage("储存失败。请减少大型视频，或确认浏览器允许本机储存。 / Save failed; remove large videos or allow browser storage.");
      return false;
    }
  };

  const updateField = (field: keyof ProjectForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setGallery([]);
    setUploadedVideos([]);
    setEditingId(null);
  };

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      updateField("image", await optimizeImage(file));
      setMessage("封面已自动压缩并加入。 / Cover optimized and added.");
    } catch {
      setMessage("无法读取这张图片，请换 JPG、PNG 或 WebP。 / This image could not be read.");
    }
    event.target.value = "";
  };

  const handleGallery = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    try {
      const optimized = await Promise.all(files.slice(0, 12).map((file) => optimizeImage(file)));
      setGallery((current) => [...current, ...optimized].slice(0, 16));
      setMessage(`已加入 ${optimized.length} 张照片。 / Added ${optimized.length} photos.`);
    } catch {
      setMessage("部分照片无法读取，请使用 JPG、PNG 或 WebP。 / Some photos could not be read.");
    }
    event.target.value = "";
  };

  const handleVideos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    if (files.some((file) => file.size > 40_000_000)) {
      setMessage("单个视频请保持在 40 MB 以下；更大的视频建议使用 YouTube 或 Vimeo 链接。 / Keep each video below 40 MB.");
      event.target.value = "";
      return;
    }
    try {
      const converted = await Promise.all(files.slice(0, 4).map(async (file) => ({ name: file.name, src: await fileToDataUrl(file) })));
      setUploadedVideos((current) => [...current, ...converted].slice(0, 6));
      setMessage(`已加入 ${converted.length} 个视频。 / Added ${converted.length} videos.`);
    } catch {
      setMessage("视频无法读取。建议使用 MP4、WebM 或外部视频链接。 / Video could not be read.");
    }
    event.target.value = "";
  };

  const saveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = editingId ?? `custom-${Date.now()}`;
    const englishTitle = form.title.trim();
    const englishType = form.type.trim() || "Personal Project";
    const englishPeriod = form.period.trim() || String(new Date().getFullYear());
    const englishIntro = form.intro.trim() || "A new creative project by Brian Lim.";
    const englishDetail = form.detail.trim() || englishIntro;
    const linkedVideos = form.videoLinks.split("\n").map((item) => item.trim()).filter(Boolean).map((src) => ({ src }));
    const project: StudioProject = {
      id,
      index: "00",
      title: englishTitle,
      type: englishType,
      period: englishPeriod,
      alt: `${englishTitle} project cover`,
      intro: englishIntro,
      detail: englishDetail,
      category: form.category,
      image: form.image,
      tools: form.tools.split(",").map((tool) => tool.trim()).filter(Boolean),
      accent:
        form.category === "VR"
          ? "aqua"
          : form.category === "AR"
            ? "acid"
            : form.category === "XR" || form.category === "3D"
              ? "violet"
              : "acid",
      gallery,
      videos: [...linkedVideos, ...uploadedVideos],
      zh: {
        title: form.zhTitle.trim() || englishTitle,
        type: form.zhType.trim() || englishType,
        period: form.zhPeriod.trim() || englishPeriod,
        alt: `${form.zhTitle.trim() || englishTitle}项目封面`,
        intro: form.zhIntro.trim() || englishIntro,
        detail: form.zhDetail.trim() || englishDetail,
      },
    };

    const next = editingId
      ? projects.map((item) => item.id === editingId ? project : item)
      : [...projects, project];
    if (await persist(next, editingId ? "作品已更新。 / Project updated." : "作品已加入，并会出现在主页。 / Project added to the portfolio.")) resetForm();
  };

  const editProject = (project: StudioProject) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      zhTitle: project.zh?.title ?? "",
      category: project.category,
      type: project.type,
      zhType: project.zh?.type ?? "",
      period: project.period,
      zhPeriod: project.zh?.period ?? "",
      intro: project.intro,
      zhIntro: project.zh?.intro ?? "",
      detail: project.detail,
      zhDetail: project.zh?.detail ?? "",
      tools: project.tools.join(", "),
      image: project.image,
      videoLinks: (project.videos ?? []).filter((video) => !video.src.startsWith("data:")).map((video) => video.src).join("\n"),
    });
    setGallery(project.gallery ?? []);
    setUploadedVideos((project.videos ?? []).filter((video) => video.src.startsWith("data:")));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = (project: StudioProject) => {
    if (!window.confirm(`删除「${project.zh?.title || project.title}」？ / Delete this project?`)) return;
    void persist(projects.filter((item) => item.id !== project.id), "作品已删除。 / Project deleted.");
    if (editingId === project.id) resetForm();
  };

  const exportProjects = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio-custom-projects.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("JSON 备份已导出。 / JSON backup exported.");
  };

  const importProjects = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      if (!Array.isArray(imported) || imported.some((item) => !item.id || !item.title || !item.image)) throw new Error("Invalid data");
      const normalizedProjects = normalizeStudioProjects(imported as StudioProject[]);
      await persist(normalizedProjects, `已导入 ${imported.length} 个作品。 / Imported ${imported.length} projects.`);
    } catch {
      setMessage("无法读取这个 JSON 文件。 / This JSON file could not be read.");
    }
    event.target.value = "";
  };

  return (
    <main className="studioPage">
      <header className="studioTopbar">
        <Link className="brand" href="/"><span>BL</span><i />XR</Link>
        <div className="studioTopActions">
          <span>LOCAL CONTENT STUDIO</span>
          <Link href="/">查看作品集 / View portfolio ↗</Link>
        </div>
      </header>

      <div className="studioShell">
        <section className="studioIntro">
          <p className="sectionLabel">CONTENT SYSTEM / 本机内容系统</p>
          <h1>作品内容<br /><em>工作室。</em></h1>
          <p>新增双语作品、上传封面、多张照片与视频，并管理你自己加入的项目。保存后回到主页即可预览。</p>
          <div className="studioNotice"><i />{message}</div>
        </section>

        <div className="studioLayout">
          <form className="studioForm" onSubmit={saveProject}>
            <div className="studioFormHead">
              <div><span>{editingId ? "EDIT" : "NEW"}</span><h2>{editingId ? "编辑作品 / Edit project" : "新增作品 / Add project"}</h2></div>
              {editingId && <button type="button" className="studioGhost" onClick={resetForm}>取消 / Cancel</button>}
            </div>

            <div className="studioFields twoCols">
              <label><span>English title *</span><input required value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Project title" /></label>
              <label><span>中文标题</span><input value={form.zhTitle} onChange={(event) => updateField("zhTitle", event.target.value)} placeholder="项目名称" /></label>
              <label><span>Category / 类别 *</span><select value={form.category} onChange={(event) => updateField("category", event.target.value)}><option>VR</option><option>AR</option><option>XR</option><option>Prototype</option><option>Interactive</option><option>3D</option></select></label>
              <label><span>Tools / 工具</span><input value={form.tools} onChange={(event) => updateField("tools", event.target.value)} placeholder="Unity, Blender, C#" /></label>
              <label><span>English project type</span><input value={form.type} onChange={(event) => updateField("type", event.target.value)} placeholder="Immersive simulation" /></label>
              <label><span>中文项目类型</span><input value={form.zhType} onChange={(event) => updateField("zhType", event.target.value)} placeholder="沉浸式模拟" /></label>
              <label><span>English period</span><input value={form.period} onChange={(event) => updateField("period", event.target.value)} placeholder="2026 / Year 3" /></label>
              <label><span>中文时间</span><input value={form.zhPeriod} onChange={(event) => updateField("zhPeriod", event.target.value)} placeholder="2026 年 / 大学三年级" /></label>
              <label><span>English short intro</span><textarea rows={3} value={form.intro} onChange={(event) => updateField("intro", event.target.value)} placeholder="One-sentence project summary" /></label>
              <label><span>中文简短介绍</span><textarea rows={3} value={form.zhIntro} onChange={(event) => updateField("zhIntro", event.target.value)} placeholder="一句话项目简介" /></label>
              <label><span>English details</span><textarea rows={6} value={form.detail} onChange={(event) => updateField("detail", event.target.value)} placeholder="Challenge, approach and result" /></label>
              <label><span>中文详细说明</span><textarea rows={6} value={form.zhDetail} onChange={(event) => updateField("zhDetail", event.target.value)} placeholder="挑战、做法与成果" /></label>
            </div>

            <div className="studioMediaField">
              <div>
                <label><span>Image path / 图片路径</span><input value={form.image.startsWith("data:") ? "" : form.image} onChange={(event) => updateField("image", event.target.value)} placeholder="/projects/my-project.jpg or https://..." /></label>
                <label className="studioUpload"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} /><span>上传封面 / Upload cover</span><small>JPG, PNG or WebP · 自动压缩 / auto optimized</small></label>
              </div>
              <div className="studioImagePreview">{form.image ? <img src={form.image} alt="Project cover preview" /> : <span>EMPTY MEDIA SLOT<br />等待封面图片</span>}</div>
            </div>

            <div className="studioMediaGroups">
              <section className="studioMediaGroup">
                <div className="studioMediaTitle"><div><span>PHOTO GALLERY</span><h3>项目照片 / Project photos</h3></div><strong>{gallery.length}/16</strong></div>
                <label className="studioUpload"><input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={handleGallery} /><span>选择多张照片 / Add photos</span><small>每次最多 12 张，自动压缩 / up to 12 at a time</small></label>
                {gallery.length > 0 && <div className="studioPhotoGrid">{gallery.map((photo, index) => <div key={`${photo.slice(0, 24)}-${index}`}><img src={photo} alt={`Gallery preview ${index + 1}`} /><button type="button" onClick={() => setGallery((items) => items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove photo ${index + 1}`}>×</button></div>)}</div>}
              </section>

              <section className="studioMediaGroup">
                <div className="studioMediaTitle"><div><span>VIDEO LIBRARY</span><h3>项目视频 / Project videos</h3></div><strong>{uploadedVideos.length + form.videoLinks.split("\n").filter(Boolean).length}/10</strong></div>
                <label><span>YouTube, Vimeo or MP4 links / 视频链接</span><textarea rows={4} value={form.videoLinks} onChange={(event) => updateField("videoLinks", event.target.value)} placeholder="One link per line / 每行一个链接" /></label>
                <label className="studioUpload"><input type="file" multiple accept="video/mp4,video/webm,video/quicktime" onChange={handleVideos} /><span>上传本机视频 / Upload video files</span><small>每个最多 40 MB；大型视频建议使用链接</small></label>
                {uploadedVideos.length > 0 && <div className="studioVideoList">{uploadedVideos.map((video, index) => <div key={`${video.name}-${index}`}><span>▶</span><p>{video.name || `Video ${index + 1}`}</p><button type="button" onClick={() => setUploadedVideos((items) => items.filter((_, itemIndex) => itemIndex !== index))}>删除</button></div>)}</div>}
              </section>
            </div>

            <button className="studioSave" type="submit">{editingId ? "更新作品 / Update project" : "加入作品集 / Add to portfolio"}<b>↗</b></button>
          </form>

          <aside className="studioLibrary">
            <div className="studioLibraryHead"><div><span>LIBRARY</span><h2>自定义作品 / Custom work</h2></div><strong>{String(projects.length).padStart(2, "0")}</strong></div>
            <div className="studioDataActions">
              <button type="button" onClick={exportProjects} disabled={!projects.length}>导出 JSON / Export</button>
              <label><input type="file" accept="application/json" onChange={importProjects} />导入 JSON / Import</label>
            </div>
            <p className="studioHelper">这里管理你通过工作室新增的作品。原本的六个项目仍可直接在代码中修改。</p>
            <div className="studioProjectList">
              {projects.length === 0 ? <div className="studioEmpty">尚未加入新作品<br /><span>No custom projects yet</span></div> : projects.map((project, index) => (
                <article key={project.id}>
                  {project.image ? <img src={project.image} alt={project.alt} /> : <div className="studioCardBlank">NO COVER</div>}
                  <div><small>{String(index + 7).padStart(2, "0")} / {project.category}</small><h3>{project.zh?.title || project.title}</h3><p>{project.title} · {project.gallery?.length ?? 0} photos · {project.videos?.length ?? 0} videos</p></div>
                  <div className="studioItemActions"><button type="button" onClick={() => editProject(project)}>编辑</button><button type="button" onClick={() => deleteProject(project)}>删除</button></div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
