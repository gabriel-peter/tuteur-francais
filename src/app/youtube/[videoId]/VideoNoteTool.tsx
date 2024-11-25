"use client";
import { Divider } from "@/components/catalyst-ui/divider";
import { Heading } from "@/components/catalyst-ui/heading";
import { AnnotatedVideo, MongoAnnotatedVideo } from "@/db/models/annotated-video";
import { TermTupleManager } from "./TermTupleManager";
import { Captions } from "./Captions";


export function VideoNoteTool({ video, setVideo }: { video: AnnotatedVideo; setVideo: (x: MongoAnnotatedVideo) => void; }) {
    return <>
        <div className="relative w-full h-0"
            style={{ paddingBottom: '56.25%' }} // 16:9 Aspect ratio 
        >
            <iframe
                title='Youtube player'
                className="absolute top-0 left-0 w-full h-full rounded"
                sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
                src={`https://youtube.com/embed/${video.videoId}?autoplay=0`}
                style={{ border: 'none' }} // Optional: to remove the default border
            >
            </iframe>
        </div>
        <Divider />
        <Heading>Notes - «{video.title}»</Heading>
        <TermTupleManager video={video} setVideo={setVideo} />
        <Captions video={video} />
    </>;
}
