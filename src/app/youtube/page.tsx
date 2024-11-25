"use client"
import { EllipsisHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, InputGroup } from "../../components/catalyst-ui/input";
import PageHeader from "@/components/PageHeader";
import { Description, Field, Label } from "../../components/catalyst-ui/fieldset";
import { useEffect, useState } from "react";
import { TableCell, TableRow } from '@/components/catalyst-ui/table'
import { handleKeyDown } from "../utils";
import { extractYoutubeId, getVideoMetadata as getVideoMetadata, YoutubeVideoMetadata } from "@/clients/youtube";
import Image from 'next/image';
import { upsertAnnotatedVideoAction as createOrFindAnnotatedVideoAction, deleteAnnotatedVideoAction, getAllAnnotatedVideoAction } from "@/db/actions";
import { AnnotatedVideo, MongoAnnotatedVideo } from "@/db/models/annotated-video";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "@/components/catalyst-ui/dropdown";
import { DeleteDialog } from "../../components/DeleteDialog";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { VideoRecents } from "./VideoRecents";


export default function YoutubeToolHome() {
    const [url, setUrl] = useState<string>();
    const [videoRecents, setVideoRecents] = useState<MongoAnnotatedVideo[]>([])
    const router = useRouter()

    function search(url?: string) {
        if (url === undefined) return new Promise(() => { });
        return getVideoMetadata(url).then(res => {
            console.log(res);
            return res
        }).then(metadata => createOrFindAnnotatedVideoAction(metadata))
            .then(JSON.parse)
            .then((newVideo: MongoAnnotatedVideo) => { console.log("Success new video save: " + newVideo.videoId); return newVideo.videoId })
            .then(videoId => router.push(`/youtube/${videoId}`))
            .catch(console.error)
    }

    useEffect(() => {
        getAllAnnotatedVideoAction().then(res => JSON.parse(res))
            .then((recents: MongoAnnotatedVideo[]) => setVideoRecents(recents))
            .catch(e => console.error(e))
    }, [])
    return (
        <>
            <SearchBar
                description="Enter a video URL that you wish to take notes on."
                textValue={url}
                setTextValue={setUrl}
                searchAction={() => search(url)} />
            <br />
            <VideoRecents videoRecents={videoRecents} />
        </>
    )
}

export function VideoRecentRow({ video }: { video: MongoAnnotatedVideo }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const router = useRouter();
    return (
        <>
            <DeleteDialog
                action={() => deleteAnnotatedVideoAction(video.videoId).then(() => location.reload())}
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


