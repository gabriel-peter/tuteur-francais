"use client"
import PageHeader from "@/components/page-header";
import { Text } from "@/components/catalyst-ui/text";

import React, { useState, useRef, useEffect, Fragment } from "react";
import { Dropdown, DropdownMenu, DropdownItem, DropdownShortcut, DropdownLabel, DropdownButton } from "@/components/catalyst-ui/dropdown";
import { Menu, MenuButton } from "@headlessui/react";
import { SimpleVocabTerm } from "@/db/models/vocab-term";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/catalyst-ui/table";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import AnnotatedExcerptModel, { AnnotatedExcerpt, MongoAnnotatedExcerpt } from "@/db/models/excerpt";
import { TextWithActions } from "@/components/TextWithActions";
import { getExerptAction, updateTermToAnnotatedExcertAction } from "@/db/actions";
import { reverso } from "@/clients/reverso";
import { Language, TermTuple } from "@/db/types";

export default function NewsTool({ params }: { params: Promise<{ excerptId: string }> }) {
    const [excerpt, setExcerpt] = useState<MongoAnnotatedExcerpt>();
    useEffect(() => { // Load Excerpt by Id
        params.then(params => getExerptAction(params.excerptId))
            .then(res => JSON.parse(res)).then((excerpt: MongoAnnotatedExcerpt) => setExcerpt(excerpt))
    }, [])
    const saveNewTerm = (selectedText: string, excerptId: string) => {
        // navigator.clipboard.writeText(selectedText);
        // alert("Text copied!");
        // return new Promise(() => { });
        return reverso(selectedText,"fr", "en").then(res => res['translation'])
        .then((translation: string[]): TermTuple => ({
            firstTerm: {
                word: selectedText,
                language: Language.FRENCH,
            }, 
            secondTerm: {
                word: translation[0],
                language: Language.ENGLISH
            }
        })).then(term => updateTermToAnnotatedExcertAction(term, excerptId))
        .then(res => JSON.parse(res))
        .then(updatedExcerpt => setExcerpt(updatedExcerpt))
        .catch(error => console.error(error))
    };

    // Example placeholder function for translation
    const translateText = (selectedText: string) => {
        alert(`Translate: ${selectedText}`);
        return new Promise(() => { });
    };
    return (<PageHeader title="News">
        {excerpt ? (
            <>
                <TextWithActions
                    highlightActions={
                        (selectedText: string, closeMenu: () => void) => (
                            <>
                                <DropdownItem onClick={() => saveNewTerm(selectedText, excerpt.id).then(closeMenu)}>
                                    <DropdownShortcut keys="⌘S" />
                                    <DropdownLabel>Save</DropdownLabel>
                                </DropdownItem>
                                <DropdownItem onClick={() => translateText(selectedText, excerpt.id).then(closeMenu)}>
                                    <DropdownLabel>Quick Translate</DropdownLabel>
                                    <DropdownShortcut keys="⌘T" />
                                </DropdownItem>
                                <DropdownItem onClick={() => translateText(selectedText, excerpt.id).then(closeMenu)}>
                                    <DropdownLabel>Speak</DropdownLabel>
                                    {/* <DropdownShortcut keys="⌘T" /> */}
                                </DropdownItem>
                            </>)
                    }
                    body={
                        <Text>
                            {excerpt.content}
                        </Text>
                    }
                />
                <SavedTerms excerpt={excerpt} setExcerpt={setExcerpt} />
            </>
        ) :
            <div>Loading ...</div>
        }
    </PageHeader>)
}

function SavedTerms({ excerpt, setExcerpt }: { excerpt: MongoAnnotatedExcerpt, setExcerpt: (x: MongoAnnotatedExcerpt) => void }) {
    return <Table>
        <TableHead>
            <TableRow>
                <TableHeader>French</TableHeader>
                <TableHeader>English</TableHeader>
                <TableHeader>Actions</TableHeader>
            </TableRow>
        </TableHead>
        <TableBody>
            {excerpt.terms.map((term, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium">{term.firstTerm.word}</TableCell>
                    <TableCell>{term.secondTerm.word}</TableCell>
                    <TableCell>{term.firstTerm.type}</TableCell>
                    <TableCell className="text-zinc-500">
                        <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                            <Dropdown>
                                <DropdownButton plain aria-label="More options">
                                    <EllipsisHorizontalIcon />
                                </DropdownButton>
                                <DropdownMenu anchor="bottom end">
                                    <DropdownItem>View</DropdownItem>
                                    <DropdownItem>Edit</DropdownItem>
                                    <DropdownItem>Delete</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}


