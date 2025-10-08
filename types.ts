export interface ScheduleItem {
  id: number;
  day: string;
  time: string;
  program: string;
  created_at?: string;
}

export interface Ad {
  id: number;
  company: string;
  image: string;
  url: string;
  text: string;
  created_at?: string;
}

export interface Banner {
  text: string;
  image: string;
  secondary_banner_image: string | null;
  secondary_banner_visible: boolean;
  radio_url: string;
}

export interface BannerConfig {
  banner: Banner;
  schemaIsOutdated: boolean;
}

export interface ScheduleConfig {
  schedule: ScheduleItem[];
  tableExists: boolean;
}

// Interfaz para los artículos de noticias parseados desde los feeds RSS
export interface ParsedArticle {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    rawDate: Date;
    image: string | null;
    source: string;
}