"use client";
import { Heading } from "@/components/catalyst-ui/heading";
import { Table, TableHead, TableRow, TableHeader, TableBody } from "@/components/catalyst-ui/table";
import { AnnotatedVideo } from "@/db/models/annotated-video";
import { VideoRecentRow } from "./page";

export function VideoRecents({ videoRecents }: { videoRecents: AnnotatedVideo[]; }) {
    if (videoRecents.length === 0) {
        return <></>;
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
                        <VideoRecentRow key={index} video={video} />
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
