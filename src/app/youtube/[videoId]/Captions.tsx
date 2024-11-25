"use client";
import { getCaptions } from "@/clients/youtube";
import { AnnotatedVideo } from "@/db/models/annotated-video";
import { useEffect } from "react";


export function Captions({ video }: { video: AnnotatedVideo; }) {
    useEffect(() => {
        getCaptions(video.videoId);
    }, []);
    return (<div></div>);
}
