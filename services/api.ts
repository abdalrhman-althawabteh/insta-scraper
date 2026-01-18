import { ApiResponse, InstagramData, RawN8nPost, InstagramPost } from '../types';

const WEBHOOK_URL = "https://n8n.srv965433.hstgr.cloud/webhook/5630fe56-692e-4edb-b2fc-3bfd079bef60";

// Fallback Mock Data
const generateMockData = (username: string): InstagramData => {
  return {
    profile: {
      username: username,
      posts_count: 12,
    },
    posts: [],
    analytics: {
      avg_likes: 0,
      avg_comments: 0,
      avg_views: 0,
      overall_engagement_rate: 0,
      total_engagements: 0,
      best_post: null
    }
  };
};

export const fetchInstagramData = async (username: string): Promise<ApiResponse> => {
  console.log(`[API] Fetching data for ${username}`);

  const requestBody = {
    username,
    timestamp: new Date().toISOString(),
    request_id: crypto.randomUUID(),
  };

  const doFetch = async (url: string) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 404) {
      throw new Error("N8N 404: Please ensure your workflow is Active.");
    }
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    // Check if response is text (non-JSON success) or JSON
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { _status: "text_response", message: text };
    }
  };

  try {
    let rawData;
    
    // 1. Fetch Data (Direct or Proxy)
    try {
      rawData = await doFetch(WEBHOOK_URL);
    } catch (directError) {
      const errorMsg = directError instanceof Error ? directError.message : String(directError);
      if (errorMsg.includes("404")) throw directError;
      
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(WEBHOOK_URL)}`;
      rawData = await doFetch(proxyUrl);
    }

    console.log('[API] Raw Data:', rawData);

    // 2. Process Data
    // Expecting an Array of RawN8nPost based on user snippet
    let postsArray: RawN8nPost[] = [];

    if (Array.isArray(rawData)) {
      postsArray = rawData;
    } else if (rawData.data && Array.isArray(rawData.data)) {
      postsArray = rawData.data;
    } else if (rawData.output && Array.isArray(rawData.output)) {
      postsArray = rawData.output;
    } else {
       // If empty or unrecognized, return basic success with no data
       console.warn("Received unrecognized data structure, returning empty.");
       return { success: true, username, data: generateMockData(username) };
    }

    // 3. Transform to Dashboard Format
    const processedPosts: InstagramPost[] = postsArray.map((post, index) => ({
      id: post.url || `post_${index}`,
      caption: post.caption || "",
      likes: post.likesCount || 0,
      comments: post.commentsCount || 0,
      views: post.videoPlayCount || 0,
      media_type: 'video', // The provided JSON mostly contains videoUrl
      media_url: post.videoUrl || "", 
      timestamp: new Date().toISOString(), // No timestamp in source, use current
      // Simple engagement calc: (Likes + Comments) / Views * 100 (if view exists)
      engagement_rate: post.videoPlayCount > 0 
        ? ((post.likesCount + post.commentsCount) / post.videoPlayCount) * 100 
        : 0
    }));

    // 4. Calculate Analytics
    const totalLikes = processedPosts.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = processedPosts.reduce((sum, p) => sum + p.comments, 0);
    const totalViews = processedPosts.reduce((sum, p) => sum + (p.views || 0), 0);
    const count = processedPosts.length;

    const bestPost = processedPosts.length > 0 
      ? processedPosts.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
      : null;

    const derivedUsername = postsArray[0]?.musicInfo?.artist_name || username;

    const finalData: InstagramData = {
      profile: {
        username: derivedUsername,
        posts_count: count,
        // Bio, Followers, Following are missing from source JSON
      },
      posts: processedPosts,
      analytics: {
        avg_likes: count ? Math.round(totalLikes / count) : 0,
        avg_comments: count ? Math.round(totalComments / count) : 0,
        avg_views: count ? Math.round(totalViews / count) : 0,
        total_engagements: totalLikes + totalComments,
        overall_engagement_rate: count ? (processedPosts.reduce((sum, p) => sum + p.engagement_rate, 0) / count) : 0,
        best_post: bestPost ? {
          id: bestPost.id,
          likes: bestPost.likes,
          comments: bestPost.comments
        } : null
      }
    };

    return {
      success: true,
      username: derivedUsername,
      data: finalData,
      request_id: crypto.randomUUID()
    };

  } catch (error) {
    console.error("API Request Failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect",
      username
    };
  }
};