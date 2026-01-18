export interface RawN8nPost {
  musicInfo: {
    artist_name: string;
  };
  inputUrl: string;
  url: string;
  videoUrl: string;
  caption: string;
  videoPlayCount: number;
  likesCount: number;
  commentsCount: number;
  videoDuration: number;
}

export interface InstagramProfile {
  username: string;
  full_name?: string;
  bio?: string;
  profile_pic_url?: string;
  followers?: number;
  following?: number;
  posts_count: number;
  is_verified?: boolean;
}

export interface InstagramPost {
  id: string;
  caption: string;
  likes: number;
  comments: number;
  views?: number;
  media_type: "photo" | "video" | "carousel";
  media_url: string;
  timestamp: string; // We will generate a relative one or leave blank if missing
  engagement_rate: number;
}

export interface InstagramAnalytics {
  avg_likes: number;
  avg_comments: number;
  avg_views: number;
  overall_engagement_rate: number; // calculated based on likes+comments relative to view count if available
  total_engagements: number;
  best_post: {
    id: string;
    likes: number;
    comments: number;
  } | null;
}

export interface InstagramData {
  profile: InstagramProfile;
  posts: InstagramPost[];
  analytics: InstagramAnalytics;
}

export interface ApiResponse {
  success: boolean;
  username?: string;
  request_id?: string;
  data?: InstagramData;
  error?: string;
}