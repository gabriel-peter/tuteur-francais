"use client"
import { EllipsisHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, InputGroup } from "../../components/catalyst-ui/input";
import PageHeader from "../../components/page-header";
import { Description, Field, Label } from "../../components/catalyst-ui/fieldset";
import { useEffect, useState } from "react";
import { Divider } from "../../components/catalyst-ui/divider";
import { Heading } from "../../components/catalyst-ui/heading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst-ui/table'
import { handleKeyDown } from "../utils";
import { extractYoutubeId, getCaptions, getVideoMetadata as getVideoMetadata, YoutubeVideoMetadata } from "@/clients/youtube";
import Image from 'next/image';
import { upsertAnnotatedVideoAction as createOrFindAnnotatedVideoAction, deleteAnnotatedVideoAction, getAllAnnotatedVideoAction } from "@/db/actions";
import { AnnotatedVideo } from "@/db/models/annotated-video";
import { HistoryTable } from "./HistoryTable";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "@/components/catalyst-ui/dropdown";
import { DeleteDialog } from "../../components/DeleteDialog";
import { useRouter } from "next/navigation";


export default function YoutubeToolHome() {
    const [url, setUrl] = useState<string>();
    const [video, setVideo] = useState<AnnotatedVideo>();
    const [videoRecents, setVideoRecents] = useState<AnnotatedVideo[]>([])
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
            {!video && <VideoRecents setUrl={setUrl} videoRecents={videoRecents} />}
        </>
    )
}

function VideoRecents({ videoRecents, setUrl }: { videoRecents: AnnotatedVideo[], setUrl: (x: string) => void }) {
    if (videoRecents.length === 0) {
        return <></>
    }
    return (
        <>
            <Heading>Recently viewed</Heading>
            <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
                <TableHead>
                    <TableRow>
                        <TableHeader></TableHeader>
                        <TableHeader></TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {videoRecents.map((video, index) => (
                        <VideoRecentRow key={index} setUrl={setUrl} video={video} />
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

function VideoRecentRow({ setUrl, video }: { setUrl: (x: string) => void, video: AnnotatedVideo }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const router = useRouter();
    return (
        <>
            <DeleteDialog
                action={() => deleteAnnotatedVideoAction(video.videoId).then(() => router.refresh())}
                isOpen={showDeleteDialog}
                title="Are you sure you want to delete this annotated video?"
                setIsOpen={setShowDeleteDialog}
            />
            <TableRow>
                <TableCell onClick={() => router.push(`youtube/${video.videoId}`)}>
                    <div className="flex items-center gap-4">
                        <Image
                            src={video.thumbnailUrl}
                            className="size-36 rounded"
                            width={500}
                            height={889}
                            alt="Picture of the author" />
                    </div>
                </TableCell>
                <TableCell>
                    <div className="font-medium">{video.title}</div>
                </TableCell>
                <TableCell>
                    <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                        <Dropdown>
                            <DropdownButton plain aria-label="More options">
                                <EllipsisHorizontalIcon />
                            </DropdownButton>
                            <DropdownMenu anchor="bottom end">
                                <DropdownItem
                                    onClick={() => setShowDeleteDialog(true)}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </TableCell>
            </TableRow>
        </>
    );
}

function Captions({video} : {video: AnnotatedVideo}) {
    useEffect(() => {
        getCaptions(video.videoId)
    }, []);
    return (<div></div>)
}

export function VideoNoteTool({ video }: { video: AnnotatedVideo }) {
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
        <HistoryTable video={video} />
        <Captions video={video} />
    </>;
}
