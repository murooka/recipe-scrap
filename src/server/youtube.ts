import { youtube } from "@googleapis/youtube";
export type VideoSnippet = {
  title: string;
  description: string;
  thumbnailUrl: string;
};
export async function getVideoSnippet(videoId: string): Promise<VideoSnippet | null> {
  const service = youtube("v3");
  const res = await service.videos.list({
    auth: process.env.YOUTUBE_DATA_API_KEY,
    part: ["snippet"],
    id: [videoId],
  });
  if (res.data.items == null || res.data.items.length === 0) return null;

  const video = res.data.items[0];
  console.dir(video, { depth: null });

  return {
    title: video.snippet?.title ?? "",
    description: video.snippet?.description ?? "",
    thumbnailUrl: video.snippet?.thumbnails?.standard?.url ?? "",
  };
}
