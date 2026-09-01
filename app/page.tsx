"use client";

import { useEffect, useState } from "react";
import { getStudioProjects } from "./project-store";
import type { Project, ProjectText } from "./project-types";
import { publishedProjects } from "./published-projects";

const projects: Project[] = [
  {
    id: "vr-survival",
    index: "01",
    title: "VR Survival",
    category: "VR",
    type: "Immersive VR Simulation",
    period: "Degree Year 2 · Sem 2",
    image: "/projects/vr-survival.jpg",
    alt: "A forest environment from Brian Lim's VR Survival project",
    intro: "Learn wilderness skills through gesture-led, six-degrees-of-freedom interaction.",
    detail:
      "A first-person VR experience that turns survival learning into embodied practice. Players craft tools, start fires, chop trees, gather food and manage resources inside a changing wilderness.",
    tools: ["Unity", "Meta Quest", "XR Interaction Toolkit", "Spatial UI"],
    accent: "acid",
  },
  {
    id: "worldlink-ar",
    index: "02",
    title: "WorldLinkAR",
    category: "Prototype",
    type: "AR Product & UI/UX Concept",
    period: "Degree Year 2 · Sem 1",
    image: "/projects/worldlinkar.png",
    alt: "WorldLinkAR mobile augmented reality interface",
    intro: "A social city-exploration concept blending AR wayfinding, avatars and live interaction.",
    detail:
      "Created with my project team, WorldLinkAR explores how spatial overlays and social presence can make city discovery feel more personal, playful and connected.",
    tools: ["AR Concept", "UI/UX", "Prototype", "After Effects"],
    accent: "aqua",
  },
  {
    id: "narrative-system",
    index: "03",
    title: "Narrative System (AI)",
    category: "Interactive",
    type: "AI NPC Experience",
    period: "September 2025",
    image: "/projects/narrative-ai.png",
    alt: "AI narrative system inside a virtual art gallery",
    intro: "Conversational AI NPCs that guide an art-gallery narrative without breaking presence.",
    detail:
      "An experimental Unity narrative system pairing Convai-powered NPC conversations with a structured story flow for an interactive art gallery.",
    tools: ["Unity", "Convai", "AI NPC", "Narrative Design"],
    accent: "violet",
  },
  {
    id: "attack-titans-comic",
    index: "04",
    title: "Attack of the Titans – Interactive E-Comic",
    category: "Interactive",
    type: "Interactive Digital Comic",
    period: "Degree Year 2 · Sem 1",
    image: "/projects/attack-titans-cover.jpg",
    alt: "Main menu of Brian Lim's Attack of the Titans interactive e-comic",
    intro: "A fan-made digital comic combining animated storytelling, clickable exploration and mini-game moments.",
    detail:
      "Built in Adobe Animate, this multimedia e-comic turns reading into an interactive journey. Readers can explore story pages, trigger visual effects, discover alternate dialogue and open character profiles with animated information about each role and ability.",
    tools: ["Adobe Animate", "Interactive Storytelling", "Animation", "Mini-game Design"],
    accent: "acid",
    gallery: ["/projects/attack-titans-comic.jpg", "/projects/attack-titans-game.jpg"],
  },
  {
    id: "jungle-quest",
    index: "05",
    title: "Jungle Quest",
    category: "Interactive",
    type: "Unity Mini Game",
    period: "September 2025",
    image: "/projects/jungle-quest-cover.jpg",
    alt: "Jungle Quest mini-game start screen",
    intro: "A compact jungle adventure built around responsive movement, enemy AI and readable game-state feedback.",
    detail:
      "A Unity mini game exploring dynamic player movement, enemy behaviours and a clear UI manager for score, health, time and game status. The project brings these systems together in a playable jungle-themed experience.",
    tools: ["Unity", "C#", "Enemy AI", "UI Manager"],
    accent: "aqua",
    gallery: ["/projects/jungle-quest-scene.jpg"],
    externalLink: {
      label: "Play Jungle Quest",
      zhLabel: "试玩 Jungle Quest",
      href: "https://junglequest.netlify.app",
    },
  },
  {
    id: "model-gallery",
    index: "06",
    title: "3D Model Gallery",
    category: "Interactive",
    type: "Unity Interaction Prototype",
    period: "August 2025",
    image: "/projects/3d-gallery.png",
    alt: "Interactive 3D model gallery interface built in Unity",
    intro: "A Unity interaction prototype for inspecting, moving, rotating and rescaling ten supplied 3D assets.",
    detail:
      "This project focuses on the Unity interaction system rather than creating the 3D assets themselves. Users can switch between ten supplied models and manipulate each one through a focused interface.",
    tools: ["Unity", "C#", "Object Manipulation", "Interface Design"],
    accent: "aqua",
  },
  {
    id: "sign-speak",
    index: "05",
    title: "Sign Speak",
    category: "Interactive",
    type: "Accessible Learning Platform",
    period: "Degree Year 2",
    image: "/projects/sign-speak.png",
    alt: "Sign Speak web learning platform shown on a tablet",
    intro: "An accessible web platform for learning sign language through lessons, video and quizzes.",
    detail:
      "Sign Speak supports learners with structured, interactive content while giving administrators tools to manage lessons, upload resources and follow progress.",
    tools: ["Web Development", "Accessible UX", "Learning Design", "Admin Tools"],
    accent: "acid",
  },
  {
    id: "nyxara",
    index: "06",
    title: "Nyxara",
    category: "3D",
    type: "Character Modeling & Texturing",
    period: "Degree Year 2 · Sem 2",
    image: "/projects/nyxara.png",
    alt: "Nyxara fantasy sorceress 3D character artwork",
    intro: "A game-ready high-fantasy sorceress designed for a mysterious magical RPG world.",
    detail:
      "Nyxara is an original character study focused on silhouette, fantasy worldbuilding and production-ready modeling and texturing for a game environment.",
    tools: ["3D Modeling", "Texturing", "Character Design", "Game Art"],
    accent: "violet",
  },
];

const preferredProjectOrder = [
  "VR Property Viewing",
  "VR Survival",
  "After Hours: The Diner",
  "Anatomy AR",
  "AnatoAR",
  "Anator AR",
  "Narrative System (AI)",
];

function getPreferredProjectRank(title: string) {
  const normalizedTitle = normalizeProjectTitle(title);
  return preferredProjectOrder.findIndex((projectTitle) => normalizeProjectTitle(projectTitle) === normalizedTitle);
}

function normalizeProjectTitle(value: string) {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
}

const projectZh: Record<string, ProjectText> = {
  "vr-survival": {
    title: "VR 生存模拟",
    type: "沉浸式 VR 模拟",
    period: "大学二年级 · 第二学期",
    alt: "林绍鋆的 VR 生存模拟森林环境",
    intro: "透过手势互动和六自由度体验，学习基本的野外生存技能。",
    detail: "这是一款第一人称 VR 体验，把生存知识转化成身体实践。玩家可以制作工具、生火、砍树、采集食物，并在不断变化的荒野中管理资源。",
  },
  "worldlink-ar": {
    title: "WorldLinkAR",
    type: "AR 产品与 UI/UX 概念",
    period: "大学二年级 · 第一学期",
    alt: "WorldLinkAR 手机增强现实界面",
    intro: "融合 AR 导航、虚拟角色与实时互动的社交城市探索概念。",
    detail: "WorldLinkAR 是我与项目团队共同设计的概念，探索空间叠加信息与社交临场感如何让城市探索变得更个人化、更有趣，也更有连结感。",
  },
  "narrative-system": {
    title: "AI 叙事系统",
    type: "AI NPC 互动体验",
    period: "2025 年 9 月",
    alt: "虚拟美术馆中的 AI 叙事系统",
    intro: "让对话式 AI NPC 在不打断沉浸感的情况下，引导美术馆故事流程。",
    detail: "这是一个实验性的 Unity 叙事系统，将 Convai 驱动的 NPC 对话与结构化故事流程结合，用于互动式虚拟美术馆。",
  },
  "attack-titans-comic": {
    title: "进击的巨人——互动电子漫画",
    type: "互动数字漫画",
    period: "大学二年级 · 第一学期",
    alt: "林绍鋆制作的《进击的巨人》互动电子漫画主菜单",
    intro: "结合动画叙事、点击探索与小游戏环节的非官方互动数字漫画。",
    detail: "作品使用 Adobe Animate 制作，把阅读转化为可参与的多媒体旅程。读者可以探索故事页面、触发视觉效果、发现不同对话，并打开带有角色定位和能力动画说明的资料页面。",
  },
  "jungle-quest": {
    title: "Jungle Quest 丛林任务",
    type: "Unity 迷你游戏",
    period: "2025 年 9 月",
    alt: "Jungle Quest 迷你游戏开始画面",
    intro: "以动态移动、敌人 AI 与清晰状态反馈组成的丛林冒险小游戏。",
    detail: "这款 Unity 迷你游戏探索动态玩家移动、敌人行为，以及管理分数、生命值、时间和游戏状态的 UI 系统，并把这些功能整合成可直接试玩的丛林主题体验。",
  },
  "model-gallery": {
    title: "3D 模型展厅",
    type: "Unity 互动原型",
    period: "2025 年 8 月",
    alt: "使用 Unity 制作的互动式 3D 模型展厅",
    intro: "用于查看、移动、旋转与缩放十个现成 3D 资产的 Unity 互动原型。",
    detail: "这项作品的重点是 Unity 互动系统，而不是 3D 资产制作。用户可以在十个现成模型之间切换，并透过清晰的界面直接操作每一个模型。",
  },
  "sign-speak": {
    title: "Sign Speak 手语学习平台",
    type: "无障碍学习平台",
    period: "大学二年级",
    alt: "平板电脑上显示的 Sign Speak 手语学习平台",
    intro: "透过课程、影片与测验学习手语的无障碍网页平台。",
    detail: "Sign Speak 以结构化互动内容支持学习者，同时提供管理员管理课程、上传资源和查看学习进度的工具。",
  },
  nyxara: {
    title: "Nyxara · 尼克萨拉",
    type: "角色建模与贴图",
    period: "大学二年级 · 第二学期",
    alt: "奇幻女巫 Nyxara 的 3D 角色作品",
    intro: "为神秘魔法 RPG 世界设计的游戏级奇幻女巫角色。",
    detail: "Nyxara 是一项原创角色研究，专注于轮廓设计、奇幻世界观，以及适用于游戏环境的建模与贴图制作。",
  },
};

function getProjectText(project: Project, language: "en" | "zh") {
  return language === "zh" ? project.zh ?? projectZh[project.id] ?? project : project;
}

function getEmbedUrl(source: string) {
  try {
    const url = new URL(source);
    if (url.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

type ProjectFilter = "All" | Project["category"];

const categoryOrder: Project["category"][] = ["VR", "AR", "XR", "Prototype", "Interactive", "3D"];

const topCopy = {
  en: {
    navWork: "Selected work",
    navAbout: "About",
    studio: "Studio",
    navContact: "Let's talk",
    eyebrow: "AR/VR CREATIVE DEVELOPER · MALAYSIA",
    intro: "I'm Brian Lim (林绍鋆) — a multimedia creator shaping immersive experiences through spatial design, real-time 3D and interactive storytelling.",
    explore: "Explore my worlds",
    enter: "Enter immersive mode",
    exit: "Exit immersive mode",
    aboutLabel: "ABOUT / THE CREATOR",
    aboutLead: "I'm a curious multimedia student specialising in AR/VR, drawn to the moment when an interface stops feeling like a screen and starts feeling like a place.",
    aboutBody: "My work crosses Unity development, spatial interaction, 3D content and visual storytelling. I enjoy turning technical systems into clear, engaging experiences that invite people to explore and learn.",
    conversation: "Start a conversation",
    scroll: "SCROLL TO EXPLORE",
    signal: ["UNITY", "SPATIAL DESIGN", "XR INTERACTION", "3D WORLDBUILDING", "INTERACTIVE STORYTELLING"],
    workLabel: "FIELDWORK / 2024—2025",
    workIntro: "A collection of immersive simulations, AR concepts, interactive systems and 3D experiments.",
    all: "All",
    filterLabel: "Filter projects",
    viewCase: "VIEW CASE",
    signalWord: "SIGNAL",
    contactLabel: "AVAILABLE FOR COLLABORATIONS",
    connect: "Connect with me",
    footer: "Designed & built for an immersive web",
    backTop: "Back to top",
    askProject: "Ask me about this project",
    closeProject: "Close project details",
    capabilities: [
      ["Immersive development", "Unity, C#, 6DoF interaction, XR Interaction Toolkit and Meta Quest prototyping."],
      ["Spatial experience design", "World-space UI, embodied interaction, AR concepts and accessible user journeys."],
      ["3D & visual storytelling", "Character art, environment concepts, motion design and interactive narrative systems."],
    ],
  },
  zh: {
    navWork: "精选作品",
    navAbout: "关于我",
    studio: "作品后台",
    navContact: "联系我",
    eyebrow: "AR/VR 创意开发者 · 马来西亚",
    intro: "我是林绍鋆（Brian Lim），一名多媒体创作者，透过空间设计、实时 3D 与互动叙事打造沉浸式体验。",
    explore: "探索我的作品",
    enter: "进入沉浸模式",
    exit: "退出沉浸模式",
    aboutLabel: "关于 / 创作者",
    aboutLead: "我是一名专注于 AR/VR 的多媒体学生。我着迷于这样的瞬间：界面不再只是一块屏幕，而开始成为一个让人置身其中的空间。",
    aboutBody: "我的创作横跨 Unity 开发、空间互动、3D 内容与视觉叙事。我喜欢把技术系统转化成清晰、有吸引力，并能邀请人们探索与学习的体验。",
    conversation: "和我聊聊",
    scroll: "继续下滑探索",
    signal: ["UNITY 开发", "空间设计", "XR 互动", "3D 世界构建", "互动叙事"],
    workLabel: "创作记录 / 2024—2025",
    workIntro: "集合沉浸式模拟、AR 概念、互动系统与 3D 实验的精选作品。",
    all: "全部",
    filterLabel: "筛选作品",
    viewCase: "查看作品",
    signalWord: "讯号",
    contactLabel: "开放合作机会",
    connect: "在 LinkedIn 联系我",
    footer: "为沉浸式网络体验设计与制作",
    backTop: "回到顶部",
    askProject: "向我了解这个项目",
    closeProject: "关闭项目详情",
    capabilities: [
      ["沉浸式开发", "Unity、C#、6DoF 互动、XR Interaction Toolkit 与 Meta Quest 原型开发。"],
      ["空间体验设计", "世界空间 UI、身体互动、AR 概念与无障碍使用流程。"],
      ["3D 与视觉叙事", "角色美术、环境概念、动态设计与互动叙事系统。"],
    ],
  },
} as const;

export default function Home() {
  const [filter, setFilter] = useState<ProjectFilter>("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [immersive, setImmersive] = useState(false);
  const [language, setLanguage] = useState<"en" | "zh">("en");
  const [customProjects, setCustomProjects] = useState<Project[]>([]);
  const t = topCopy[language];

  useEffect(() => {
    if (!activeProject) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProject(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeProject]);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
    document.title = language === "zh" ? "林绍鋆 — AR/VR 创意开发者" : "Brian Lim — AR/VR Creative Developer";
  }, [language]);

  useEffect(() => {
    let mounted = true;
    const loadCustomProjects = async () => {
      try {
        const saved = await getStudioProjects<Project>();
        if (mounted) setCustomProjects(saved);
      } catch {
        if (mounted) setCustomProjects([]);
      }
    };
    void loadCustomProjects();
    const listener = () => void loadCustomProjects();
    window.addEventListener("portfolio-projects-updated", listener);
    const channel = "BroadcastChannel" in window ? new BroadcastChannel("portfolio-projects") : null;
    if (channel) channel.onmessage = listener;
    return () => {
      mounted = false;
      window.removeEventListener("portfolio-projects-updated", listener);
      channel?.close();
    };
  }, []);

  const publishedIds = new Set(publishedProjects.map((project) => project.id));
  const publishedTitles = new Set(publishedProjects.map((project) => normalizeProjectTitle(project.title)));
  const browserOnlyProjects = customProjects.filter(
    (project) => !publishedIds.has(project.id) && !publishedTitles.has(normalizeProjectTitle(project.title)),
  );
  const allProjects = [...projects, ...publishedProjects, ...browserOnlyProjects]
    .map((project) =>
      project.title === "VR Property Viewing" ? { ...project, category: "VR" as const } : project,
    )
    .sort((first, second) => {
      const firstPosition = getPreferredProjectRank(first.title);
      const secondPosition = getPreferredProjectRank(second.title);
      const firstRank = firstPosition === -1 ? Number.MAX_SAFE_INTEGER : firstPosition;
      const secondRank = secondPosition === -1 ? Number.MAX_SAFE_INTEGER : secondPosition;
      return firstRank - secondRank;
    })
    .map((project, index) => ({ ...project, index: String(index + 1).padStart(2, "0") }));
  const filters: ProjectFilter[] = [
    "All",
    ...categoryOrder.filter((category) => allProjects.some((project) => project.category === category)),
  ];
  const visibleProjects =
    filter === "All" ? allProjects : allProjects.filter((project) => project.category === filter);
  const activeText = activeProject ? getProjectText(activeProject, language) : null;

  return (
    <main
      className={immersive ? "immersive" : ""}
      onPointerMove={(event) => {
        event.currentTarget.style.setProperty("--mx", `${event.clientX}px`);
        event.currentTarget.style.setProperty("--my", `${event.clientY}px`);
      }}
    >
      <div className="cursorLight" aria-hidden="true" />
      <nav className="nav shell" aria-label={language === "en" ? "Primary navigation" : "主要导航"}>
        <a className="brand" href="#top" aria-label="林绍鋆 Brian Lim home">
          <span>BL</span><i />XR
        </a>
        <div className="navLinks">
          <a href="#work">{t.navWork}</a>
          <a href="#about">{t.navAbout}</a>
          <a href="/studio">{t.studio}</a>
          <button className="langSwitch" onClick={() => setLanguage(language === "en" ? "zh" : "en")} aria-label={language === "en" ? "切换到中文" : "Switch to English"}>
            <span className={language === "en" ? "active" : ""}>EN</span><i /><span className={language === "zh" ? "active" : ""}>中文</span>
          </button>
          <a className="navCta" href="mailto:brianlim031101@gmail.com">{t.navContact} <b>↗</b></a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="heroCopy">
          <p className="eyebrow"><span /> {t.eyebrow}</p>
          {language === "en" ? <h1>I build worlds<br />you can <em>step into.</em></h1> : <h1>我创造你能<br />走进去的<em>世界。</em></h1>}
          <p className="intro">{t.intro}</p>
          <div className="heroActions">
            <a className="primaryButton" href="#work">{t.explore} <b>↗</b></a>
            <button className="modeButton" onClick={() => setImmersive((value) => !value)} aria-pressed={immersive}>
              <span className="modeIcon">{immersive ? "◉" : "◎"}</span>
              {immersive ? t.exit : t.enter}
            </button>
          </div>
        </div>

        <div className="portal" aria-label="VR Survival project preview">
          <div className="portalGlow" />
          <div className="orbit orbitOne" />
          <div className="orbit orbitTwo" />
          <div className="projectFrame heroFrame" aria-label={language === "en" ? "Blank hero media placeholder" : "空白主视觉媒体位置"}>
            <div className="heroBlank" />
          </div>
          <span className="coordinate coordA">X 03.11</span>
          <span className="coordinate coordB">Y 02.08</span>
        </div>

        <div className="scrollCue" aria-hidden="true"><span>{t.scroll}</span><i /></div>
      </section>

      <div className="signalBar" aria-hidden="true">
        <div className="signalTrack">
          {[...t.signal, ...t.signal].map((item, index) => <span className="signalUnit" key={`${item}-${index}`}><span>{item}</span><i /></span>)}
        </div>
      </div>

      <section className="aboutSection" id="about">
        <div className="aboutGrid shell">
          <div className="profileVisual">
            <div className="profileFrame"><img src="/profile.jpg" alt="林绍鋆 Brian Lim" /></div>
            <span className="profileTag">林绍鋆 / BRIAN LIM</span>
            <div className="profileScan" aria-hidden="true" />
          </div>

          <div className="aboutCopy">
            <p className="sectionLabel">{t.aboutLabel}</p>
            {language === "en" ? <h2>Between the <em>real</em><br />and the possible.</h2> : <h2>穿梭于<em>真实</em><br />与可能之间。</h2>}
            <p className="aboutLead">{t.aboutLead}</p>
            <p>{t.aboutBody}</p>
            <a className="lineLink" href="mailto:brianlim031101@gmail.com">{t.conversation} <span>↗</span></a>
          </div>
        </div>

        <div className="capabilities shell">
          {t.capabilities.map((item, index) => <article key={item[0]}><span>0{index + 1}</span><h3>{item[0]}</h3><p>{item[1]}</p></article>)}
        </div>
      </section>

      <section className="workSection shell" id="work">
        <div className="sectionHead">
          <div>
            <p className="sectionLabel">{t.workLabel}</p>
            {language === "en" ? <h2>Selected <em>worlds</em></h2> : <h2>精选<em>沉浸世界</em></h2>}
          </div>
          <p className="sectionIntro">{t.workIntro}</p>
        </div>

        <div className="filterBar" role="group" aria-label={t.filterLabel}>
          {filters.map((item) => (
            <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
              {item === "All" ? t.all : item}<sup>{item === "All" ? allProjects.length : allProjects.filter((project) => project.category === item).length}</sup>
            </button>
          ))}
        </div>

        <div className="projectGrid">
          {visibleProjects.map((project) => {
            const projectText = getProjectText(project, language);
            return (
              <article className={`projectCard ${project.accent}`} key={project.id}>
                <button className="projectImage" onClick={() => setActiveProject(project)} aria-label={language === "en" ? `View ${projectText.title} details` : `查看${projectText.title}详情`}>
                  {project.image ? <img src={project.image} alt={projectText.alt} /> : <span className="projectBlankMedia">MEDIA<br />COMING SOON</span>}
                  <span className="imageHud"><i /> {project.category} {t.signalWord}</span>
                  <span className="openProject">{t.viewCase} <b>↗</b></span>
                </button>
                <div className="projectMeta">
                  <span>{project.index}</span>
                  <div>
                    <p>{projectText.type}</p>
                    <h3>{projectText.title}</h3>
                  </div>
                  <button onClick={() => setActiveProject(project)} aria-label={language === "en" ? `Open ${projectText.title}` : `打开${projectText.title}`}>↗</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="contactSection shell" id="contact">
        <p className="sectionLabel"><span /> {t.contactLabel}</p>
        {language === "en" ? <h2>Let&apos;s make reality<br /><em>more interesting.</em></h2> : <h2>让我们把现实<br />变得<em>更有想象力。</em></h2>}
        <div className="contactRow">
          <a href="mailto:brianlim031101@gmail.com"><small>EMAIL</small><span>brianlim031101@gmail.com</span><b>↗</b></a>
          <a href="tel:+60162026188"><small>PHONE</small><span>+60 16-202 6188</span><b>↗</b></a>
          <a href="https://www.linkedin.com/in/brian-lim-038358354" target="_blank" rel="noreferrer"><small>LINKEDIN</small><span>{t.connect}</span><b>↗</b></a>
        </div>
      </section>

      <footer className="footer shell">
        <a className="brand" href="#top"><span>BL</span><i />XR</a>
        <p>{t.footer} · © {new Date().getFullYear()} 林绍鋆 Brian Lim</p>
        <div className="footerLinks"><a href="/studio">{t.studio}</a><a href="#top">{t.backTop} ↑</a></div>
      </footer>

      {activeProject && activeText && (
        <div className="modalBackdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProject(null); }}>
          <section className="projectModal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modalClose" onClick={() => setActiveProject(null)} aria-label={t.closeProject}>×</button>
            <div className="modalImage">{activeProject.image ? <img src={activeProject.image} alt={activeText.alt} /> : <div className="modalBlank">MEDIA SLOT</div>}<span>{activeProject.index} / {activeProject.category}</span></div>
            <div className="modalContent">
              <p className="sectionLabel">{activeText.type} · {activeText.period}</p>
              <h2 id="modal-title">{activeText.title}</h2>
              <p>{activeText.detail}</p>
              <div className="toolList">{activeProject.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
              <div className="modalActions">
                {activeProject.externalLink && <a href={activeProject.externalLink.href} target="_blank" rel="noreferrer">{language === "zh" ? activeProject.externalLink.zhLabel : activeProject.externalLink.label} <b>↗</b></a>}
                <a href="mailto:brianlim031101@gmail.com?subject=Project%20enquiry">{t.askProject} <b>↗</b></a>
              </div>
            </div>
            {((activeProject.gallery?.length ?? 0) > 0 || (activeProject.videos?.length ?? 0) > 0) && (
              <div className="modalMediaSection">
                {!!activeProject.gallery?.length && <div className="modalGallery"><p className="sectionLabel">{language === "zh" ? "照片 / 视觉记录" : "PHOTOS / VISUAL NOTES"}</p><div>{activeProject.gallery.map((photo, index) => <img key={`${photo.slice(0, 30)}-${index}`} src={photo} alt={`${activeText.title} ${language === "zh" ? "照片" : "photo"} ${index + 1}`} />)}</div></div>}
                {!!activeProject.videos?.length && <div className="modalVideos"><p className="sectionLabel">{language === "zh" ? "视频 / 动态展示" : "VIDEOS / MOTION"}</p><div>{activeProject.videos.map((video, index) => {
                  const embed = getEmbedUrl(video.src);
                  if (embed) return <iframe key={`${video.src}-${index}`} src={embed} title={video.name || `${activeText.title} video ${index + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
                  // Captions must be supplied alongside a user-uploaded video before publishing.
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  return <video key={`${video.src}-${index}`} src={video.src} controls preload="metadata">Your browser does not support video.</video>;
                })}</div></div>}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
