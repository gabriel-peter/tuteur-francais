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
import { getExerptAction, removeTermFromAnnotatedExcerpt, updateTermFromAnnotatedExcerptAction, updateTermToAnnotatedExcertAction } from "@/db/actions";
import { reverso, TranslationResponse } from "@/clients/reverso";
import { Language, Term, TermTuple } from "@/db/types";
import { MongoTermTuple } from "@/db/models/quiz/quiz";
import { Input } from "@/components/catalyst-ui/input";
import { Listbox, ListboxLabel, ListboxOption } from "@/components/catalyst-ui/listbox";
import { Field } from "@/components/catalyst-ui/fieldset";

export default function NewsTool({ params }: { params: Promise<{ excerptId: string }> }) {
    const [excerpt, setExcerpt] = useState<MongoAnnotatedExcerpt>();
    useEffect(() => { // Load Excerpt by Id
        params.then(params => {
            console.log("Loading Excerpt: ", params.excerptId)
            return getExerptAction(params.excerptId)
        })
            .then(res => JSON.parse(res)).then((excerpt: MongoAnnotatedExcerpt) => setExcerpt(excerpt))
    }, [])
    const saveNewTerm = (selectedText: string, excerptId: string) => {
        // navigator.clipboard.writeText(selectedText);
        // alert("Text copied!");
        // return new Promise(() => { });
        return reverso(selectedText, "fr", "en")
            .then((res: TranslationResponse): TermTuple => ({
                firstTerm: {
                    word: selectedText,
                    examples: res.contextResults.results.flatMap(r => r.sourceExamples),
                    language: Language.FRENCH,
                },
                secondTerm: {
                    word: res.translation[0],
                    otherPossibilies: res.contextResults.results.map(r => r.translation),
                    examples: res.contextResults.results.flatMap(r => r.targetExamples),
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
    function removeItem(term: TermTuple) {
        removeTermFromAnnotatedExcerpt(term, excerpt.id).then(res => JSON.parse(res)).then((updated: MongoAnnotatedExcerpt) => setExcerpt(updated))
    }

    function editItem(newTermTuple: TermTuple, oldTermTuple: TermTuple) {
        updateTermFromAnnotatedExcerptAction(newTermTuple, oldTermTuple, excerpt._id).then(res => JSON.parse(res)).then((updated: MongoAnnotatedExcerpt) => setExcerpt(updated))
    }

    return <Table>
        <TableHead>
            <TableRow>
                <TableHeader>French</TableHeader>
                <TableHeader>English</TableHeader>
                <TableHeader>Actions</TableHeader>
            </TableRow>
        </TableHead>
        <TableBody>
            <TermTupleRows
                terms={excerpt.terms}
                removeAction={removeItem}
                editAction={editItem}
            />
        </TableBody>
    </Table>
}


const TermReselectListbox = ({ term, editTermAction }: { term: Term, editTermAction: (x: Term) => void }) => {
    const [translationValue, setTranslationValue] = useState(term.word)

    // Detects change in state made by Listbox and causes full object change in parent.
    // useEffect(() => {
    //     editTermAction({ ...term, word: translationValue })
    // }, [])
    if (!term.otherPossibilies || term.otherPossibilies.length === 0) {
        return term.word
    }
    return (<Field>
        <Listbox value={translationValue} onChange={value => editTermAction({ ...term, word: value })}>
            {/* Sadly complicated, other possibilities include the main 
            translation so you need to append them and get the unique Set */}
            {[...new Set([term.word, ...term.otherPossibilies || []])].map((possibility, index) => (
                <ListboxOption value={possibility} key={index}>
                    <ListboxLabel>{possibility}</ListboxLabel>
                </ListboxOption>
            ))}
        </Listbox>
    </Field>);
};

export function TermTupleRows({
    terms,
    removeAction,
    editAction
}: {
    terms: TermTuple[],
    removeAction: (x: TermTuple) => void,
    editAction: (newTermTuple: TermTuple, oldTermTuple: TermTuple) => void
}) {
    return (
        <>
            {terms.map((term, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium">{term.firstTerm.word}</TableCell>
                    <TableCell>
                        <TermReselectListbox term={term.secondTerm} editTermAction={
                            (newSecondTerm: Term) => {
                                console.log("New Main Translation Selected", newSecondTerm)
                                const newTermTuple: TermTuple = { ...term, ...{ secondTerm: newSecondTerm } }
                                editAction(newTermTuple, term)
                            }
                        } />
                    </TableCell>
                    <TableCell>{term.firstTerm.type}</TableCell>
                    <TableCell className="text-zinc-500">
                        <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                            <Dropdown>
                                <DropdownButton plain aria-label="More options">
                                    <EllipsisHorizontalIcon />
                                </DropdownButton>
                                <DropdownMenu anchor="bottom end">
                                    {/* Shows more of TermTuple like examples */}
                                    <DropdownItem>View</DropdownItem>
                                    <DropdownItem onClick={() => removeAction(term)}>Remove</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}


