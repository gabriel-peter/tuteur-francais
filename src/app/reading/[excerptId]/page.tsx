"use client"
import PageHeader from "@/components/PageHeader";
import { Text } from "@/components/catalyst-ui/text";

import * as Headless from '@headlessui/react'
import React, { useState, useRef, useEffect, Fragment, ReactElement } from "react";
import { Dropdown, DropdownMenu, DropdownItem, DropdownShortcut, DropdownLabel, DropdownButton } from "@/components/catalyst-ui/dropdown";
import { Menu, MenuButton } from "@headlessui/react";
import { SimpleVocabTerm } from "@/db/models/vocab-term";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/catalyst-ui/table";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import AnnotatedExcerptModel, { AnnotatedExcerpt, MongoAnnotatedExcerpt } from "@/db/models/excerpt";
import { TextWithActions } from "@/components/TextWithActions";
import { getExerptAction, removeTermFromAnnotatedExcerpt, updateDocumentById, updateTermFromAnnotatedExcerptAction, updateTermToAnnotatedExcertAction } from "@/db/actions";
import { reverso, toTermTuple, TranslationResponse } from "@/clients/reverso";
import { Language, Term, TermTuple } from "@/db/types";
import { MongoTermTuple } from "@/db/models/TermTupleSchema";
import { Listbox, ListboxLabel, ListboxOption } from "@/components/catalyst-ui/listbox";
import { Description, Field, Label } from "@/components/catalyst-ui/fieldset";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/catalyst-ui/dialog";
import { DescriptionList, DescriptionTerm, DescriptionDetails } from "@/components/catalyst-ui/description-list";
import { Button } from "@/components/catalyst-ui/button";
import { handleKeyDown } from "@/app/utils";
import { SaveableTextArea } from "../../../components/SaveableTextArea";
import { EditablePageHeader } from "../../../components/EditablePageHeader";

export default function ReadingTool({ params }: { params: Promise<{ excerptId: string }> }) {
    const [excerpt, setExcerpt] = useState<MongoAnnotatedExcerpt>();
    const [excerptId, setExcerptId] = useState<string>();
    useEffect(() => { // Load Excerpt by Id
        params.then(params => {
            console.log("Loading Excerpt: ", params.excerptId)
            setExcerptId(params.excerptId)
            return getExerptAction(params.excerptId)
        })
            .then(JSON.parse).then((excerpt: MongoAnnotatedExcerpt) => setExcerpt(excerpt))
    }, [])
    const saveNewTerm = (selectedText: string, excerptId: string) => {
        // navigator.clipboard.writeText(selectedText);
        // alert("Text copied!");
        // return new Promise(() => { });
        return reverso(selectedText, "fr", "en")
            .then(response => toTermTuple(selectedText, response)).then(term => updateTermToAnnotatedExcertAction(term, excerptId))
            .then(JSON.parse)
            .then(updatedExcerpt => setExcerpt(updatedExcerpt))
            .catch(error => console.error(error))
    };

    function updateContent(newContent: string): Promise<void> {
        return updateDocumentById<MongoAnnotatedExcerpt>("AnnotatedExcerpt", excerpt?._id, { ...excerpt, content: newContent })
            .then(JSON.parse)
            .then(setExcerpt)
    }

    function updateTitle(newTitle: string): Promise<void> {
        return updateDocumentById<MongoAnnotatedExcerpt>("AnnotatedExcerpt", excerpt?._id, { ...excerpt, title: newTitle })
            .then(JSON.parse)
            .then(setExcerpt)
    }

    // Example placeholder function for translation
    const translateText = (selectedText: string) => {
        alert(`Translate: ${selectedText}`);
        return new Promise(() => { });
    };
    return excerpt ? (
        <>
            <EditablePageHeader title={excerpt.title} saveTitle={updateTitle}>
                <>
                    <TextWithActions
                        highlightActions={
                            (selectedText: string, closeMenu: () => void) => (
                                <>
                                    <DropdownItem onClick={() => saveNewTerm(selectedText, excerpt._id).then(closeMenu)}>
                                        <DropdownShortcut keys="⌘S" />
                                        <DropdownLabel>Save</DropdownLabel>
                                    </DropdownItem>
                                    <DropdownItem onClick={() => translateText(selectedText, excerpt._id).then(closeMenu)}>
                                        <DropdownLabel>Quick Translate</DropdownLabel>
                                        <DropdownShortcut keys="⌘T" />
                                    </DropdownItem>
                                    <DropdownItem onClick={() => translateText(selectedText, excerpt._id).then(closeMenu)}>
                                        <DropdownLabel>Speak</DropdownLabel>
                                        {/* <DropdownShortcut keys="⌘T" /> */}
                                    </DropdownItem>
                                </>)
                        }
                        body={
                            <SaveableTextArea
                                text={excerpt.content}
                                saveText={updateContent}
                            />
                        }
                    />
                </>
            </EditablePageHeader>
            {/* <div className="fixed rounded bottom-0 w-auto h-1/3 p-4 overflow-x-hidden overflow-y-scroll bg-gray-800 shadow-lg z-100"> */}
                <SavedTerms excerpt={excerpt} setExcerpt={setExcerpt} />
            {/* </div> */}
        </>
    ) :
        <div>Loading ...</div>
}

function SavedTerms({ excerpt, setExcerpt }: { excerpt: MongoAnnotatedExcerpt, setExcerpt: (x: MongoAnnotatedExcerpt) => void }) {
    function removeItem(term: TermTuple) {
        removeTermFromAnnotatedExcerpt(term, excerpt._id).then(res => JSON.parse(res)).then((updated: MongoAnnotatedExcerpt) => setExcerpt(updated))
    }

    function editItem(newTermTuple: TermTuple, oldTermTuple: TermTuple): void {
        console.log("HIT")
        updateTermFromAnnotatedExcerptAction(newTermTuple, oldTermTuple, excerpt._id).then(JSON.parse).then((updated: MongoAnnotatedExcerpt) => setExcerpt(updated))
    }

    return <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
        <TableHead>
            <TableRow>
                <TableHeader>French</TableHeader>
                <TableHeader>English</TableHeader>
                <TableHeader>Actions</TableHeader>
            </TableRow>
        </TableHead>
        <TableBody>
            {excerpt.terms.length ? (<TermTupleRows
                terms={excerpt.terms}
                removeAction={removeItem}
                editAction={editItem}
            />) : "No terms have been saved"}
        </TableBody>
    </Table>
}

// ChatGPT function 
function flattenObject(obj: Record<string, any>, parentKey = "", result: Record<string, any> = {}): Record<string, any> {
    for (let key in obj) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
            flattenObject(obj[key], newKey, result);
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}

const TermTupleDialog = ({
    termTuple,
    children
}: {
    termTuple: TermTuple,
    // I apologize in advance for this signature.
    children: ({ setIsOpen }: { setIsOpen: (x: boolean) => void }) => React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            {children({ setIsOpen })}
            <Dialog open={isOpen} onClose={setIsOpen}>
                <DialogTitle>Term</DialogTitle>
                {/* <DialogDescription>
          The refund will be reflected in the customer’s bank account 2 to 3 business days after processing.
        </DialogDescription> */}
                <DialogBody>
                    <DescriptionList>
                        {Object.entries(flattenObject(termTuple)).map(([key, value]) =>
                        (<><DescriptionTerm>{key}</DescriptionTerm>
                            <DescriptionDetails>{value}</DescriptionDetails></>))}
                    </DescriptionList>
                </DialogBody>
                <DialogActions>
                    <Button plain onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setIsOpen(false)}>Refund</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const TermReselectListbox = ({ term, editTermAction }: { term: Term, editTermAction: (x: Term) => void }) => {
    const [translationValue, setTranslationValue] = useState(term.word)

    // Detects change in state made by Listbox and causes full object change in parent.
    useEffect(() => {
        if (term.word === translationValue) return
        editTermAction({ ...term, word: translationValue })
    }, [translationValue])
    if (!term.otherPossibilies || term.otherPossibilies.length === 0) {
        return term.word
    }
    return (<Field>
        <Listbox value={translationValue} onChange={value =>
            setTranslationValue(value)
            // editTermAction({ ...term, word: value })
        }>
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
                <>
                    <TermTupleDialog termTuple={term}>
                        {({ setIsOpen }) =>
                            <TableRow key={index}>
                                <TableCell className="font-medium">{term.firstTerm.word}</TableCell>
                                <TableCell>
                                    <TermReselectListbox term={term.secondTerm} editTermAction={
                                        (newSecondTerm: Term) => {
                                            const newTermTuple: TermTuple = { ...term, ...{ secondTerm: newSecondTerm } }
                                            editAction(newTermTuple, term)
                                            console.log("New Main Translation Selected", newSecondTerm)
                                        }
                                    } />
                                </TableCell>
                                {/* <TableCell>{term.firstTerm.type}</TableCell> */}
                                <TableCell className="text-zinc-500">
                                    <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                                        <Dropdown>
                                            <DropdownButton plain aria-label="More options">
                                                <EllipsisHorizontalIcon />
                                            </DropdownButton>
                                            <DropdownMenu anchor="bottom end">
                                                {/* Shows more of TermTuple like examples */}
                                                <DropdownItem onClick={() => setIsOpen(true)}>View</DropdownItem>
                                                <DropdownItem onClick={() => removeAction(term)}>Remove</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </TableCell>
                            </TableRow>
                        }
                    </TermTupleDialog>
                </>
            ))}
        </>
    )
}


