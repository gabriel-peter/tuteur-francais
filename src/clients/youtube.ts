// TODO "use server"

const apiKey =  process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export function extractYoutubeId(url: string): string {
    const regex = /[?&]v=([^&#]*)/;
    const match = url.match(regex);

    if (match) {
        const videoId = match[1];
        console.log(videoId); // Output: 4vhBcNeYOcg
        return videoId;
    } else {
        throw new Error('Cannot parse videoId');
    }
}

export async function getVideoMetadata(url: string): Promise<YoutubeVideoMetadata> {
    
    console.log(apiKey);
    const videoId = extractYoutubeId(url); // Extract video ID from URL

    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
        return {videoId, title: data.items[0].snippet.title, thumbnailUrl: getThumbnailUrl(data) };
    } else {
        throw new Error('Video not found');
    }
}

export async function getCaptions(videoId: string) {
  return fetch(`https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&key=${apiKey}`)
  .then(response => response.json())
  .then(data => data.items[0].id) // termed which item in the array
  .then(captionId => extractCaptions(captionId))
  .catch(error => console.error('Error fetching captions:', error));
}

async function extractCaptions(captionId: string) {
    return fetch(`https://www.googleapis.com/youtube/v3/captions/${captionId}?tfmt=srt&key=${apiKey}`)
    .then(response => response.text())
    .then(captions => {
      console.log('Captions content:', captions);
      return captions
    })
    .catch(error => console.error('Error fetching caption content:', error));
}

export type YoutubeVideoMetadata = {
    videoId: string;
    title: string;
    thumbnailUrl?: string;
};

function getThumbnailUrl(data: any): string | undefined {
    const thumbnails = data.items[0].snippet.thumbnails;
    // Choose a thumbnail size
    const thumbnailUrl = thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url;
    return thumbnailUrl;
}

