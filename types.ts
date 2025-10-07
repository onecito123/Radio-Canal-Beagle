export interface Song {
  title: string;
  artist: string;
  time: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  image: string;
  date: string;
  summary: string;
  content?: string;
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

export interface PodcastEpisode {
    id: number;
    title: string;
    description: string;
    duration: string;
    audioUrl: string;
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