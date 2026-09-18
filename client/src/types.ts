export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  title: string;
  tagline: string;
  about_title: string;
  about_text: string;
  skills_intro: string;
  email: string;
  phone: string | null;
  location: string | null;
  avatar_url: string;
  about_image_url: string;
  skills_image_url: string;
  cv_url: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
}

export interface Skill {
  id: number;
  name: string;
  percentage: number;
  icon: string;
  icon_url?: string | null;
  description?: string | null;
  section_id?: number | null;
  sort_order: number;
}

export interface SkillSection {
  id: number;
  title: string;
  items: string;
  sort_order: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  long_description?: string | null;
  image_url: string;
  gallery_urls?: string | null;
  video_url?: string | null;
  project_url: string;
  repo_url: string;
  tags: string;
  featured: number;
  sort_order: number;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: number;
  description: string;
  long_description?: string | null;
  image_url?: string | null;
  sort_order: number;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string | null;
  date: string | null;
  image_url: string;
  credential_url: string;
  long_description?: string | null;
  sort_order: number;
}

export interface Education {
  id: number;
  school: string;
  degree: string;
  field: string | null;
  start_date: string | null;
  end_date: string | null;
  current?: number;
  description: string | null;
  long_description?: string | null;
  image_url?: string | null;
  sort_order: number;
}

export interface PageBanner {
  page_key: string;
  label: string;
  image_url: string;
  sort_order: number;
}

export interface Kiff {
  id: number;
  title: string;
  category: string;
  description: string;
  long_description?: string | null;
  url: string;
  image_url: string;
  featured: number;
  sort_order: number;
}

export interface PortfolioData {
  profile: Profile;
  social_links: SocialLink[];
  skills: Skill[];
  skill_sections: SkillSection[];
  projects: Project[];
  experiences: Experience[];
  certifications: Certification[];
  education: Education[];
  kiffs: Kiff[];
  page_banners: PageBanner[];
  settings: Record<string, string>;
}
