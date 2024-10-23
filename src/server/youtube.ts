import { google } from "googleapis";

export type VideoSnippet = {
  description: string;
  thumbnailUrl: string;
};
export async function getVideoSnippet(videoId: string): Promise<VideoSnippet | null> {
  const service = google.youtube("v3");
  const res = await service.videos.list({
    auth: process.env.YOUTUBE_DATA_API_KEY,
    part: ["snippet"],
    id: [videoId],
  });
  if (res.data.items == null || res.data.items.length === 0) return null;

  const video = res.data.items[0];

  return {
    description: video.snippet?.description ?? "",
    thumbnailUrl: video.snippet?.thumbnails?.standard?.url ?? "",
  };
}
