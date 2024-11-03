"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, InputGroup } from "../../components/catalyst-ui/input";
import PageHeader from "../../components/page-header";
import { Description, Field, Label } from "../../components/catalyst-ui/fieldset";
import { useEffect, useState } from "react";
import { Button } from "../../components/catalyst-ui/button";
import { Divider } from "../../components/catalyst-ui/divider";
import { Heading } from "../../components/catalyst-ui/heading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst-ui/table'
import { handleKeyDown } from "../utils";
import { extractYoutubeId, getVideoTitle, Video } from "@/clients/youtube";
import { reverso } from "@/clients/reverso";
import Image from 'next/image';
import { VideoVocabTerm } from "@/data/types";


function HistoryTable() {
    const emptyTerm = { french: '', english: '', misc: '' };
    type VocabTermFields = keyof VideoVocabTerm;
    const vocabTermFields: VocabTermFields[] = ["french", "english", "misc"];
    const [savedTerms, setSavedTerms] = useState<VideoVocabTerm[]>([{ french: "poisson", english: "fish", misc: "TODO" }]);
    const [newTerm, setNewTerm] = useState<VideoVocabTerm>(emptyTerm);

    async function createTerm(event: React.KeyboardEvent<HTMLInputElement>) {
        handleKeyDown(event, () => {
            if (newTerm.english === '') {
                const result = reverso(newTerm.french)
                    .then(res => res['translation'])
                    .then((translation: string[]) => {
                        setSavedTerms((savedTerms) => [{ ...newTerm, english: translation[0], misc: newTerm.misc + "(Translated via Reverso)" }, ...savedTerms]);
                        setNewTerm(emptyTerm)
                    })
            } else {
                setSavedTerms((savedTerms) => [newTerm, ...savedTerms]);
                setNewTerm(emptyTerm)
            }
        })
    }

    return (
        <Table striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
            <TableHead>
                <TableRow>
                    <TableHeader>French</TableHeader>
                    <TableHeader>English</TableHeader>
                    <TableHeader>Misc</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    {vocabTermFields.map((termKey, index) => {
                        return (
                            <TableCell key={index}>
                                <Input
                                    aria-label={`"${termKey} Term"`}
                                    value={newTerm[termKey]}
                                    onKeyDown={(event) => createTerm(event)}
                                    onChange={(e) => setNewTerm({ ...newTerm, [termKey]: e.target.value })}
                                />
                            </TableCell>)
                    })
                    }
                </TableRow>
                {savedTerms.map((term, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{term.french}</TableCell>
                        <TableCell>{term.english}</TableCell>
                        <TableCell className="text-zinc-500">{term.misc}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function YoutubeToolHome() {
    const [url, setUrl] = useState<string>();
    const [video, setVideo] = useState<Video>();
    const videoRecents: Video[] = [{
        "videoId": "n5S2NuZm3_w",
        "title": "Je vous prépare le poisson le plus sous côté",
        "thumbnailUrl": "https://i.ytimg.com/vi/n5S2NuZm3_w/hqdefault.jpg"
    }];
    useEffect(() => {
        if (url === undefined) return;
        getVideoTitle(url).then(res => {
            console.log(res);
            setVideo(res);
        })

    }, [url, setUrl])
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
            {video ? VideoNoteTool(video) : <VideoRecents videoRecents={videoRecents} />}
        </>
    )
}

function VideoRecents({ videoRecents }: { videoRecents: Video[] }) {
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
                    <TableRow key={index} href={`/youtube/${video.videoId}`}>
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

function VideoNoteTool(video: { videoId: string; title: string; }) {
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
        <HistoryTable />
    </>;
}
