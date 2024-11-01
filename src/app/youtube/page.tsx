"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, InputGroup } from "../catalyst-ui/input";
import PageHeader from "../components/page-header";
import { Description, Field, Label } from "../catalyst-ui/fieldset";
import { useState } from "react";
import { Button } from "../catalyst-ui/button";
import { Divider } from "../catalyst-ui/divider";
import { Heading } from "../catalyst-ui/heading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/catalyst-ui/table'

type VocabTerm = {
    french: string,
    english: string,
    misc: string
}

function HistoryTable() {
    const emptyTerm = { french: '', english: '', misc: '' };
    type VocabTermFields = keyof VocabTerm;
    const vocabTermFields: VocabTermFields[] = ["french", "english", "misc"];
    const [savedTerms, setSavedTerms] = useState<VocabTerm[]>([{ french: "poisson", english: "fish", misc: "TODO" }]);
    const [newTerm, setNewTerm] = useState<VocabTerm>(emptyTerm);
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
                                    onKeyDown={(event) => handleKeyDown(event, () => {
                                        setSavedTerms((savedTerms) => [newTerm, ...savedTerms]);
                                        setNewTerm(emptyTerm)
                                    })}
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



function extractYoutubeId(url: string): string | undefined {
    const regex = /[?&]v=([^&#]*)/;
    const match = url.match(regex);

    if (match) {
        const videoId = match[1];
        console.log(videoId); // Output: 4vhBcNeYOcg
        return videoId
    }
}

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, action: () => any) => {
    if (event.key === 'Enter') action();
}

export default function YoutubeTool() {
    const [url, setUrl] = useState<string>();
    return (
        <PageHeader title="Youtube Tool">
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
            <div className="relative w-full h-0"
                style={{ paddingBottom: '56.25%' }} // 16:9 Aspect ratio 
            >
                {url && <iframe
                    title='Youtube player'
                    className="absolute top-0 left-0 w-full h-full rounded"
                    sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
                    src={`https://youtube.com/embed/${extractYoutubeId(url)}?autoplay=0`}
                    style={{ border: 'none' }} // Optional: to remove the default border
                >
                </iframe>}
            </div>
            <Divider />
            <Heading>Notes</Heading>
            <HistoryTable />
        </PageHeader>
    )
}