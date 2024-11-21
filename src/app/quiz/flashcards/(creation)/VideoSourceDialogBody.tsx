"use client";
import { Field, Label } from "@/components/catalyst-ui/fieldset";
import { Select } from "@/components/catalyst-ui/select";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/catalyst-ui/table";
import { Text } from "@/components/catalyst-ui/text";
import { LoadingButton } from "@/components/LoadingButton";
import { getAllAnnotatedVideoAction, createQuizAction } from "@/db/actions";
import { AnnotatedVideo } from "@/db/models/annotated-video";
import { Quiz } from "@/db/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ExternalSourceSelector } from "./ExternalSourceSelector.1";

export function VideoSourceDialogBody() {
    const [recentVideos, setRecentVideos] = useState<AnnotatedVideo[]>();
    const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>();
    useEffect(() => {
        getAllAnnotatedVideoAction().then(res => JSON.parse(res)).then(recentVideos => setRecentVideos(recentVideos)); // TODO LIMIT
    }, []);

    function createQuiz(video: AnnotatedVideo) {
        const newQuiz: Quiz = {
            title: video.title,
            items: video.terms,
            state: "NEW"
        };
        return createQuizAction(newQuiz);
    }

    return (
        <ExternalSourceSelector
            label="Recent Excerpts"
            recents={recentVideos}
            selectedIndex={selectedVideoIndex}
            setSelectedIndex={setSelectedVideoIndex}
            createQuiz={createQuiz}
        />);

}
