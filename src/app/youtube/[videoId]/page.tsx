"use client"

import { getAnnotatedVideoAction } from "@/db/actions"
import { MongoAnnotatedVideo } from "@/db/models/annotated-video"
import { useEffect, useState } from "react"
import { VideoNoteTool } from "../page";

export default function YoutubeNoteTaker({ params }: { params: Promise<{ videoId: string }> }) {
    const [video, setVideo] = useState<MongoAnnotatedVideo>();
    useEffect(() => {
        params.then(p => getAnnotatedVideoAction(p.videoId))
        .then(r => JSON.parse(r))
        .then((video: MongoAnnotatedVideo) => setVideo(video))
    }, [])
    
    return video ? <VideoNoteTool video={video} setVideo={setVideo} /> : "NOT FOUND"
}