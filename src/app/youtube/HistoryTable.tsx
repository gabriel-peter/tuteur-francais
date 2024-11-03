"use client";
import { reverso } from "@/clients/reverso";
import { Input } from "@/components/catalyst-ui/input";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/catalyst-ui/table";
import { SimpleVocabTerm } from "@/db/models/vocab-term";
import { useState } from "react";
import { handleKeyDown } from "../utils";
import AnnotatedVideoModel, { AnnotatedVideo } from "@/db/models/annotated-video";
import { updateTermToAnnotatedVideo } from "@/db/actions";

export function HistoryTable({ video: videoProp }: { video: AnnotatedVideo }) {
    const [video, setVideo] = useState<AnnotatedVideo>(videoProp)
    const emptyTerm = { french: '', english: '', misc: '' };
    type VocabTermFields = keyof SimpleVocabTerm;
    const vocabTermFields: VocabTermFields[] = ["french", "english", "misc"];
    const [newTerm, setNewTerm] = useState<SimpleVocabTerm>(emptyTerm);


    async function createTerm(event: React.KeyboardEvent<HTMLInputElement>) {
        handleKeyDown(event, () => {
            let updatePromise: Promise<SimpleVocabTerm>;
            if (newTerm.english === '') {
                updatePromise = reverso(newTerm.french)
                    .then(res => res['translation'])
                    .then((translation: string[]) =>
                        ({ ...newTerm, english: translation[0], misc: newTerm.misc + "(Translated via Reverso)" })
                    )
            } else {
                updatePromise = new Promise(() => newTerm); // Self-translated
            }
            updatePromise
            .then(translatedTerm => updateTermToAnnotatedVideo(translatedTerm, video.videoId))
            .then(stringRes => JSON.parse(stringRes))
            .then((updatedVideo) => {
                setVideo(updatedVideo);
                setNewTerm(emptyTerm);
            })
        });
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
                                    onChange={(e) => setNewTerm({ ...newTerm, [termKey]: e.target.value })} />
                            </TableCell>);
                    })}
                </TableRow>
                {video.terms && video.terms.map((term, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{term.french}</TableCell>
                        <TableCell>{term.english}</TableCell>
                        <TableCell className="text-zinc-500">{term.misc}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
