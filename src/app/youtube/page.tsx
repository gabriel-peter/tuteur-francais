"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, InputGroup } from "../../components/catalyst-ui/input";
import PageHeader from "../../components/page-header";
import { Description, Field, Label } from "../../components/catalyst-ui/fieldset";
import { useEffect, useState } from "react";
import { Button } from "../../components/catalyst-ui/button";
import { Divider } from "../../components/catalyst-ui/divider";
import { Heading } from "../../components/catalyst-ui/heading";
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/catalyst-ui/table'
import { handleKeyDown } from "../utils";
import { extractYoutubeId, getVideoTitle as getVideoMetadata, YoutubeVideoMetadata } from "@/clients/youtube";
import Image from 'next/image';
import { upsertAnnotatedVideoAction as createOrFindAnnotatedVideoAction, getAllAnnotatedVideoAction } from "@/db/actions";
import { AnnotatedVideo } from "@/db/models/annotated-video";
import { HistoryTable } from "./HistoryTable";


export default function YoutubeToolHome() {
    const [url, setUrl] = useState<string>();
    const [video, setVideo] = useState<AnnotatedVideo>();
    const [videoRecents, setVideoRecents] = useState<AnnotatedVideo[]>([{
        videoId: "n5S2NuZm3_w",
        title: "Je vous prépare le poisson le plus sous côté",
        thumbnailUrl: "https://i.ytimg.com/vi/n5S2NuZm3_w/hqdefault.jpg",
        createdAt: new Date(),
        terms: []
    }])
    useEffect(() => {
        if (url === undefined) return;
        getVideoMetadata(url).then(res => {
            console.log(res);
            return res
        }).then(metadata => createOrFindAnnotatedVideoAction(metadata))
        .then(res => JSON.parse(res))
        .then((newVideo: AnnotatedVideo) => setVideo(newVideo))
        .then(r => console.log("Success new video save: " + r))
        .catch(e => console.log(e))
    }, [url, setUrl])

    useEffect(() => {
        getAllAnnotatedVideoAction().then(res => JSON.parse(res))
        .then((recents: AnnotatedVideo[]) => setVideoRecents(prev => [...prev, ...recents]))
        .catch(e => console.error(e))
    }, [])
    return (
        <>
            <Field>
                {/* <Label>Your website</Label> */}
                <Description>Enter a video URL that you wish to take notes on.</Description>
                <InputGroup>
                    <MagnifyingGlassIcon />
                    <Input
                        type="url"
                        name="url"
                        placeholder="Search&hellip;"
                        aria-label="Search"
                        value={url}
                        onKeyDown={(event) => handleKeyDown(event, () => setUrl(event.currentTarget.value))}
                        autoFocus
                    />
                </InputGroup>
            </Field>
            <br />
            {video ? <VideoNoteTool video={video}/> : <VideoRecents setUrl={setUrl} videoRecents={videoRecents} />}
        </>
    )
}

function VideoRecents({ videoRecents, setUrl }: { videoRecents: YoutubeVideoMetadata[], setUrl: (x: string) => void }) {
    return (
        <>
        <Heading>Recently viewed</Heading>
        <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
            <TableHead>
                <TableRow>
                    {/* <TableHeader>Name</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader> */}
                </TableRow>
            </TableHead>
            <TableBody>
                {videoRecents.map((video, index) => (
                    <TableRow key={index} onClick={() => setUrl(`https://www.youtube.com/watch?v=${video.videoId}`)}>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <Image
                                    src={video.thumbnailUrl}
                                    className="size-36"
                                    width={500}
                                    height={500}
                                    alt="Picture of the author"
                                />
                                <div>
                                    <div className="font-medium">{video.title}</div>
                                    {/* <div className="text-zinc-500">
                        <a href="#" className="hover:text-zinc-700">
                          {user.email}
                        </a>
                      </div> */}
                                </div>
                            </div>
                        </TableCell>
                        {/*
                <TableCell className="text-zinc-500">{user.access}</TableCell>
                <TableCell>
                  {user.online ? <Badge color="lime">Online</Badge> : <Badge color="zinc">Offline</Badge>}
                </TableCell> */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </>
    )
}

function VideoNoteTool({video}:{video: AnnotatedVideo}) {
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
        <HistoryTable video={video}/>
    </>;
}
