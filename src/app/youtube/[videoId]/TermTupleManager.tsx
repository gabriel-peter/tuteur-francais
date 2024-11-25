"use client";
import { reverso, toTermTuple } from "@/clients/reverso";
import { Input } from "@/components/catalyst-ui/input";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/catalyst-ui/table";
import { SimpleVocabTerm } from "@/db/models/vocab-term";
import { useState } from "react";
import { handleKeyDown } from "../../utils";
import AnnotatedVideoModel, { AnnotatedVideo, MongoAnnotatedVideo } from "@/db/models/annotated-video";
import { removeTermFromAnnotatedVideo, updateTermFromAnnotatedVideoAction, updateTermToAnnotatedVideo } from "@/db/actions";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "@/components/catalyst-ui/dropdown";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/catalyst-ui/button";
import { Text } from "@/components/catalyst-ui/text";
import { Language, TermTuple } from "@/db/types";
import { TermTupleRows } from "@/components/term-tuple-manager/TermTupleRow";

export function TermTupleManager({ video: videoProp, setVideo: updateVideo }: { video: MongoAnnotatedVideo, setVideo: (x: MongoAnnotatedVideo) => void }) {
    const [video, setVideo] = useState<MongoAnnotatedVideo>(videoProp);
    function editAction(newTermTuple: TermTuple, oldTermTuple: TermTuple) {
        updateTermFromAnnotatedVideoAction(newTermTuple, oldTermTuple, video.videoId).then(JSON.parse).then(updateVideo)
    }
    const emptyTerm = { french: '', english: '', misc: '' };
    type VocabTermFields = keyof SimpleVocabTerm;
    const vocabTermFields: VocabTermFields[] = ["french", "english", "misc"];
    const [newTerm, setNewTerm] = useState<SimpleVocabTerm>(emptyTerm);

    async function createTerm(event: React.KeyboardEvent<HTMLInputElement>) {
        handleKeyDown(event, () => {
            let updatePromise: Promise<TermTuple>;
            if (newTerm.english === '') {
                updatePromise = reverso(newTerm.french, "fr", "en").then(res => toTermTuple(newTerm.french, res))
            } else if (newTerm.french === '') {
                updatePromise = reverso(newTerm.english, "en", "fr").then(res => toTermTuple(newTerm.english, res))
            } else {
                // Self-translated
                updatePromise = Promise.resolve({
                    firstTerm: {
                        word: newTerm.french,
                        language: Language.FRENCH
                    },
                    secondTerm: {
                        word: newTerm.english,
                        language: Language.ENGLISH
                    },
                    notes: newTerm.misc,
                    source: "User"
                });
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

    function removeItem(term: TermTuple, videoId: string) {
        removeTermFromAnnotatedVideo(term, videoId)
            .then(r => JSON.parse(r))
            .then((video: MongoAnnotatedVideo) => setVideo(video))
    }

    return (
        <Table striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
            <TableHead>
                <TableRow>
                    <TableHeader>French</TableHeader>
                    <TableHeader>English</TableHeader>
                    <TableHeader>Notes</TableHeader>
                    <TableHeader></TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    {vocabTermFields.map((termKey, index) => {
                        return (
                            <TableCell key={termKey}>
                                <Input
                                    aria-label={`"${termKey} Term"`}
                                    value={newTerm[termKey]}
                                    onKeyDown={(event) => createTerm(event)}
                                    onChange={(e) => setNewTerm({ ...newTerm, [termKey]: e.target.value })} />
                            </TableCell>);
                    })}
                </TableRow>
                {video.terms && <TermTupleRows
                    terms={video.terms.toReversed()}
                    removeAction={(x: TermTuple) => removeItem(x, video.videoId)}
                    editAction={editAction}
                />}
            </TableBody>
        </Table>
    );

    // && video.terms.toReversed().map((term, index) => (
    //     <TableRow key={index}>
    //         <TableCell className="text-right font-medium">{term.french}</TableCell>
    //         <TableCell className="text-right"><Text>{term.english}</Text></TableCell>
    //         <TableCell className="text-zinc-500">{term.misc}</TableCell>
    //         <TableCell>
    //             <div className="flex justify-evenly">
    //                 <Button onClick={() => { }}><PencilIcon /></Button>
    //                 <Button onClick={() => removeItem(term, video.videoId)}><TrashIcon /></Button>
    //             </div>
    //         </TableCell>
    //     </TableRow>
    // ))}
}
