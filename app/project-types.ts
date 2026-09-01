export type ProjectText = {
  title: string;
  type: string;
  period: string;
  alt: string;
  intro: string;
  detail: string;
};

export type Project = ProjectText & {
  id: string;
  index: string;
  category: "VR" | "AR" | "XR" | "Prototype" | "Interactive" | "3D";
  image: string;
  tools: string[];
  accent: string;
  zh?: ProjectText;
  gallery?: string[];
  videos?: { name?: string; src: string }[];
  externalLink?: { label: string; zhLabel: string; href: string };
  order?: number;
};
